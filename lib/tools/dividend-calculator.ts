import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  parseNumber,
} from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

export type DividendIncomeInputs = {
  investmentAmount: number;
  dividendYield: number;
};

export type DividendIncomeResult = {
  annualDividendIncome: number;
  monthlyDividendIncome: number;
};

const dividendCalculatorFieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    {
      key: "investmentAmount",
      label: "Investment amount",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "25000",
    },
    {
      key: "dividendYield",
      label: "Dividend yield",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.1",
      placeholder: "3.5",
    },
  ],
  zh: [
    {
      key: "investmentAmount",
      label: "投资金额",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "25000",
    },
    {
      key: "dividendYield",
      label: "股息率",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.1",
      placeholder: "3.5",
    },
  ],
};

const dividendCalculatorDefaults: FormState = {
  investmentAmount: "25000",
  dividendYield: "3.5",
};

export function getDividendCalculatorFields(locale: Locale) {
  return dividendCalculatorFieldsByLocale[locale];
}

export function getDividendCalculatorDefaultState(_locale: Locale) {
  return dividendCalculatorDefaults;
}

export function parseDividendIncomeInputs(values: FormState): DividendIncomeInputs {
  return {
    investmentAmount: clampNumber(parseNumber(String(values.investmentAmount), 25000)),
    dividendYield: clampNumber(parseNumber(String(values.dividendYield), 3.5), 0, 100),
  };
}

export function calculateDividendIncome(
  inputs: DividendIncomeInputs,
): DividendIncomeResult {
  const annualDividendIncome =
    inputs.investmentAmount * (inputs.dividendYield / 100);

  return {
    annualDividendIncome,
    monthlyDividendIncome: annualDividendIncome / 12,
  };
}

export function buildDividendSummary(
  result: DividendIncomeResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "年股息收入",
        value: formatCompactCurrency(result.annualDividendIncome, locale),
        detailValue: formatCurrency(result.annualDividendIncome, locale),
        helperText: "税费前的预计年度现金收入。",
        tone: "--color-accent",
      },
      {
        label: "月均股息收入",
        value: formatCompactCurrency(result.monthlyDividendIncome, locale),
        detailValue: formatCurrency(result.monthlyDividendIncome, locale),
        helperText: "基于年化股息率折算的平均月度收入。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Annual dividend income",
      value: formatCompactCurrency(result.annualDividendIncome, locale),
      detailValue: formatCurrency(result.annualDividendIncome, locale),
      helperText: "Estimated cash income before taxes and fees.",
      tone: "--color-accent",
    },
    {
      label: "Monthly dividend income",
      value: formatCompactCurrency(result.monthlyDividendIncome, locale),
      detailValue: formatCurrency(result.monthlyDividendIncome, locale),
      helperText: "Average monthly income based on annualized yield.",
      tone: "--color-highlight",
    },
  ];
}
