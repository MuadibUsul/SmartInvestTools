import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  parseNumber,
} from "@/lib/format";
import type { Locale } from "@/lib/i18n";
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

const retirementFireFieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
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
  ],
  zh: [
    {
      key: "currentSavings",
      label: "当前储蓄",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "1000",
      placeholder: "150000",
    },
    {
      key: "annualExpenses",
      label: "年支出",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "1000",
      placeholder: "50000",
    },
    {
      key: "expectedReturnRate",
      label: "预期收益率",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.1",
      placeholder: "7",
    },
    {
      key: "yearsUntilRetirement",
      label: "距退休年数",
      type: "number",
      suffix: "年",
      min: 1,
      step: "1",
      placeholder: "15",
    },
  ],
};

const retirementFireDefaults: FormState = {
  currentSavings: "150000",
  annualExpenses: "50000",
  expectedReturnRate: "7",
  yearsUntilRetirement: "15",
};

export function getRetirementFireFields(locale: Locale) {
  return retirementFireFieldsByLocale[locale];
}

export function getRetirementFireDefaultState(_locale: Locale) {
  return retirementFireDefaults;
}

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
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "预计退休资产",
        value: formatCompactCurrency(
          result.estimatedRetirementPortfolioValue,
          locale,
        ),
        detailValue: formatCurrency(
          result.estimatedRetirementPortfolioValue,
          locale,
        ),
        helperText: "按当前假设推算，到退休时的预计资产规模。",
        tone: "--color-accent",
      },
      {
        label: "预计退休年份",
        value: String(result.estimatedRetirementYear),
        helperText: "根据你设定的年数推算出的日历年份。",
        tone: "--color-highlight",
      },
      {
        label: "25 倍支出目标资产",
        value: formatCompactCurrency(result.fireTarget, locale),
        detailValue: formatCurrency(result.fireTarget, locale),
        helperText: "基于年支出 25 倍规则得到的常见 FIRE 目标。",
      },
    ];
  }

  return [
    {
      label: "Estimated retirement portfolio value",
      value: formatCompactCurrency(result.estimatedRetirementPortfolioValue, locale),
      detailValue: formatCurrency(result.estimatedRetirementPortfolioValue, locale),
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
      value: formatCompactCurrency(result.fireTarget, locale),
      detailValue: formatCurrency(result.fireTarget, locale),
      helperText: "A common FIRE shorthand based on annual spending.",
    },
  ];
}

export function buildRetirementFireChart(
  result: RetirementFireResult,
  locale: Locale,
): ToolChartData {
  if (locale === "zh") {
    return {
      type: "bar",
      title: "退休资产预测",
      description: "基于预期收益率，按年份查看资产余额的简化变化。",
      labels: result.yearlyBalances.map((point) => point.year.toString()),
      datasets: [
        {
          label: "预计余额",
          data: result.yearlyBalances.map((point) => point.balance),
          borderColor: "rgba(59, 130, 246, 0.92)",
          backgroundColor: "rgba(59, 130, 246, 0.72)",
        },
      ],
      valuePrefix: "$",
    };
  }

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
