import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  parseNumber,
} from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

type NetWorthInputs = {
  cash: number;
  investments: number;
  realEstate: number;
  retirementAccounts: number;
  loans: number;
  creditCards: number;
  mortgage: number;
};

type NetWorthResult = {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    { key: "cash", label: "Cash", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "15000" },
    { key: "investments", label: "Investments", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "85000" },
    { key: "realEstate", label: "Real estate", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "250000" },
    { key: "retirementAccounts", label: "Retirement accounts", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "120000" },
    { key: "loans", label: "Loans", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "12000" },
    { key: "creditCards", label: "Credit cards", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "2500" },
    { key: "mortgage", label: "Mortgage", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "180000" },
  ],
  zh: [
    { key: "cash", label: "现金", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "15000" },
    { key: "investments", label: "投资资产", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "85000" },
    { key: "realEstate", label: "房地产", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "250000" },
    { key: "retirementAccounts", label: "退休账户", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "120000" },
    { key: "loans", label: "贷款", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "12000" },
    { key: "creditCards", label: "信用卡负债", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "2500" },
    { key: "mortgage", label: "房贷余额", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "180000" },
  ],
};

const defaults: FormState = {
  cash: "15000",
  investments: "85000",
  realEstate: "250000",
  retirementAccounts: "120000",
  loans: "12000",
  creditCards: "2500",
  mortgage: "180000",
};

export function getNetWorthFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getNetWorthDefaultState(_locale: Locale) {
  return defaults;
}

export function parseNetWorthInputs(values: FormState): NetWorthInputs {
  return {
    cash: clampNumber(parseNumber(String(values.cash), 15000)),
    investments: clampNumber(parseNumber(String(values.investments), 85000)),
    realEstate: clampNumber(parseNumber(String(values.realEstate), 250000)),
    retirementAccounts: clampNumber(
      parseNumber(String(values.retirementAccounts), 120000),
    ),
    loans: clampNumber(parseNumber(String(values.loans), 12000)),
    creditCards: clampNumber(parseNumber(String(values.creditCards), 2500)),
    mortgage: clampNumber(parseNumber(String(values.mortgage), 180000)),
  };
}

export function calculateNetWorth(inputs: NetWorthInputs): NetWorthResult {
  const totalAssets =
    inputs.cash +
    inputs.investments +
    inputs.realEstate +
    inputs.retirementAccounts;
  const totalLiabilities = inputs.loans + inputs.creditCards + inputs.mortgage;

  return {
    totalAssets,
    totalLiabilities,
    netWorth: totalAssets - totalLiabilities,
  };
}

export function buildNetWorthSummary(
  result: NetWorthResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "总资产",
        value: formatCompactCurrency(result.totalAssets, locale),
        detailValue: formatCurrency(result.totalAssets, locale),
        helperText: "你输入的各类资产合计。",
        tone: "--color-accent",
      },
      {
        label: "总负债",
        value: formatCompactCurrency(result.totalLiabilities, locale),
        detailValue: formatCurrency(result.totalLiabilities, locale),
        helperText: "你输入的贷款、信用卡和房贷等负债合计。",
      },
      {
        label: "净资产",
        value: formatCompactCurrency(result.netWorth, locale),
        detailValue: formatCurrency(result.netWorth, locale),
        helperText: "总资产减去总负债后的净值。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Total assets",
      value: formatCompactCurrency(result.totalAssets, locale),
      detailValue: formatCurrency(result.totalAssets, locale),
      helperText: "The combined value of the assets you entered.",
      tone: "--color-accent",
    },
    {
      label: "Total liabilities",
      value: formatCompactCurrency(result.totalLiabilities, locale),
      detailValue: formatCurrency(result.totalLiabilities, locale),
      helperText: "The combined value of the debts and liabilities you entered.",
    },
    {
      label: "Net worth",
      value: formatCompactCurrency(result.netWorth, locale),
      detailValue: formatCurrency(result.netWorth, locale),
      helperText: "Assets minus liabilities.",
      tone: "--color-highlight",
    },
  ];
}

