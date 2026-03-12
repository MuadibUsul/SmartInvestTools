import {
  buildMonthlyContributionProjection,
  calculateRequiredMonthlyContribution,
} from "@/lib/financial";
import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  parseNumber,
} from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type {
  FormState,
  ResultCard,
  ToolChartData,
  ToolFieldConfig,
} from "@/lib/types";

type MonthlyInvestmentInputs = {
  targetAmount: number;
  years: number;
  expectedReturnRate: number;
};

type MonthlyInvestmentResult = {
  monthlyInvestmentRequired: number;
  totalContributions: number;
  projectedEndingValue: number;
  yearlyValues: ReturnType<typeof buildMonthlyContributionProjection>;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    {
      key: "targetAmount",
      label: "Target amount",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "1000",
      placeholder: "500000",
    },
    {
      key: "years",
      label: "Time horizon",
      type: "number",
      suffix: "years",
      min: 1,
      step: "1",
      placeholder: "15",
    },
    {
      key: "expectedReturnRate",
      label: "Expected annual return",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.1",
      placeholder: "7",
    },
  ],
  zh: [
    {
      key: "targetAmount",
      label: "目标金额",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "1000",
      placeholder: "500000",
    },
    {
      key: "years",
      label: "投资期限",
      type: "number",
      suffix: "年",
      min: 1,
      step: "1",
      placeholder: "15",
    },
    {
      key: "expectedReturnRate",
      label: "预期年化收益率",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.1",
      placeholder: "7",
    },
  ],
};

const defaults: FormState = {
  targetAmount: "500000",
  years: "15",
  expectedReturnRate: "7",
};

export function getMonthlyInvestmentFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getMonthlyInvestmentDefaultState(_locale: Locale) {
  return defaults;
}

export function parseMonthlyInvestmentInputs(
  values: FormState,
): MonthlyInvestmentInputs {
  return {
    targetAmount: clampNumber(parseNumber(String(values.targetAmount), 500000)),
    years: clampNumber(Math.round(parseNumber(String(values.years), 15)), 1, 60),
    expectedReturnRate: clampNumber(
      parseNumber(String(values.expectedReturnRate), 7),
      0,
      30,
    ),
  };
}

export function calculateMonthlyInvestment(
  inputs: MonthlyInvestmentInputs,
): MonthlyInvestmentResult {
  const monthlyInvestmentRequired = calculateRequiredMonthlyContribution({
    targetAmount: inputs.targetAmount,
    startingAmount: 0,
    annualRatePercent: inputs.expectedReturnRate,
    years: inputs.years,
  });
  const yearlyValues = buildMonthlyContributionProjection({
    initialAmount: 0,
    monthlyContribution: monthlyInvestmentRequired,
    annualRatePercent: inputs.expectedReturnRate,
    years: inputs.years,
  });
  const projectedEndingValue =
    yearlyValues[yearlyValues.length - 1]?.balance ?? inputs.targetAmount;

  return {
    monthlyInvestmentRequired,
    totalContributions: monthlyInvestmentRequired * inputs.years * 12,
    projectedEndingValue,
    yearlyValues,
  };
}

export function buildMonthlyInvestmentSummary(
  result: MonthlyInvestmentResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "每月所需投资",
        value: formatCompactCurrency(result.monthlyInvestmentRequired, locale),
        detailValue: formatCurrency(result.monthlyInvestmentRequired, locale),
        helperText: "按当前假设，为达到目标金额每月需要投入的金额。",
        tone: "--color-accent",
      },
      {
        label: "累计投入本金",
        value: formatCompactCurrency(result.totalContributions, locale),
        detailValue: formatCurrency(result.totalContributions, locale),
        helperText: "整个期限内预计投入的总本金。",
      },
      {
        label: "期末资产估算",
        value: formatCompactCurrency(result.projectedEndingValue, locale),
        detailValue: formatCurrency(result.projectedEndingValue, locale),
        helperText: "按照所需月投入反推后的目标期末资产。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Monthly investment required",
      value: formatCompactCurrency(result.monthlyInvestmentRequired, locale),
      detailValue: formatCurrency(result.monthlyInvestmentRequired, locale),
      helperText: "The monthly amount needed to reach your target under these assumptions.",
      tone: "--color-accent",
    },
    {
      label: "Total contributions",
      value: formatCompactCurrency(result.totalContributions, locale),
      detailValue: formatCurrency(result.totalContributions, locale),
      helperText: "The total capital contributed across the full timeline.",
    },
    {
      label: "Projected ending value",
      value: formatCompactCurrency(result.projectedEndingValue, locale),
      detailValue: formatCurrency(result.projectedEndingValue, locale),
      helperText: "The ending balance implied by the required monthly contribution.",
      tone: "--color-highlight",
    },
  ];
}

export function buildMonthlyInvestmentChart(
  result: MonthlyInvestmentResult,
  locale: Locale,
): ToolChartData {
  return {
    type: "line",
    title: locale === "zh" ? "按月投资增长路径" : "Monthly investment growth path",
    description:
      locale === "zh"
        ? "查看所需月投入在整个期限内如何逐步累积到目标规模。"
        : "See how the required monthly contribution compounds toward the target.",
    labels: result.yearlyValues.map((point) =>
      locale === "zh" ? `${point.year} 年` : `Year ${point.year}`,
    ),
    datasets: [
      {
        label: locale === "zh" ? "投资组合价值" : "Portfolio value",
        data: result.yearlyValues.map((point) => point.balance),
        borderColor: "rgba(15, 155, 142, 0.92)",
        backgroundColor: "rgba(15, 155, 142, 0.18)",
      },
      {
        label: locale === "zh" ? "累计投入" : "Total contributions",
        data: result.yearlyValues.map((point) => point.contributions),
        borderColor: "rgba(245, 158, 11, 0.92)",
        backgroundColor: "rgba(245, 158, 11, 0.18)",
      },
    ],
    valuePrefix: "$",
  };
}
