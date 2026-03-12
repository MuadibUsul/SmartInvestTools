import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  parseNumber,
} from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

type EmergencyFundInputs = {
  monthlyExpenses: number;
  monthsOfCoverage: number;
};

type EmergencyFundResult = {
  targetFund: number;
  threeMonthFund: number;
  sixMonthFund: number;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    { key: "monthlyExpenses", label: "Monthly expenses", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "3000" },
    { key: "monthsOfCoverage", label: "Months of coverage", type: "number", min: 1, step: "1", placeholder: "6" },
  ],
  zh: [
    { key: "monthlyExpenses", label: "月支出", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "3000" },
    { key: "monthsOfCoverage", label: "保障月数", type: "number", min: 1, step: "1", placeholder: "6" },
  ],
};

const defaults: FormState = {
  monthlyExpenses: "3000",
  monthsOfCoverage: "6",
};

export function getEmergencyFundFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getEmergencyFundDefaultState(_locale: Locale) {
  return defaults;
}

export function parseEmergencyFundInputs(values: FormState): EmergencyFundInputs {
  return {
    monthlyExpenses: clampNumber(parseNumber(String(values.monthlyExpenses), 3000)),
    monthsOfCoverage: clampNumber(
      Math.round(parseNumber(String(values.monthsOfCoverage), 6)),
      1,
      24,
    ),
  };
}

export function calculateEmergencyFund(
  inputs: EmergencyFundInputs,
): EmergencyFundResult {
  return {
    targetFund: inputs.monthlyExpenses * inputs.monthsOfCoverage,
    threeMonthFund: inputs.monthlyExpenses * 3,
    sixMonthFund: inputs.monthlyExpenses * 6,
  };
}

export function buildEmergencyFundSummary(
  result: EmergencyFundResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "建议应急金目标",
        value: formatCompactCurrency(result.targetFund, locale),
        detailValue: formatCurrency(result.targetFund, locale),
        helperText: "按你设定的保障月数估算的应急金目标。",
        tone: "--color-accent",
      },
      {
        label: "3 个月基础应急金",
        value: formatCompactCurrency(result.threeMonthFund, locale),
        detailValue: formatCurrency(result.threeMonthFund, locale),
        helperText: "一个较为基础的缓冲水平。",
      },
      {
        label: "6 个月常见目标",
        value: formatCompactCurrency(result.sixMonthFund, locale),
        detailValue: formatCurrency(result.sixMonthFund, locale),
        helperText: "较常见的稳健型应急金参考水平。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Recommended emergency fund",
      value: formatCompactCurrency(result.targetFund, locale),
      detailValue: formatCurrency(result.targetFund, locale),
      helperText:
        "The emergency reserve implied by your selected coverage period.",
      tone: "--color-accent",
    },
    {
      label: "Three-month baseline",
      value: formatCompactCurrency(result.threeMonthFund, locale),
      detailValue: formatCurrency(result.threeMonthFund, locale),
      helperText: "A lighter emergency reserve starting point.",
    },
    {
      label: "Six-month benchmark",
      value: formatCompactCurrency(result.sixMonthFund, locale),
      detailValue: formatCurrency(result.sixMonthFund, locale),
      helperText: "A common reference level for a more conservative buffer.",
      tone: "--color-highlight",
    },
  ];
}

