import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  parseNumber,
} from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

type PassiveIncomeInputs = {
  targetMonthlyIncome: number;
  yieldRate: number;
};

type PassiveIncomeResult = {
  capitalRequired: number;
  annualIncomeTarget: number;
  yieldRate: number;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    { key: "targetMonthlyIncome", label: "Target monthly income", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "2000" },
    { key: "yieldRate", label: "Yield", type: "percentage", suffix: "%", min: 0.1, step: "0.1", placeholder: "4" },
  ],
  zh: [
    { key: "targetMonthlyIncome", label: "目标月收入", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "2000" },
    { key: "yieldRate", label: "收益率", type: "percentage", suffix: "%", min: 0.1, step: "0.1", placeholder: "4" },
  ],
};

const defaults: FormState = {
  targetMonthlyIncome: "2000",
  yieldRate: "4",
};

export function getPassiveIncomeFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getPassiveIncomeDefaultState(_locale: Locale) {
  return defaults;
}

export function parsePassiveIncomeInputs(values: FormState): PassiveIncomeInputs {
  return {
    targetMonthlyIncome: clampNumber(
      parseNumber(String(values.targetMonthlyIncome), 2000),
    ),
    yieldRate: clampNumber(parseNumber(String(values.yieldRate), 4), 0.1, 100),
  };
}

export function calculatePassiveIncome(
  inputs: PassiveIncomeInputs,
): PassiveIncomeResult {
  const annualIncomeTarget = inputs.targetMonthlyIncome * 12;

  return {
    annualIncomeTarget,
    yieldRate: inputs.yieldRate,
    capitalRequired: annualIncomeTarget / (inputs.yieldRate / 100),
  };
}

export function buildPassiveIncomeSummary(
  result: PassiveIncomeResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "所需本金",
        value: formatCompactCurrency(result.capitalRequired, locale),
        detailValue: formatCurrency(result.capitalRequired, locale),
        helperText: "按目标月收入和设定收益率反推所需资本规模。",
        tone: "--color-accent",
      },
      {
        label: "目标年收入",
        value: formatCompactCurrency(result.annualIncomeTarget, locale),
        detailValue: formatCurrency(result.annualIncomeTarget, locale),
        helperText: "目标月收入换算后的年度被动收入目标。",
      },
      {
        label: "使用收益率",
        value: formatPercent(result.yieldRate, 1),
        helperText: "收益率越低，达到同样收入目标所需本金越高。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Capital required",
      value: formatCompactCurrency(result.capitalRequired, locale),
      detailValue: formatCurrency(result.capitalRequired, locale),
      helperText:
        "The amount of capital implied by your income target and selected yield.",
      tone: "--color-accent",
    },
    {
      label: "Annual income target",
      value: formatCompactCurrency(result.annualIncomeTarget, locale),
      detailValue: formatCurrency(result.annualIncomeTarget, locale),
      helperText: "Your target monthly income translated into annual income.",
    },
    {
      label: "Selected yield",
      value: formatPercent(result.yieldRate, 1),
      helperText:
        "Lower yields require more capital to support the same income goal.",
      tone: "--color-highlight",
    },
  ];
}

