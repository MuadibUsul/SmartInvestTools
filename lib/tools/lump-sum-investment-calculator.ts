import {
  buildLumpSumProjection,
  futureValueOfLumpSum,
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

type LumpSumInvestmentInputs = {
  lumpSum: number;
  annualReturnRate: number;
  years: number;
};

type LumpSumInvestmentResult = {
  futureValue: number;
  totalGain: number;
  originalPrincipal: number;
  yearlyValues: ReturnType<typeof buildLumpSumProjection>;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    { key: "lumpSum", label: "One-time investment", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "50000" },
    { key: "annualReturnRate", label: "Expected annual return", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "8" },
    { key: "years", label: "Years", type: "number", suffix: "years", min: 1, step: "1", placeholder: "15" },
  ],
  zh: [
    { key: "lumpSum", label: "一次性投资金额", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "50000" },
    { key: "annualReturnRate", label: "预期年化收益率", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "8" },
    { key: "years", label: "投资年限", type: "number", suffix: "年", min: 1, step: "1", placeholder: "15" },
  ],
};

const defaults: FormState = {
  lumpSum: "50000",
  annualReturnRate: "8",
  years: "15",
};

export function getLumpSumInvestmentFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getLumpSumInvestmentDefaultState(_locale: Locale) {
  return defaults;
}

export function parseLumpSumInvestmentInputs(
  values: FormState,
): LumpSumInvestmentInputs {
  return {
    lumpSum: clampNumber(parseNumber(String(values.lumpSum), 50000)),
    annualReturnRate: clampNumber(
      parseNumber(String(values.annualReturnRate), 8),
      0,
      30,
    ),
    years: clampNumber(Math.round(parseNumber(String(values.years), 15)), 1, 60),
  };
}

export function calculateLumpSumInvestment(
  inputs: LumpSumInvestmentInputs,
): LumpSumInvestmentResult {
  const futureValue = futureValueOfLumpSum(
    inputs.lumpSum,
    inputs.annualReturnRate,
    inputs.years,
  );

  return {
    futureValue,
    totalGain: futureValue - inputs.lumpSum,
    originalPrincipal: inputs.lumpSum,
    yearlyValues: buildLumpSumProjection({
      initialAmount: inputs.lumpSum,
      annualRatePercent: inputs.annualReturnRate,
      years: inputs.years,
    }),
  };
}

export function buildLumpSumInvestmentSummary(
  result: LumpSumInvestmentResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "未来价值",
        value: formatCompactCurrency(result.futureValue, locale),
        detailValue: formatCurrency(result.futureValue, locale),
        helperText: "一次性投入在假设收益率和年限下的期末估值。",
        tone: "--color-accent",
      },
      {
        label: "累计收益",
        value: formatCompactCurrency(result.totalGain, locale),
        detailValue: formatCurrency(result.totalGain, locale),
        helperText: "未来价值与原始本金之间的差额。",
      },
      {
        label: "原始本金",
        value: formatCompactCurrency(result.originalPrincipal, locale),
        detailValue: formatCurrency(result.originalPrincipal, locale),
        helperText: "你最初一次性投入的本金规模。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Future value",
      value: formatCompactCurrency(result.futureValue, locale),
      detailValue: formatCurrency(result.futureValue, locale),
      helperText: "The projected ending value of the one-time investment.",
      tone: "--color-accent",
    },
    {
      label: "Total gain",
      value: formatCompactCurrency(result.totalGain, locale),
      detailValue: formatCurrency(result.totalGain, locale),
      helperText: "The growth generated above your original principal.",
    },
    {
      label: "Original principal",
      value: formatCompactCurrency(result.originalPrincipal, locale),
      detailValue: formatCurrency(result.originalPrincipal, locale),
      helperText: "The one-time amount invested at the start.",
      tone: "--color-highlight",
    },
  ];
}

export function buildLumpSumInvestmentChart(
  result: LumpSumInvestmentResult,
  locale: Locale,
): ToolChartData {
  return {
    type: "line",
    title: locale === "zh" ? "一次性投资增长路径" : "Lump sum growth path",
    description:
      locale === "zh"
        ? "查看一次性投资在不同年份如何随着复利增长。"
        : "See how a one-time investment compounds over the selected timeline.",
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
        label: locale === "zh" ? "原始本金" : "Original principal",
        data: result.yearlyValues.map((point) => point.contributions),
        borderColor: "rgba(99, 102, 241, 0.92)",
        backgroundColor: "rgba(99, 102, 241, 0.18)",
      },
    ],
    valuePrefix: "$",
  };
}
