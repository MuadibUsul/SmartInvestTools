import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  parseNumber,
} from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

type StockAveragePriceInputs = {
  lotOneShares: number;
  lotOnePrice: number;
  lotTwoShares: number;
  lotTwoPrice: number;
  lotThreeShares: number;
  lotThreePrice: number;
};

type StockAveragePriceResult = {
  totalShares: number;
  totalCost: number;
  averagePrice: number;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    { key: "lotOneShares", label: "Lot 1 shares", type: "number", min: 0, step: "1", placeholder: "10" },
    { key: "lotOnePrice", label: "Lot 1 price", type: "currency", prefix: "$", min: 0, step: "0.01", placeholder: "180" },
    { key: "lotTwoShares", label: "Lot 2 shares", type: "number", min: 0, step: "1", placeholder: "6" },
    { key: "lotTwoPrice", label: "Lot 2 price", type: "currency", prefix: "$", min: 0, step: "0.01", placeholder: "160" },
    { key: "lotThreeShares", label: "Lot 3 shares", type: "number", min: 0, step: "1", placeholder: "4" },
    { key: "lotThreePrice", label: "Lot 3 price", type: "currency", prefix: "$", min: 0, step: "0.01", placeholder: "145" },
  ],
  zh: [
    { key: "lotOneShares", label: "第 1 笔股数", type: "number", min: 0, step: "1", placeholder: "10" },
    { key: "lotOnePrice", label: "第 1 笔价格", type: "currency", prefix: "$", min: 0, step: "0.01", placeholder: "180" },
    { key: "lotTwoShares", label: "第 2 笔股数", type: "number", min: 0, step: "1", placeholder: "6" },
    { key: "lotTwoPrice", label: "第 2 笔价格", type: "currency", prefix: "$", min: 0, step: "0.01", placeholder: "160" },
    { key: "lotThreeShares", label: "第 3 笔股数", type: "number", min: 0, step: "1", placeholder: "4" },
    { key: "lotThreePrice", label: "第 3 笔价格", type: "currency", prefix: "$", min: 0, step: "0.01", placeholder: "145" },
  ],
};

const defaults: FormState = {
  lotOneShares: "10",
  lotOnePrice: "180",
  lotTwoShares: "6",
  lotTwoPrice: "160",
  lotThreeShares: "4",
  lotThreePrice: "145",
};

export function getStockAveragePriceFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getStockAveragePriceDefaultState(_locale: Locale) {
  return defaults;
}

export function parseStockAveragePriceInputs(
  values: FormState,
): StockAveragePriceInputs {
  return {
    lotOneShares: clampNumber(parseNumber(String(values.lotOneShares), 10)),
    lotOnePrice: clampNumber(parseNumber(String(values.lotOnePrice), 180)),
    lotTwoShares: clampNumber(parseNumber(String(values.lotTwoShares), 6)),
    lotTwoPrice: clampNumber(parseNumber(String(values.lotTwoPrice), 160)),
    lotThreeShares: clampNumber(parseNumber(String(values.lotThreeShares), 4)),
    lotThreePrice: clampNumber(parseNumber(String(values.lotThreePrice), 145)),
  };
}

export function calculateStockAveragePrice(
  inputs: StockAveragePriceInputs,
): StockAveragePriceResult {
  const totalCost =
    inputs.lotOneShares * inputs.lotOnePrice +
    inputs.lotTwoShares * inputs.lotTwoPrice +
    inputs.lotThreeShares * inputs.lotThreePrice;
  const totalShares =
    inputs.lotOneShares + inputs.lotTwoShares + inputs.lotThreeShares;

  return {
    totalShares,
    totalCost,
    averagePrice: totalShares > 0 ? totalCost / totalShares : 0,
  };
}

export function buildStockAveragePriceSummary(
  result: StockAveragePriceResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "加权平均成本",
        value: formatCompactCurrency(result.averagePrice, locale),
        detailValue: formatCurrency(result.averagePrice, locale),
        helperText: "按照每笔买入股数与价格加权后的平均持仓成本。",
        tone: "--color-accent",
      },
      {
        label: "总持股数",
        value: formatNumber(result.totalShares, locale, 0),
        helperText: "三笔买入合并后的总股数。",
      },
      {
        label: "总投入成本",
        value: formatCompactCurrency(result.totalCost, locale),
        detailValue: formatCurrency(result.totalCost, locale),
        helperText: "所有买入批次合计投入的总金额。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Weighted average cost",
      value: formatCompactCurrency(result.averagePrice, locale),
      detailValue: formatCurrency(result.averagePrice, locale),
      helperText:
        "Your blended purchase price across all entered share lots.",
      tone: "--color-accent",
    },
    {
      label: "Total shares",
      value: formatNumber(result.totalShares, locale, 0),
      helperText: "The combined number of shares across all lots.",
    },
    {
      label: "Total cost basis",
      value: formatCompactCurrency(result.totalCost, locale),
      detailValue: formatCurrency(result.totalCost, locale),
      helperText: "The total capital committed across all entered purchases.",
      tone: "--color-highlight",
    },
  ];
}

