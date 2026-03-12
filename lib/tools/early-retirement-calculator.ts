import { buildAnnualContributionProjection } from "@/lib/financial";
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

type EarlyRetirementInputs = {
  currentAge: number;
  currentSavings: number;
  annualExpenses: number;
  annualReturnRate: number;
  yearlyContribution: number;
};

type EarlyRetirementResult = {
  targetPortfolio: number;
  estimatedRetirementAge: number;
  estimatedRetirementYear: number;
  yearsUntilRetirement: number;
  yearlyValues: Array<{
    year: number;
    balance: number;
    targetPortfolio: number;
  }>;
};

const CURRENT_YEAR = new Date().getFullYear();

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    { key: "currentAge", label: "Current age", type: "number", min: 18, max: 80, step: "1", placeholder: "35" },
    { key: "currentSavings", label: "Current savings", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "250000" },
    { key: "annualExpenses", label: "Annual expenses", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "50000" },
    { key: "annualReturnRate", label: "Expected annual return", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "7" },
    { key: "yearlyContribution", label: "Yearly contribution", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "30000" },
  ],
  zh: [
    { key: "currentAge", label: "当前年龄", type: "number", min: 18, max: 80, step: "1", placeholder: "35" },
    { key: "currentSavings", label: "当前储蓄", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "250000" },
    { key: "annualExpenses", label: "年度支出", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "50000" },
    { key: "annualReturnRate", label: "预期年化收益率", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "7" },
    { key: "yearlyContribution", label: "每年新增投入", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "30000" },
  ],
};

const defaults: FormState = {
  currentAge: "35",
  currentSavings: "250000",
  annualExpenses: "50000",
  annualReturnRate: "7",
  yearlyContribution: "30000",
};

export function getEarlyRetirementFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getEarlyRetirementDefaultState(_locale: Locale) {
  return defaults;
}

export function parseEarlyRetirementInputs(
  values: FormState,
): EarlyRetirementInputs {
  return {
    currentAge: clampNumber(Math.round(parseNumber(String(values.currentAge), 35)), 18, 80),
    currentSavings: clampNumber(parseNumber(String(values.currentSavings), 250000)),
    annualExpenses: clampNumber(parseNumber(String(values.annualExpenses), 50000)),
    annualReturnRate: clampNumber(
      parseNumber(String(values.annualReturnRate), 7),
      0,
      30,
    ),
    yearlyContribution: clampNumber(
      parseNumber(String(values.yearlyContribution), 30000),
    ),
  };
}

export function calculateEarlyRetirement(
  inputs: EarlyRetirementInputs,
): EarlyRetirementResult {
  const targetPortfolio = inputs.annualExpenses * 25;

  if (inputs.currentSavings >= targetPortfolio) {
    return {
      targetPortfolio,
      estimatedRetirementAge: inputs.currentAge,
      estimatedRetirementYear: CURRENT_YEAR,
      yearsUntilRetirement: 0,
      yearlyValues: [
        {
          year: CURRENT_YEAR,
          balance: inputs.currentSavings,
          targetPortfolio,
        },
      ],
    };
  }

  const projection = buildAnnualContributionProjection({
    initialAmount: inputs.currentSavings,
    annualContribution: inputs.yearlyContribution,
    annualRatePercent: inputs.annualReturnRate,
    years: 60,
  });
  const retirementPoint =
    projection.find((point) => point.balance >= targetPortfolio) ??
    projection[projection.length - 1];
  const yearsUntilRetirement = retirementPoint.year;

  return {
    targetPortfolio,
    estimatedRetirementAge: inputs.currentAge + yearsUntilRetirement,
    estimatedRetirementYear: CURRENT_YEAR + yearsUntilRetirement,
    yearsUntilRetirement,
    yearlyValues: projection
      .slice(0, Math.max(yearsUntilRetirement, 1))
      .map((point) => ({
        year: CURRENT_YEAR + point.year,
        balance: point.balance,
        targetPortfolio,
      })),
  };
}

export function buildEarlyRetirementSummary(
  result: EarlyRetirementResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "FIRE 目标资产",
        value: formatCompactCurrency(result.targetPortfolio, locale),
        detailValue: formatCurrency(result.targetPortfolio, locale),
        helperText: "按年支出 25 倍规则估算的提前退休目标资产。",
        tone: "--color-accent",
      },
      {
        label: "预计退休年龄",
        value: formatNumber(result.estimatedRetirementAge, locale),
        helperText: "在当前储蓄、收益率与每年投入假设下的估算年龄。",
      },
      {
        label: "预计退休年份",
        value: formatNumber(result.estimatedRetirementYear, locale),
        helperText: "达到目标资产时对应的日历年份。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "FIRE target",
      value: formatCompactCurrency(result.targetPortfolio, locale),
      detailValue: formatCurrency(result.targetPortfolio, locale),
      helperText: "A simple 25x annual expenses estimate for early retirement.",
      tone: "--color-accent",
    },
    {
      label: "Estimated retirement age",
      value: formatNumber(result.estimatedRetirementAge, locale),
      helperText: "The estimated age at which your portfolio reaches the FIRE target.",
    },
    {
      label: "Estimated retirement year",
      value: formatNumber(result.estimatedRetirementYear, locale),
      helperText: "The projected calendar year when the target is reached.",
      tone: "--color-highlight",
    },
  ];
}

export function buildEarlyRetirementChart(
  result: EarlyRetirementResult,
  locale: Locale,
): ToolChartData {
  return {
    type: "line",
    title: locale === "zh" ? "提前退休进度路径" : "Early retirement progress path",
    description:
      locale === "zh"
        ? "查看组合价值何时达到基于支出的 FIRE 目标。"
        : "See when your portfolio reaches the expense-based FIRE target.",
    labels: result.yearlyValues.map((point) => String(point.year)),
    datasets: [
      {
        label: locale === "zh" ? "组合价值" : "Portfolio value",
        data: result.yearlyValues.map((point) => point.balance),
        borderColor: "rgba(15, 155, 142, 0.92)",
        backgroundColor: "rgba(15, 155, 142, 0.18)",
      },
      {
        label: locale === "zh" ? "FIRE 目标" : "FIRE target",
        data: result.yearlyValues.map((point) => point.targetPortfolio),
        borderColor: "rgba(245, 158, 11, 0.92)",
        backgroundColor: "rgba(245, 158, 11, 0.18)",
      },
    ],
    valuePrefix: "$",
  };
}
