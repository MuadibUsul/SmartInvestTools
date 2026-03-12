import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  parseNumber,
} from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolChartData, ToolFieldConfig } from "@/lib/types";

export type CompoundInterestInputs = {
  initialInvestment: number;
  monthlyContribution: number;
  annualInterestRate: number;
  investmentPeriodYears: number;
};

export type CompoundInterestYearPoint = {
  year: number;
  endingBalance: number;
  totalContributions: number;
};

export type CompoundInterestResult = {
  finalInvestmentValue: number;
  totalContributions: number;
  totalInterestEarned: number;
  yearlyGrowth: CompoundInterestYearPoint[];
};

const compoundInterestFieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    {
      key: "initialInvestment",
      label: "Initial investment",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "10000",
    },
    {
      key: "monthlyContribution",
      label: "Monthly contribution",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "50",
      placeholder: "500",
    },
    {
      key: "annualInterestRate",
      label: "Annual interest rate",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.1",
      placeholder: "8",
    },
    {
      key: "investmentPeriodYears",
      label: "Investment period",
      type: "number",
      suffix: "years",
      min: 1,
      step: "1",
      placeholder: "25",
    },
  ],
  zh: [
    {
      key: "initialInvestment",
      label: "初始投入",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "10000",
    },
    {
      key: "monthlyContribution",
      label: "每月追加",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "50",
      placeholder: "500",
    },
    {
      key: "annualInterestRate",
      label: "年化收益率",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.1",
      placeholder: "8",
    },
    {
      key: "investmentPeriodYears",
      label: "投资期限",
      type: "number",
      suffix: "年",
      min: 1,
      step: "1",
      placeholder: "25",
    },
  ],
};

const compoundInterestDefaults: FormState = {
  initialInvestment: "10000",
  monthlyContribution: "500",
  annualInterestRate: "8",
  investmentPeriodYears: "25",
};

export function getCompoundInterestFields(locale: Locale) {
  return compoundInterestFieldsByLocale[locale];
}

export function getCompoundInterestDefaultState(_locale: Locale) {
  return compoundInterestDefaults;
}

export function parseCompoundInterestInputs(values: FormState): CompoundInterestInputs {
  return {
    initialInvestment: clampNumber(parseNumber(String(values.initialInvestment), 10000)),
    monthlyContribution: clampNumber(parseNumber(String(values.monthlyContribution), 500)),
    annualInterestRate: clampNumber(
      parseNumber(String(values.annualInterestRate), 8),
      0,
      100,
    ),
    investmentPeriodYears: clampNumber(
      Math.round(parseNumber(String(values.investmentPeriodYears), 25)),
      1,
      100,
    ),
  };
}

export function calculateCompoundInterest(
  inputs: CompoundInterestInputs,
): CompoundInterestResult {
  const monthlyRate = inputs.annualInterestRate / 100 / 12;
  const totalMonths = inputs.investmentPeriodYears * 12;
  let balance = inputs.initialInvestment;
  let contributions = inputs.initialInvestment;
  const yearlyGrowth: CompoundInterestYearPoint[] = [];

  for (let month = 1; month <= totalMonths; month += 1) {
    balance = balance * (1 + monthlyRate) + inputs.monthlyContribution;
    contributions += inputs.monthlyContribution;

    if (month % 12 === 0) {
      yearlyGrowth.push({
        year: month / 12,
        endingBalance: balance,
        totalContributions: contributions,
      });
    }
  }

  const finalInvestmentValue = balance;
  const totalContributions = contributions;
  const totalInterestEarned = finalInvestmentValue - totalContributions;

  return {
    finalInvestmentValue,
    totalContributions,
    totalInterestEarned,
    yearlyGrowth,
  };
}

export function buildCompoundInterestSummary(
  result: CompoundInterestResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "期末资产价值",
        value: formatCompactCurrency(result.finalInvestmentValue, locale),
        detailValue: formatCurrency(result.finalInvestmentValue, locale),
        helperText: "投资周期结束时的预计资产规模。",
        tone: "--color-accent",
      },
      {
        label: "累计投入本金",
        value: formatCompactCurrency(result.totalContributions, locale),
        detailValue: formatCurrency(result.totalContributions, locale),
        helperText: "包含初始投入在内的全部本金合计。",
      },
      {
        label: "累计复利收益",
        value: formatCompactCurrency(result.totalInterestEarned, locale),
        detailValue: formatCurrency(result.totalInterestEarned, locale),
        helperText: "由复利增长带来的预计收益部分。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Final investment value",
      value: formatCompactCurrency(result.finalInvestmentValue, locale),
      detailValue: formatCurrency(result.finalInvestmentValue, locale),
      helperText: "Projected portfolio value at the end of the investment period.",
      tone: "--color-accent",
    },
    {
      label: "Total contributions",
      value: formatCompactCurrency(result.totalContributions, locale),
      detailValue: formatCurrency(result.totalContributions, locale),
      helperText: "Total principal invested, including your initial amount.",
    },
    {
      label: "Total interest earned",
      value: formatCompactCurrency(result.totalInterestEarned, locale),
      detailValue: formatCurrency(result.totalInterestEarned, locale),
      helperText: "Estimated growth generated by compound returns.",
      tone: "--color-highlight",
    },
  ];
}

export function buildCompoundInterestChart(
  result: CompoundInterestResult,
  locale: Locale,
): ToolChartData {
  if (locale === "zh") {
    return {
      type: "line",
      title: "按年份查看投资增长",
      description: "观察持续投入和复利如何在时间中共同放大资产。",
      labels: result.yearlyGrowth.map((point) => `第${point.year}年`),
      datasets: [
        {
          label: "投资组合价值",
          data: result.yearlyGrowth.map((point) => point.endingBalance),
          borderColor: "rgba(15, 155, 142, 0.95)",
          backgroundColor: "rgba(15, 155, 142, 0.16)",
        },
        {
          label: "累计投入",
          data: result.yearlyGrowth.map((point) => point.totalContributions),
          borderColor: "rgba(245, 158, 11, 0.92)",
          backgroundColor: "rgba(245, 158, 11, 0.12)",
        },
      ],
      valuePrefix: "$",
    };
  }

  return {
    type: "line",
    title: "Investment growth by year",
    description:
      "See how contributions and compounding work together over time.",
    labels: result.yearlyGrowth.map((point) => `Year ${point.year}`),
    datasets: [
      {
        label: "Portfolio value",
        data: result.yearlyGrowth.map((point) => point.endingBalance),
        borderColor: "rgba(15, 155, 142, 0.95)",
        backgroundColor: "rgba(15, 155, 142, 0.16)",
      },
      {
        label: "Total contributions",
        data: result.yearlyGrowth.map((point) => point.totalContributions),
        borderColor: "rgba(245, 158, 11, 0.92)",
        backgroundColor: "rgba(245, 158, 11, 0.12)",
      },
    ],
    valuePrefix: "$",
  };
}
