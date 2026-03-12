import { buildFeeAdjustedProjection } from "@/lib/financial";
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

type InvestmentFeeInputs = {
  portfolioSize: number;
  annualFeeRate: number;
  years: number;
  expectedReturnRate: number;
};

type InvestmentFeeResult = {
  endingValueWithoutFees: number;
  endingValueAfterFees: number;
  feeDrag: number;
  yearlyValues: ReturnType<typeof buildFeeAdjustedProjection>;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    {
      key: "portfolioSize",
      label: "Portfolio size",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "1000",
      placeholder: "250000",
    },
    {
      key: "annualFeeRate",
      label: "Annual fee rate",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.01",
      placeholder: "0.75",
    },
    {
      key: "years",
      label: "Years",
      type: "number",
      suffix: "years",
      min: 1,
      step: "1",
      placeholder: "20",
    },
    {
      key: "expectedReturnRate",
      label: "Expected annual return",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.1",
      placeholder: "8",
    },
  ],
  zh: [
    {
      key: "portfolioSize",
      label: "投资组合规模",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "1000",
      placeholder: "250000",
    },
    {
      key: "annualFeeRate",
      label: "年度费率",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.01",
      placeholder: "0.75",
    },
    {
      key: "years",
      label: "投资年限",
      type: "number",
      suffix: "年",
      min: 1,
      step: "1",
      placeholder: "20",
    },
    {
      key: "expectedReturnRate",
      label: "预期年化收益率",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.1",
      placeholder: "8",
    },
  ],
};

const defaults: FormState = {
  portfolioSize: "250000",
  annualFeeRate: "0.75",
  years: "20",
  expectedReturnRate: "8",
};

export function getInvestmentFeeFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getInvestmentFeeDefaultState(_locale: Locale) {
  return defaults;
}

export function parseInvestmentFeeInputs(values: FormState): InvestmentFeeInputs {
  return {
    portfolioSize: clampNumber(parseNumber(String(values.portfolioSize), 250000)),
    annualFeeRate: clampNumber(parseNumber(String(values.annualFeeRate), 0.75), 0, 10),
    years: clampNumber(Math.round(parseNumber(String(values.years), 20)), 1, 60),
    expectedReturnRate: clampNumber(
      parseNumber(String(values.expectedReturnRate), 8),
      0,
      30,
    ),
  };
}

export function calculateInvestmentFee(
  inputs: InvestmentFeeInputs,
): InvestmentFeeResult {
  const yearlyValues = buildFeeAdjustedProjection({
    initialAmount: inputs.portfolioSize,
    annualReturnPercent: inputs.expectedReturnRate,
    annualFeePercent: inputs.annualFeeRate,
    years: inputs.years,
  });
  const lastPoint = yearlyValues[yearlyValues.length - 1];

  return {
    endingValueWithoutFees: lastPoint.balanceWithoutFees,
    endingValueAfterFees: lastPoint.balanceWithFees,
    feeDrag: lastPoint.feeDrag,
    yearlyValues,
  };
}

export function buildInvestmentFeeSummary(
  result: InvestmentFeeResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "无费用情景资产",
        value: formatCompactCurrency(result.endingValueWithoutFees, locale),
        detailValue: formatCurrency(result.endingValueWithoutFees, locale),
        helperText: "假设不收取年度费用时，组合可能达到的规模。",
        tone: "--color-accent",
      },
      {
        label: "扣费后资产",
        value: formatCompactCurrency(result.endingValueAfterFees, locale),
        detailValue: formatCurrency(result.endingValueAfterFees, locale),
        helperText: "同时考虑收益率与年度费用后的预估结果。",
      },
      {
        label: "费用拖累",
        value: formatCompactCurrency(result.feeDrag, locale),
        detailValue: formatCurrency(result.feeDrag, locale),
        helperText: "费用和费用失去的复利共同造成的差额。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Ending value without fees",
      value: formatCompactCurrency(result.endingValueWithoutFees, locale),
      detailValue: formatCurrency(result.endingValueWithoutFees, locale),
      helperText: "Projected portfolio value if no ongoing fee were charged.",
      tone: "--color-accent",
    },
    {
      label: "Ending value after fees",
      value: formatCompactCurrency(result.endingValueAfterFees, locale),
      detailValue: formatCurrency(result.endingValueAfterFees, locale),
      helperText: "Projected value after applying annual growth and fee drag.",
    },
    {
      label: "Fee drag",
      value: formatCompactCurrency(result.feeDrag, locale),
      detailValue: formatCurrency(result.feeDrag, locale),
      helperText: "The long-term difference created by ongoing investment fees.",
      tone: "--color-highlight",
    },
  ];
}

export function buildInvestmentFeeChart(
  result: InvestmentFeeResult,
  locale: Locale,
): ToolChartData {
  return {
    type: "line",
    title: locale === "zh" ? "费用对终值的影响" : "Impact of fees over time",
    description:
      locale === "zh"
        ? "比较无费用情景与扣费后资产路径之间的差距。"
        : "Compare the portfolio path with and without annual fees.",
    labels: result.yearlyValues.map((point) =>
      locale === "zh" ? `${point.year} 年` : `Year ${point.year}`,
    ),
    datasets: [
      {
        label: locale === "zh" ? "无费用资产" : "Without fees",
        data: result.yearlyValues.map((point) => point.balanceWithoutFees),
        borderColor: "rgba(15, 155, 142, 0.92)",
        backgroundColor: "rgba(15, 155, 142, 0.18)",
      },
      {
        label: locale === "zh" ? "扣费后资产" : "After fees",
        data: result.yearlyValues.map((point) => point.balanceWithFees),
        borderColor: "rgba(245, 158, 11, 0.92)",
        backgroundColor: "rgba(245, 158, 11, 0.18)",
      },
    ],
    valuePrefix: "$",
  };
}
