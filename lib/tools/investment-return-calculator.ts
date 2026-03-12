import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  parseNumber,
} from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

type InvestmentReturnInputs = {
  initialValue: number;
  finalValue: number;
  contributions: number;
};

type InvestmentReturnResult = {
  investedCapital: number;
  finalValue: number;
  gainLoss: number;
  returnPercentage: number;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    {
      key: "initialValue",
      label: "Initial value",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "10000",
    },
    {
      key: "finalValue",
      label: "Final value",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "14500",
    },
    {
      key: "contributions",
      label: "Additional contributions",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "2000",
    },
  ],
  zh: [
    {
      key: "initialValue",
      label: "初始金额",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "10000",
    },
    {
      key: "finalValue",
      label: "期末金额",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "14500",
    },
    {
      key: "contributions",
      label: "追加投入",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "2000",
    },
  ],
};

const defaults: FormState = {
  initialValue: "10000",
  finalValue: "14500",
  contributions: "2000",
};

export function getInvestmentReturnFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getInvestmentReturnDefaultState(_locale: Locale) {
  return defaults;
}

export function parseInvestmentReturnInputs(
  values: FormState,
): InvestmentReturnInputs {
  return {
    initialValue: clampNumber(parseNumber(String(values.initialValue), 10000)),
    finalValue: clampNumber(parseNumber(String(values.finalValue), 14500)),
    contributions: clampNumber(parseNumber(String(values.contributions), 2000)),
  };
}

export function calculateInvestmentReturn(
  inputs: InvestmentReturnInputs,
): InvestmentReturnResult {
  const investedCapital = inputs.initialValue + inputs.contributions;
  const gainLoss = inputs.finalValue - investedCapital;

  return {
    investedCapital,
    finalValue: inputs.finalValue,
    gainLoss,
    returnPercentage:
      investedCapital > 0 ? (gainLoss / investedCapital) * 100 : 0,
  };
}

export function buildInvestmentReturnSummary(
  result: InvestmentReturnResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "期末资产价值",
        value: formatCompactCurrency(result.finalValue, locale),
        detailValue: formatCurrency(result.finalValue, locale),
        helperText: "你的资产在当前输入下的最终价值。",
        tone: "--color-accent",
      },
      {
        label: "净收益 / 净亏损",
        value: formatCompactCurrency(result.gainLoss, locale),
        detailValue: formatCurrency(result.gainLoss, locale),
        helperText: "期末价值减去总投入资本后的净结果。",
      },
      {
        label: "总回报率",
        value: formatPercent(result.returnPercentage, 1),
        helperText: "净收益相对于总投入资本的比例。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Ending portfolio value",
      value: formatCompactCurrency(result.finalValue, locale),
      detailValue: formatCurrency(result.finalValue, locale),
      helperText: "Your portfolio value at the end of the scenario.",
      tone: "--color-accent",
    },
    {
      label: "Net gain / loss",
      value: formatCompactCurrency(result.gainLoss, locale),
      detailValue: formatCurrency(result.gainLoss, locale),
      helperText: "Final value minus your total invested capital.",
    },
    {
      label: "Total return",
      value: formatPercent(result.returnPercentage, 1),
      helperText: "Net gain expressed as a percentage of invested capital.",
      tone: "--color-highlight",
    },
  ];
}

