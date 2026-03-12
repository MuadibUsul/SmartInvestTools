import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  parseNumber,
} from "@/lib/format";
import { futureValueOfLumpSum } from "@/lib/financial";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

type FutureValueInputs = {
  presentValue: number;
  annualRate: number;
  years: number;
};

type FutureValueResult = {
  futureValue: number;
  totalGain: number;
  growthMultiple: number;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    {
      key: "presentValue",
      label: "Present value",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "15000",
    },
    {
      key: "annualRate",
      label: "Annual return rate",
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
      placeholder: "12",
    },
  ],
  zh: [
    {
      key: "presentValue",
      label: "当前金额",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "15000",
    },
    {
      key: "annualRate",
      label: "年化收益率",
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
      placeholder: "12",
    },
  ],
};

const defaults: FormState = {
  presentValue: "15000",
  annualRate: "7",
  years: "12",
};

export function getFutureValueFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getFutureValueDefaultState(_locale: Locale) {
  return defaults;
}

export function parseFutureValueInputs(values: FormState): FutureValueInputs {
  return {
    presentValue: clampNumber(parseNumber(String(values.presentValue), 15000)),
    annualRate: clampNumber(parseNumber(String(values.annualRate), 7), 0, 100),
    years: clampNumber(Math.round(parseNumber(String(values.years), 12)), 1, 100),
  };
}

export function calculateFutureValueTool(
  inputs: FutureValueInputs,
): FutureValueResult {
  const futureValue = futureValueOfLumpSum(
    inputs.presentValue,
    inputs.annualRate,
    inputs.years,
  );

  return {
    futureValue,
    totalGain: futureValue - inputs.presentValue,
    growthMultiple:
      inputs.presentValue > 0 ? futureValue / inputs.presentValue : 0,
  };
}

export function buildFutureValueSummary(
  result: FutureValueResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "未来价值",
        value: formatCompactCurrency(result.futureValue, locale),
        detailValue: formatCurrency(result.futureValue, locale),
        helperText: "当前金额按设定收益率增长后的未来估值。",
        tone: "--color-accent",
      },
      {
        label: "累计增长",
        value: formatCompactCurrency(result.totalGain, locale),
        detailValue: formatCurrency(result.totalGain, locale),
        helperText: "未来价值减去当前金额后的增量。",
      },
      {
        label: "增长倍数",
        value: `${formatNumber(result.growthMultiple, locale, 2)}x`,
        helperText: "未来价值相对于当前金额的放大倍数。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Future value",
      value: formatCompactCurrency(result.futureValue, locale),
      detailValue: formatCurrency(result.futureValue, locale),
      helperText:
        "What the current amount could grow into under the selected annual return.",
      tone: "--color-accent",
    },
    {
      label: "Total gain",
      value: formatCompactCurrency(result.totalGain, locale),
      detailValue: formatCurrency(result.totalGain, locale),
      helperText: "The increase above the starting amount.",
    },
    {
      label: "Growth multiple",
      value: `${formatNumber(result.growthMultiple, locale, 2)}x`,
      helperText: "How many times larger the final amount becomes.",
      tone: "--color-highlight",
    },
  ];
}

