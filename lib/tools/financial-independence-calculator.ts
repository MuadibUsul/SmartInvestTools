import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  parseNumber,
} from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

type FinancialIndependenceInputs = {
  annualExpenses: number;
  safeWithdrawalRate: number;
};

type FinancialIndependenceResult = {
  fiNumber: number;
  monthlyExpenses: number;
  safeWithdrawalRate: number;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    { key: "annualExpenses", label: "Annual expenses", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "50000" },
    { key: "safeWithdrawalRate", label: "Safe withdrawal rate", type: "percentage", suffix: "%", min: 0.1, step: "0.1", placeholder: "4" },
  ],
  zh: [
    { key: "annualExpenses", label: "年度支出", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "50000" },
    { key: "safeWithdrawalRate", label: "安全提取率", type: "percentage", suffix: "%", min: 0.1, step: "0.1", placeholder: "4" },
  ],
};

const defaults: FormState = {
  annualExpenses: "50000",
  safeWithdrawalRate: "4",
};

export function getFinancialIndependenceFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getFinancialIndependenceDefaultState(_locale: Locale) {
  return defaults;
}

export function parseFinancialIndependenceInputs(
  values: FormState,
): FinancialIndependenceInputs {
  return {
    annualExpenses: clampNumber(parseNumber(String(values.annualExpenses), 50000)),
    safeWithdrawalRate: clampNumber(
      parseNumber(String(values.safeWithdrawalRate), 4),
      0.1,
      100,
    ),
  };
}

export function calculateFinancialIndependence(
  inputs: FinancialIndependenceInputs,
): FinancialIndependenceResult {
  return {
    fiNumber: inputs.annualExpenses / (inputs.safeWithdrawalRate / 100),
    monthlyExpenses: inputs.annualExpenses / 12,
    safeWithdrawalRate: inputs.safeWithdrawalRate,
  };
}

export function buildFinancialIndependenceSummary(
  result: FinancialIndependenceResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "FI 数字",
        value: formatCompactCurrency(result.fiNumber, locale),
        detailValue: formatCurrency(result.fiNumber, locale),
        helperText: "按照安全提取率覆盖年度支出所需的大致资产规模。",
        tone: "--color-accent",
      },
      {
        label: "月支出参考",
        value: formatCompactCurrency(result.monthlyExpenses, locale),
        detailValue: formatCurrency(result.monthlyExpenses, locale),
        helperText: "把年度支出换算成每月支出后的参考值。",
      },
      {
        label: "安全提取率",
        value: formatPercent(result.safeWithdrawalRate, 1),
        helperText: "提取率越低，达到财务自由所需资产通常越高。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "FI number",
      value: formatCompactCurrency(result.fiNumber, locale),
      detailValue: formatCurrency(result.fiNumber, locale),
      helperText:
        "The portfolio size that could support your annual expenses at the selected withdrawal rate.",
      tone: "--color-accent",
    },
    {
      label: "Monthly spending reference",
      value: formatCompactCurrency(result.monthlyExpenses, locale),
      detailValue: formatCurrency(result.monthlyExpenses, locale),
      helperText: "Your annual expenses translated into a monthly reference.",
    },
    {
      label: "Safe withdrawal rate",
      value: formatPercent(result.safeWithdrawalRate, 1),
      helperText: "Lower withdrawal rates imply a larger FI target.",
      tone: "--color-highlight",
    },
  ];
}

