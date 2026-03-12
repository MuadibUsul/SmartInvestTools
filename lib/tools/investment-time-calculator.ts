import {
  buildMonthlyContributionProjection,
  formatMonthsAsYears,
  solveMonthsToGoal,
} from "@/lib/financial";
import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  parseNumber,
} from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type {
  FormState,
  ResultCard,
  ToolChartData,
  ToolFieldConfig,
} from "@/lib/types";

type InvestmentTimeInputs = {
  initialAmount: number;
  targetAmount: number;
  annualReturnRate: number;
  monthlyContribution: number;
};

type InvestmentTimeResult = {
  monthsToGoal: number | null;
  totalContributionsToGoal: number;
  projectionYears: number;
  yearlyValues: ReturnType<typeof buildMonthlyContributionProjection>;
  targetAmount: number;
};

const MAX_MONTHS = 1200;

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    {
      key: "initialAmount",
      label: "Initial amount",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "1000",
      placeholder: "50000",
    },
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
      key: "annualReturnRate",
      label: "Expected annual return",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.1",
      placeholder: "7",
    },
    {
      key: "monthlyContribution",
      label: "Monthly contribution",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "800",
    },
  ],
  zh: [
    {
      key: "initialAmount",
      label: "初始金额",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "1000",
      placeholder: "50000",
    },
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
      key: "annualReturnRate",
      label: "预期年化收益率",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.1",
      placeholder: "7",
    },
    {
      key: "monthlyContribution",
      label: "每月投入",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "800",
    },
  ],
};

const defaults: FormState = {
  initialAmount: "50000",
  targetAmount: "500000",
  annualReturnRate: "7",
  monthlyContribution: "800",
};

export function getInvestmentTimeFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getInvestmentTimeDefaultState(_locale: Locale) {
  return defaults;
}

export function parseInvestmentTimeInputs(
  values: FormState,
): InvestmentTimeInputs {
  return {
    initialAmount: clampNumber(parseNumber(String(values.initialAmount), 50000)),
    targetAmount: clampNumber(parseNumber(String(values.targetAmount), 500000)),
    annualReturnRate: clampNumber(
      parseNumber(String(values.annualReturnRate), 7),
      0,
      30,
    ),
    monthlyContribution: clampNumber(
      parseNumber(String(values.monthlyContribution), 800),
    ),
  };
}

export function calculateInvestmentTime(
  inputs: InvestmentTimeInputs,
): InvestmentTimeResult {
  const monthsToGoal = solveMonthsToGoal({
    startingAmount: inputs.initialAmount,
    targetAmount: inputs.targetAmount,
    annualRatePercent: inputs.annualReturnRate,
    monthlyContribution: inputs.monthlyContribution,
    maxMonths: MAX_MONTHS,
  });
  const projectionYears = monthsToGoal
    ? Math.max(1, Math.ceil(monthsToGoal / 12))
    : 40;
  const yearlyValues = buildMonthlyContributionProjection({
    initialAmount: inputs.initialAmount,
    monthlyContribution: inputs.monthlyContribution,
    annualRatePercent: inputs.annualReturnRate,
    years: projectionYears,
  });

  return {
    monthsToGoal,
    totalContributionsToGoal:
      inputs.initialAmount +
      inputs.monthlyContribution * (monthsToGoal ?? projectionYears * 12),
    projectionYears,
    yearlyValues,
    targetAmount: inputs.targetAmount,
  };
}

export function buildInvestmentTimeSummary(
  result: InvestmentTimeResult,
  locale: Locale,
): ResultCard[] {
  const timeValue =
    result.monthsToGoal === null
      ? locale === "zh"
        ? "100 年内未达到"
        : "Not reached in 100 years"
      : locale === "zh"
        ? `${formatNumber(formatMonthsAsYears(result.monthsToGoal, 1), locale, 1)} 年`
        : `${formatNumber(formatMonthsAsYears(result.monthsToGoal, 1), locale, 1)} years`;

  if (locale === "zh") {
    return [
      {
        label: "达到目标所需时间",
        value: timeValue,
        helperText: "基于当前本金、月投入和收益率假设的估算时间。",
        tone: "--color-accent",
        wrapValue: result.monthsToGoal === null,
      },
      {
        label: "达到目标前累计投入",
        value: formatCompactCurrency(result.totalContributionsToGoal, locale),
        detailValue: formatCurrency(result.totalContributionsToGoal, locale),
        helperText: "在目标达成前累计投入的本金规模。",
      },
      {
        label: "目标金额",
        value: formatCompactCurrency(result.targetAmount, locale),
        detailValue: formatCurrency(result.targetAmount, locale),
        helperText: "你设定的目标资产门槛。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Time to reach target",
      value: timeValue,
      helperText: "Estimated time based on your starting capital, monthly contribution, and return assumption.",
      tone: "--color-accent",
      wrapValue: result.monthsToGoal === null,
    },
    {
      label: "Total contributions before goal",
      value: formatCompactCurrency(result.totalContributionsToGoal, locale),
      detailValue: formatCurrency(result.totalContributionsToGoal, locale),
      helperText: "The total principal contributed before the target is reached.",
    },
    {
      label: "Target amount",
      value: formatCompactCurrency(result.targetAmount, locale),
      detailValue: formatCurrency(result.targetAmount, locale),
      helperText: "The portfolio threshold you are trying to reach.",
      tone: "--color-highlight",
    },
  ];
}

export function buildInvestmentTimeChart(
  result: InvestmentTimeResult,
  locale: Locale,
): ToolChartData {
  return {
    type: "line",
    title: locale === "zh" ? "目标达成进度" : "Progress toward goal",
    description:
      locale === "zh"
        ? "对比资产增长路径与目标金额，查看何时可能达到目标。"
        : "Compare your portfolio path with the target amount over time.",
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
        label: locale === "zh" ? "目标金额" : "Target amount",
        data: result.yearlyValues.map(() => result.targetAmount),
        borderColor: "rgba(245, 158, 11, 0.92)",
        backgroundColor: "rgba(245, 158, 11, 0.18)",
      },
    ],
    valuePrefix: "$",
  };
}
