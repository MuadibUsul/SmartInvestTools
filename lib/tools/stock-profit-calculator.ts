import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  parseNumber,
} from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

type StockProfitInputs = {
  buyPrice: number;
  sellPrice: number;
  shares: number;
  fees: number;
};

type StockProfitResult = {
  grossProfit: number;
  netProfit: number;
  returnPercentage: number;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    { key: "buyPrice", label: "Buy price", type: "currency", prefix: "$", min: 0, step: "0.01", placeholder: "150" },
    { key: "sellPrice", label: "Sell price", type: "currency", prefix: "$", min: 0, step: "0.01", placeholder: "182" },
    { key: "shares", label: "Shares", type: "number", min: 0, step: "1", placeholder: "20" },
    { key: "fees", label: "Fees", type: "currency", prefix: "$", min: 0, step: "0.01", placeholder: "15" },
  ],
  zh: [
    { key: "buyPrice", label: "买入价", type: "currency", prefix: "$", min: 0, step: "0.01", placeholder: "150" },
    { key: "sellPrice", label: "卖出价", type: "currency", prefix: "$", min: 0, step: "0.01", placeholder: "182" },
    { key: "shares", label: "股数", type: "number", min: 0, step: "1", placeholder: "20" },
    { key: "fees", label: "费用", type: "currency", prefix: "$", min: 0, step: "0.01", placeholder: "15" },
  ],
};

const defaults: FormState = {
  buyPrice: "150",
  sellPrice: "182",
  shares: "20",
  fees: "15",
};

export function getStockProfitFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getStockProfitDefaultState(_locale: Locale) {
  return defaults;
}

export function parseStockProfitInputs(values: FormState): StockProfitInputs {
  return {
    buyPrice: clampNumber(parseNumber(String(values.buyPrice), 150)),
    sellPrice: clampNumber(parseNumber(String(values.sellPrice), 182)),
    shares: clampNumber(parseNumber(String(values.shares), 20)),
    fees: clampNumber(parseNumber(String(values.fees), 15)),
  };
}

export function calculateStockProfit(inputs: StockProfitInputs): StockProfitResult {
  const grossProfit = (inputs.sellPrice - inputs.buyPrice) * inputs.shares;
  const netProfit = grossProfit - inputs.fees;
  const costBasis = inputs.buyPrice * inputs.shares + inputs.fees;

  return {
    grossProfit,
    netProfit,
    returnPercentage: costBasis > 0 ? (netProfit / costBasis) * 100 : 0,
  };
}

export function buildStockProfitSummary(
  result: StockProfitResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "毛收益",
        value: formatCompactCurrency(result.grossProfit, locale),
        detailValue: formatCurrency(result.grossProfit, locale),
        helperText: "未扣除手续费前的收益结果。",
        tone: "--color-accent",
      },
      {
        label: "净收益",
        value: formatCompactCurrency(result.netProfit, locale),
        detailValue: formatCurrency(result.netProfit, locale),
        helperText: "扣除费用后的实际收益或亏损。",
      },
      {
        label: "净回报率",
        value: formatPercent(result.returnPercentage, 1),
        helperText: "净收益相对于总成本的比例。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Gross profit",
      value: formatCompactCurrency(result.grossProfit, locale),
      detailValue: formatCurrency(result.grossProfit, locale),
      helperText: "Profit before fees are deducted.",
      tone: "--color-accent",
    },
    {
      label: "Net profit",
      value: formatCompactCurrency(result.netProfit, locale),
      detailValue: formatCurrency(result.netProfit, locale),
      helperText: "The actual result after transaction costs.",
    },
    {
      label: "Net return",
      value: formatPercent(result.returnPercentage, 1),
      helperText: "Net profit expressed as a share of total cost.",
      tone: "--color-highlight",
    },
  ];
}

