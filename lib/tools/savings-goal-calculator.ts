import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  parseNumber,
} from "@/lib/format";
import {
  buildMonthlyContributionProjection,
  futureValueOfMonthlyContributions,
  formatMonthsAsYears,
  solveMonthsToGoal,
} from "@/lib/financial";
import type { Locale } from "@/lib/i18n";
import type {
  FormState,
  ResultCard,
  ToolChartData,
  ToolFieldConfig,
} from "@/lib/types";

type SavingsGoalInputs = {
  targetAmount: number;
  currentSavings: number;
  monthlySavings: number;
  annualReturn: number;
};

type SavingsGoalResult = {
  monthsToGoal: number | null;
  projectedBalance: number;
  targetGap: number;
  yearlyBalances: Array<{
    year: number;
    balance: number;
  }>;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    { key: "targetAmount", label: "Target amount", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "100000" },
    { key: "currentSavings", label: "Current savings", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "15000" },
    { key: "monthlySavings", label: "Monthly savings", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "800" },
    { key: "annualReturn", label: "Expected annual return", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "6" },
  ],
  zh: [
    { key: "targetAmount", label: "目标金额", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "100000" },
    { key: "currentSavings", label: "当前储蓄", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "15000" },
    { key: "monthlySavings", label: "每月储蓄", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "800" },
    { key: "annualReturn", label: "预期年化收益", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "6" },
  ],
};

const defaults: FormState = {
  targetAmount: "100000",
  currentSavings: "15000",
  monthlySavings: "800",
  annualReturn: "6",
};

function formatTimeline(months: number | null, locale: Locale) {
  if (months === null) {
    return locale === "zh" ? "50 年内未达到" : "Not reached within 50 years";
  }

  return locale === "zh"
    ? `${formatNumber(formatMonthsAsYears(months), locale, 1)} 年`
    : `${formatNumber(formatMonthsAsYears(months), locale, 1)} years`;
}

export function getSavingsGoalFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getSavingsGoalDefaultState(_locale: Locale) {
  return defaults;
}

export function parseSavingsGoalInputs(values: FormState): SavingsGoalInputs {
  return {
    targetAmount: clampNumber(parseNumber(String(values.targetAmount), 100000)),
    currentSavings: clampNumber(parseNumber(String(values.currentSavings), 15000)),
    monthlySavings: clampNumber(parseNumber(String(values.monthlySavings), 800)),
    annualReturn: clampNumber(parseNumber(String(values.annualReturn), 6), 0, 100),
  };
}

export function calculateSavingsGoal(
  inputs: SavingsGoalInputs,
): SavingsGoalResult {
  const monthsToGoal = solveMonthsToGoal({
    startingAmount: inputs.currentSavings,
    targetAmount: inputs.targetAmount,
    annualRatePercent: inputs.annualReturn,
    monthlyContribution: inputs.monthlySavings,
    maxMonths: 600,
  });
  const yearsToProject = monthsToGoal
    ? Math.max(Math.ceil(monthsToGoal / 12), 1)
    : 50;
  const yearlyBalances = buildMonthlyContributionProjection({
    initialAmount: inputs.currentSavings,
    monthlyContribution: inputs.monthlySavings,
    annualRatePercent: inputs.annualReturn,
    years: yearsToProject,
  }).map((point) => ({
    year: point.year,
    balance: point.balance,
  }));
  const projectedBalance =
    yearlyBalances[yearlyBalances.length - 1]?.balance ??
    futureValueOfMonthlyContributions({
      initialAmount: inputs.currentSavings,
      monthlyContribution: inputs.monthlySavings,
      annualRatePercent: inputs.annualReturn,
      years: yearsToProject,
    });

  return {
    monthsToGoal,
    projectedBalance,
    targetGap: Math.max(inputs.targetAmount - inputs.currentSavings, 0),
    yearlyBalances,
  };
}

export function buildSavingsGoalSummary(
  result: SavingsGoalResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "预计达成时间",
        value: formatTimeline(result.monthsToGoal, locale),
        helperText: "基于当前储蓄、每月投入与收益假设推算的目标达成时间。",
        tone: "--color-accent",
      },
      {
        label: "当前目标缺口",
        value: formatCompactCurrency(result.targetGap, locale),
        detailValue: formatCurrency(result.targetGap, locale),
        helperText: "目标金额减去当前储蓄后的差额。",
      },
      {
        label: "预测期末余额",
        value: formatCompactCurrency(result.projectedBalance, locale),
        detailValue: formatCurrency(result.projectedBalance, locale),
        helperText: "在当前假设下，到预测终点时可能达到的余额。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Estimated time to goal",
      value: formatTimeline(result.monthsToGoal, locale),
      helperText:
        "The projected time required to reach your target under the current assumptions.",
      tone: "--color-accent",
    },
    {
      label: "Current goal gap",
      value: formatCompactCurrency(result.targetGap, locale),
      detailValue: formatCurrency(result.targetGap, locale),
      helperText: "The difference between your target and current savings today.",
    },
    {
      label: "Projected ending balance",
      value: formatCompactCurrency(result.projectedBalance, locale),
      detailValue: formatCurrency(result.projectedBalance, locale),
      helperText:
        "The balance you could reach by the end of the modeled projection.",
      tone: "--color-highlight",
    },
  ];
}

export function buildSavingsGoalChart(
  result: SavingsGoalResult,
  locale: Locale,
): ToolChartData {
  return {
    type: "line",
    title: locale === "zh" ? "储蓄目标进度" : "Savings goal progress",
    description:
      locale === "zh"
        ? "查看余额如何随着每月储蓄与复利增长逐步接近目标。"
        : "Track how regular savings and compounding move you toward the goal.",
    labels: result.yearlyBalances.map((point) =>
      locale === "zh" ? `${point.year} 年` : `Year ${point.year}`,
    ),
    datasets: [
      {
        label: locale === "zh" ? "预测余额" : "Projected balance",
        data: result.yearlyBalances.map((point) => point.balance),
        borderColor: "rgba(15, 155, 142, 0.92)",
        backgroundColor: "rgba(15, 155, 142, 0.18)",
      },
    ],
    valuePrefix: "$",
  };
}

