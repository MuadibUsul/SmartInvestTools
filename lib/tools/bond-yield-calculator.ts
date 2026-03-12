import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  parseNumber,
} from "@/lib/format";
import { calculateCurrentYield } from "@/lib/financial";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

type BondYieldInputs = {
  faceValue: number;
  couponRate: number;
  price: number;
};

type BondYieldResult = {
  annualCouponIncome: number;
  currentYield: number;
  premiumDiscount: number;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    { key: "faceValue", label: "Face value", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "1000" },
    { key: "couponRate", label: "Coupon rate", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "5" },
    { key: "price", label: "Current price", type: "currency", prefix: "$", min: 0, step: "0.01", placeholder: "950" },
  ],
  zh: [
    { key: "faceValue", label: "票面价值", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "1000" },
    { key: "couponRate", label: "票息率", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "5" },
    { key: "price", label: "当前价格", type: "currency", prefix: "$", min: 0, step: "0.01", placeholder: "950" },
  ],
};

const defaults: FormState = {
  faceValue: "1000",
  couponRate: "5",
  price: "950",
};

export function getBondYieldFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getBondYieldDefaultState(_locale: Locale) {
  return defaults;
}

export function parseBondYieldInputs(values: FormState): BondYieldInputs {
  return {
    faceValue: clampNumber(parseNumber(String(values.faceValue), 1000)),
    couponRate: clampNumber(parseNumber(String(values.couponRate), 5), 0, 100),
    price: clampNumber(parseNumber(String(values.price), 950), 0.01),
  };
}

export function calculateBondYield(inputs: BondYieldInputs): BondYieldResult {
  const annualCouponIncome = inputs.faceValue * (inputs.couponRate / 100);

  return {
    annualCouponIncome,
    currentYield: calculateCurrentYield(
      inputs.faceValue,
      inputs.couponRate,
      inputs.price,
    ),
    premiumDiscount: inputs.price - inputs.faceValue,
  };
}

export function buildBondYieldSummary(
  result: BondYieldResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "年度票息收入",
        value: formatCompactCurrency(result.annualCouponIncome, locale),
        detailValue: formatCurrency(result.annualCouponIncome, locale),
        helperText: "按票面价值和票息率估算的年度票息收入。",
        tone: "--color-accent",
      },
      {
        label: "当前收益率",
        value: formatPercent(result.currentYield, 2),
        helperText: "年度票息收入相对于当前价格的比率。",
      },
      {
        label: "溢价 / 折价",
        value: formatCompactCurrency(result.premiumDiscount, locale),
        detailValue: formatCurrency(result.premiumDiscount, locale),
        helperText: "当前价格与票面价值之间的差额。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Annual coupon income",
      value: formatCompactCurrency(result.annualCouponIncome, locale),
      detailValue: formatCurrency(result.annualCouponIncome, locale),
      helperText: "Annual coupon income implied by face value and coupon rate.",
      tone: "--color-accent",
    },
    {
      label: "Current yield",
      value: formatPercent(result.currentYield, 2),
      helperText: "Coupon income expressed as a percentage of the current price.",
    },
    {
      label: "Premium / discount",
      value: formatCompactCurrency(result.premiumDiscount, locale),
      detailValue: formatCurrency(result.premiumDiscount, locale),
      helperText: "The difference between market price and face value.",
      tone: "--color-highlight",
    },
  ];
}

