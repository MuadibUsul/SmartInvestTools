import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  parseNumber,
} from "@/lib/format";
import type { FormState, ResultCard, ToolChartData, ToolFieldConfig } from "@/lib/types";

export type RetirementFireInputs = {
  currentSavings: number;
  annualExpenses: number;
  expectedReturnRate: number;
  yearsUntilRetirement: number;
};

export type RetirementFireResult = {
  estimatedRetirementPortfolioValue: number;
  estimatedRetirementYear: number;
  fireTarget: number;
  yearlyBalances: { year: number; balance: number }[];
};

export const retirementFireFields: ToolFieldConfig[] = [
  {
    key: "currentSavings",
    label: "Current savings",
    type: "currency",
    prefix: "$",
    min: 0,
    step: "1000",
    placeholder: "150000",
  },
  {
    key: "annualExpenses",
    label: "Annual expenses",
    type: "currency",
    prefix: "$",
    min: 0,
    step: "1000",
    placeholder: "50000",
  },
  {
    key: "expectedReturnRate",
    label: "Expected return rate",
    type: "percentage",
    suffix: "%",
    min: 0,
    step: "0.1",
    placeholder: "7",
  },
  {
    key: "yearsUntilRetirement",
    label: "Years until retirement",
    type: "number",
    suffix: "years",
    min: 1,
    step: "1",
    placeholder: "15",
  },
];

export const retirementFireDefaults: FormState = {
  currentSavings: "150000",
  annualExpenses: "50000",
  expectedReturnRate: "7",
  yearsUntilRetirement: "15",
};

export function parseRetirementFireInputs(values: FormState): RetirementFireInputs {
  return {
    currentSavings: clampNumber(parseNumber(String(values.currentSavings), 150000)),
    annualExpenses: clampNumber(parseNumber(String(values.annualExpenses), 50000)),
    expectedReturnRate: clampNumber(
      parseNumber(String(values.expectedReturnRate), 7),
      0,
      100,
    ),
    yearsUntilRetirement: clampNumber(
      Math.round(parseNumber(String(values.yearsUntilRetirement), 15)),
      1,
      80,
    ),
  };
}

export function calculateRetirementFire(
  inputs: RetirementFireInputs,
): RetirementFireResult {
  const annualRate = inputs.expectedReturnRate / 100;
  const yearlyBalances: { year: number; balance: number }[] = [];
  let balance = inputs.currentSavings;
  const currentYear = new Date().getFullYear();

  for (let year = 1; year <= inputs.yearsUntilRetirement; year += 1) {
    balance *= 1 + annualRate;
    yearlyBalances.push({
      year: currentYear + year,
      balance,
    });
  }

  return {
    estimatedRetirementPortfolioValue: balance,
    estimatedRetirementYear: currentYear + inputs.yearsUntilRetirement,
    fireTarget: inputs.annualExpenses * 25,
    yearlyBalances,
  };
}

export function buildRetirementFireSummary(
  result: RetirementFireResult,
): ResultCard[] {
  return [
    {
      label: "Estimated retirement portfolio value",
      value: formatCompactCurrency(result.estimatedRetirementPortfolioValue),
      detailValue: formatCurrency(result.estimatedRetirementPortfolioValue),
      helperText: "Projected value of your savings by retirement.",
      tone: "--color-accent",
    },
    {
      label: "Estimated retirement year",
      value: String(result.estimatedRetirementYear),
      helperText: "Calendar year based on your selected timeline.",
      tone: "--color-highlight",
    },
    {
      label: "Target portfolio at 25x expenses",
      value: formatCompactCurrency(result.fireTarget),
      detailValue: formatCurrency(result.fireTarget),
      helperText: "A common FIRE shorthand based on annual spending.",
    },
  ];
}

export function buildRetirementFireChart(
  result: RetirementFireResult,
): ToolChartData {
  return {
    type: "bar",
    title: "Retirement value projection",
    description: "A simplified year-by-year balance forecast using expected returns.",
    labels: result.yearlyBalances.map((point) => point.year.toString()),
    datasets: [
      {
        label: "Projected balance",
        data: result.yearlyBalances.map((point) => point.balance),
        borderColor: "rgba(59, 130, 246, 0.92)",
        backgroundColor: "rgba(59, 130, 246, 0.72)",
      },
    ],
    valuePrefix: "$",
  };
}
