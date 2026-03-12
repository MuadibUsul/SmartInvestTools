import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  parseNumber,
} from "@/lib/format";
import { calculatePresentValue } from "@/lib/financial";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

type PresentValueInputs = {
  futureValue: number;
  discountRate: number;
  years: number;
};

type PresentValueResult = {
  presentValue: number;
  futureValue: number;
  discountAmount: number;
  discountPercentage: number;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    {
      key: "futureValue",
      label: "Future value",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "25000",
    },
    {
      key: "discountRate",
      label: "Annual discount rate",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.1",
      placeholder: "7",
    },
    {
      key: "years",
      label: "Years",
      type: "number",
      suffix: "years",
      min: 1,
      step: "1",
      placeholder: "10",
    },
  ],
  zh: [
    {
      key: "futureValue",
      label: "未来金额",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "25000",
    },
    {
      key: "discountRate",
      label: "折现率",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.1",
      placeholder: "7",
    },
    {
      key: "years",
      label: "年数",
      type: "number",
      suffix: "年",
      min: 1,
      step: "1",
      placeholder: "10",
    },
  ],
};

const defaults: FormState = {
  futureValue: "25000",
  discountRate: "7",
  years: "10",
};

export function getPresentValueFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getPresentValueDefaultState(_locale: Locale) {
  return defaults;
}

export function parsePresentValueInputs(values: FormState): PresentValueInputs {
  return {
    futureValue: clampNumber(parseNumber(String(values.futureValue), 25000)),
    discountRate: clampNumber(parseNumber(String(values.discountRate), 7), 0, 100),
    years: clampNumber(Math.round(parseNumber(String(values.years), 10)), 1, 100),
  };
}

export function calculatePresentValueTool(
  inputs: PresentValueInputs,
): PresentValueResult {
  const presentValue = calculatePresentValue(
    inputs.futureValue,
    inputs.discountRate,
    inputs.years,
  );
  const discountAmount = inputs.futureValue - presentValue;

  return {
    presentValue,
    futureValue: inputs.futureValue,
    discountAmount,
    discountPercentage:
      inputs.futureValue > 0 ? (discountAmount / inputs.futureValue) * 100 : 0,
  };
}

export function buildPresentValueSummary(
  result: PresentValueResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "现值",
        value: formatCompactCurrency(result.presentValue, locale),
        detailValue: formatCurrency(result.presentValue, locale),
        helperText: "把未来金额按设定折现率折算回今天的价值。",
        tone: "--color-accent",
      },
      {
        label: "折现金额",
        value: formatCompactCurrency(result.discountAmount, locale),
        detailValue: formatCurrency(result.discountAmount, locale),
        helperText: "未来金额与现值之间的折现差额。",
      },
      {
        label: "折现比例",
        value: formatPercent(result.discountPercentage, 1),
        helperText: "折现差额占未来金额的比例。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Present value",
      value: formatCompactCurrency(result.presentValue, locale),
      detailValue: formatCurrency(result.presentValue, locale),
      helperText: "The value today of a future cash amount discounted back.",
      tone: "--color-accent",
    },
    {
      label: "Discount amount",
      value: formatCompactCurrency(result.discountAmount, locale),
      detailValue: formatCurrency(result.discountAmount, locale),
      helperText: "The difference between future value and present value.",
    },
    {
      label: "Discount percentage",
      value: formatPercent(result.discountPercentage, 1),
      helperText: "How much of the future value is discounted away.",
      tone: "--color-highlight",
    },
  ];
}

