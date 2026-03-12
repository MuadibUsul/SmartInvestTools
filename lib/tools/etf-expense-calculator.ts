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

type EtfExpenseInputs = {
  investmentAmount: number;
  expenseRatio: number;
  years: number;
  expectedReturnRate: number;
};

type EtfExpenseResult = {
  endingValueBeforeExpenses: number;
  endingValueAfterExpenses: number;
  cumulativeExpenseImpact: number;
  yearlyValues: ReturnType<typeof buildFeeAdjustedProjection>;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    {
      key: "investmentAmount",
      label: "Investment amount",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "1000",
      placeholder: "50000",
    },
    {
      key: "expenseRatio",
      label: "ETF expense ratio",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.01",
      placeholder: "0.15",
    },
    {
      key: "years",
      label: "Holding period",
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
      key: "investmentAmount",
      label: "投资金额",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "1000",
      placeholder: "50000",
    },
    {
      key: "expenseRatio",
      label: "ETF 费率",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.01",
      placeholder: "0.15",
    },
    {
      key: "years",
      label: "持有年限",
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
  investmentAmount: "50000",
  expenseRatio: "0.15",
  years: "15",
  expectedReturnRate: "7",
};

export function getEtfExpenseFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getEtfExpenseDefaultState(_locale: Locale) {
  return defaults;
}

export function parseEtfExpenseInputs(values: FormState): EtfExpenseInputs {
  return {
    investmentAmount: clampNumber(parseNumber(String(values.investmentAmount), 50000)),
    expenseRatio: clampNumber(parseNumber(String(values.expenseRatio), 0.15), 0, 5),
    years: clampNumber(Math.round(parseNumber(String(values.years), 15)), 1, 60),
    expectedReturnRate: clampNumber(
      parseNumber(String(values.expectedReturnRate), 7),
      0,
      30,
    ),
  };
}

export function calculateEtfExpense(inputs: EtfExpenseInputs): EtfExpenseResult {
  const yearlyValues = buildFeeAdjustedProjection({
    initialAmount: inputs.investmentAmount,
    annualReturnPercent: inputs.expectedReturnRate,
    annualFeePercent: inputs.expenseRatio,
    years: inputs.years,
  });
  const lastPoint = yearlyValues[yearlyValues.length - 1];

  return {
    endingValueBeforeExpenses: lastPoint.balanceWithoutFees,
    endingValueAfterExpenses: lastPoint.balanceWithFees,
    cumulativeExpenseImpact: lastPoint.feeDrag,
    yearlyValues,
  };
}

export function buildEtfExpenseSummary(
  result: EtfExpenseResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "扣费前终值",
        value: formatCompactCurrency(result.endingValueBeforeExpenses, locale),
        detailValue: formatCurrency(result.endingValueBeforeExpenses, locale),
        helperText: "不考虑 ETF 费率时的理论终值。",
        tone: "--color-accent",
      },
      {
        label: "扣费后终值",
        value: formatCompactCurrency(result.endingValueAfterExpenses, locale),
        detailValue: formatCurrency(result.endingValueAfterExpenses, locale),
        helperText: "考虑 ETF 年度费率后的预估持有结果。",
      },
      {
        label: "累计费率影响",
        value: formatCompactCurrency(result.cumulativeExpenseImpact, locale),
        detailValue: formatCurrency(result.cumulativeExpenseImpact, locale),
        helperText: "费率与失去的复利一起形成的长期差额。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Ending value before expenses",
      value: formatCompactCurrency(result.endingValueBeforeExpenses, locale),
      detailValue: formatCurrency(result.endingValueBeforeExpenses, locale),
      helperText: "Projected ending value if the ETF had no ongoing expense ratio.",
      tone: "--color-accent",
    },
    {
      label: "Ending value after expenses",
      value: formatCompactCurrency(result.endingValueAfterExpenses, locale),
      detailValue: formatCurrency(result.endingValueAfterExpenses, locale),
      helperText: "Projected ending value after annual expenses reduce compounding.",
    },
    {
      label: "Cumulative fee impact",
      value: formatCompactCurrency(result.cumulativeExpenseImpact, locale),
      detailValue: formatCurrency(result.cumulativeExpenseImpact, locale),
      helperText: "The long-term cost of the expense ratio and the growth lost to it.",
      tone: "--color-highlight",
    },
  ];
}

export function buildEtfExpenseChart(
  result: EtfExpenseResult,
  locale: Locale,
): ToolChartData {
  return {
    type: "line",
    title: locale === "zh" ? "ETF 费率影响路径" : "ETF expense impact over time",
    description:
      locale === "zh"
        ? "比较不计费率与计入费率后的投资终值差异。"
        : "Compare ETF growth paths with and without the expense ratio.",
    labels: result.yearlyValues.map((point) =>
      locale === "zh" ? `${point.year} 年` : `Year ${point.year}`,
    ),
    datasets: [
      {
        label: locale === "zh" ? "扣费前" : "Before expenses",
        data: result.yearlyValues.map((point) => point.balanceWithoutFees),
        borderColor: "rgba(59, 130, 246, 0.92)",
        backgroundColor: "rgba(59, 130, 246, 0.18)",
      },
      {
        label: locale === "zh" ? "扣费后" : "After expenses",
        data: result.yearlyValues.map((point) => point.balanceWithFees),
        borderColor: "rgba(245, 158, 11, 0.92)",
        backgroundColor: "rgba(245, 158, 11, 0.18)",
      },
    ],
    valuePrefix: "$",
  };
}
