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

type RetirementContributionInputs = {
  currentSavings: number;
  targetRetirementAmount: number;
  years: number;
  expectedReturnRate: number;
};

type RetirementContributionResult = {
  monthlyContributionRequired: number;
  projectedRetirementValue: number;
  newContributionsRequired: number;
  yearlyValues: ReturnType<typeof buildMonthlyContributionProjection>;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    {
      key: "currentSavings",
      label: "Current savings",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "1000",
      placeholder: "100000",
    },
    {
      key: "targetRetirementAmount",
      label: "Target retirement amount",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "1000",
      placeholder: "1500000",
    },
    {
      key: "years",
      label: "Years until retirement",
      type: "number",
      suffix: "years",
      min: 1,
      step: "1",
      placeholder: "25",
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
      key: "currentSavings",
      label: "当前储蓄",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "1000",
      placeholder: "100000",
    },
    {
      key: "targetRetirementAmount",
      label: "退休目标资产",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "1000",
      placeholder: "1500000",
    },
    {
      key: "years",
      label: "距离退休年数",
      type: "number",
      suffix: "年",
      min: 1,
      step: "1",
      placeholder: "25",
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
  currentSavings: "100000",
  targetRetirementAmount: "1500000",
  years: "25",
  expectedReturnRate: "7",
};

export function getRetirementContributionFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getRetirementContributionDefaultState(_locale: Locale) {
  return defaults;
}

export function parseRetirementContributionInputs(
  values: FormState,
): RetirementContributionInputs {
  return {
    currentSavings: clampNumber(parseNumber(String(values.currentSavings), 100000)),
    targetRetirementAmount: clampNumber(
      parseNumber(String(values.targetRetirementAmount), 1500000),
    ),
    years: clampNumber(Math.round(parseNumber(String(values.years), 25)), 1, 60),
    expectedReturnRate: clampNumber(
      parseNumber(String(values.expectedReturnRate), 7),
      0,
      30,
    ),
  };
}

export function calculateRetirementContribution(
  inputs: RetirementContributionInputs,
): RetirementContributionResult {
  const monthlyContributionRequired = calculateRequiredMonthlyContribution({
    targetAmount: inputs.targetRetirementAmount,
    startingAmount: inputs.currentSavings,
    annualRatePercent: inputs.expectedReturnRate,
    years: inputs.years,
  });
  const yearlyValues = buildMonthlyContributionProjection({
    initialAmount: inputs.currentSavings,
    monthlyContribution: monthlyContributionRequired,
    annualRatePercent: inputs.expectedReturnRate,
    years: inputs.years,
  });
  const projectedRetirementValue =
    yearlyValues[yearlyValues.length - 1]?.balance ?? inputs.targetRetirementAmount;

  return {
    monthlyContributionRequired,
    projectedRetirementValue,
    newContributionsRequired: monthlyContributionRequired * inputs.years * 12,
    yearlyValues,
  };
}

export function buildRetirementContributionSummary(
  result: RetirementContributionResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "每月所需退休投入",
        value: formatCompactCurrency(result.monthlyContributionRequired, locale),
        detailValue: formatCurrency(result.monthlyContributionRequired, locale),
        helperText: "在当前目标和假设下，每月需要新增投入的金额。",
        tone: "--color-accent",
      },
      {
        label: "预计退休资产",
        value: formatCompactCurrency(result.projectedRetirementValue, locale),
        detailValue: formatCurrency(result.projectedRetirementValue, locale),
        helperText: "当前储蓄与后续定投共同形成的期末资产估算。",
      },
      {
        label: "新增投入总额",
        value: formatCompactCurrency(result.newContributionsRequired, locale),
        detailValue: formatCurrency(result.newContributionsRequired, locale),
        helperText: "未来整个退休准备期内需要持续投入的总本金。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Monthly contribution required",
      value: formatCompactCurrency(result.monthlyContributionRequired, locale),
      detailValue: formatCurrency(result.monthlyContributionRequired, locale),
      helperText: "The monthly contribution needed to reach your retirement target.",
      tone: "--color-accent",
    },
    {
      label: "Projected retirement value",
      value: formatCompactCurrency(result.projectedRetirementValue, locale),
      detailValue: formatCurrency(result.projectedRetirementValue, locale),
      helperText: "The estimated portfolio value at retirement under these assumptions.",
    },
    {
      label: "Total new contributions",
      value: formatCompactCurrency(result.newContributionsRequired, locale),
      detailValue: formatCurrency(result.newContributionsRequired, locale),
      helperText: "The total new capital added during the retirement savings period.",
      tone: "--color-highlight",
    },
  ];
}

export function buildRetirementContributionChart(
  result: RetirementContributionResult,
  locale: Locale,
): ToolChartData {
  return {
    type: "line",
    title: locale === "zh" ? "退休储蓄累积路径" : "Retirement savings accumulation",
    description:
      locale === "zh"
        ? "查看当前储蓄与后续月投入如何共同累积到退休目标。"
        : "See how your current savings and required monthly contributions build over time.",
    labels: result.yearlyValues.map((point) =>
      locale === "zh" ? `${point.year} 年` : `Year ${point.year}`,
    ),
    datasets: [
      {
        label: locale === "zh" ? "组合价值" : "Portfolio value",
        data: result.yearlyValues.map((point) => point.balance),
        borderColor: "rgba(15, 155, 142, 0.92)",
        backgroundColor: "rgba(15, 155, 142, 0.18)",
      },
      {
        label: locale === "zh" ? "累计投入" : "Total contributions",
        data: result.yearlyValues.map((point) => point.contributions),
        borderColor: "rgba(99, 102, 241, 0.92)",
        backgroundColor: "rgba(99, 102, 241, 0.18)",
      },
    ],
    valuePrefix: "$",
  };
}
