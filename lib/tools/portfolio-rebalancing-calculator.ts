import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  parseNumber,
} from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

type PortfolioRebalancingInputs = {
  portfolioValue: number;
  currentStocks: number;
  currentBonds: number;
  currentCash: number;
  targetStocks: number;
  targetBonds: number;
  targetCash: number;
};

type PortfolioRebalancingResult = {
  totalBuyAmount: number;
  totalSellAmount: number;
  actionSummary: string;
  allocationGap: number;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    { key: "portfolioValue", label: "Portfolio value", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "200000" },
    { key: "currentStocks", label: "Current stocks %", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "70" },
    { key: "currentBonds", label: "Current bonds %", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "20" },
    { key: "currentCash", label: "Current cash %", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "10" },
    { key: "targetStocks", label: "Target stocks %", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "60" },
    { key: "targetBonds", label: "Target bonds %", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "30" },
    { key: "targetCash", label: "Target cash %", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "10" },
  ],
  zh: [
    { key: "portfolioValue", label: "组合总价值", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "200000" },
    { key: "currentStocks", label: "当前股票占比", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "70" },
    { key: "currentBonds", label: "当前债券占比", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "20" },
    { key: "currentCash", label: "当前现金占比", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "10" },
    { key: "targetStocks", label: "目标股票占比", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "60" },
    { key: "targetBonds", label: "目标债券占比", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "30" },
    { key: "targetCash", label: "目标现金占比", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "10" },
  ],
};

const defaults: FormState = {
  portfolioValue: "200000",
  currentStocks: "70",
  currentBonds: "20",
  currentCash: "10",
  targetStocks: "60",
  targetBonds: "30",
  targetCash: "10",
};

export function getPortfolioRebalancingFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getPortfolioRebalancingDefaultState(_locale: Locale) {
  return defaults;
}

export function parsePortfolioRebalancingInputs(
  values: FormState,
): PortfolioRebalancingInputs {
  return {
    portfolioValue: clampNumber(parseNumber(String(values.portfolioValue), 200000)),
    currentStocks: clampNumber(parseNumber(String(values.currentStocks), 70), 0, 100),
    currentBonds: clampNumber(parseNumber(String(values.currentBonds), 20), 0, 100),
    currentCash: clampNumber(parseNumber(String(values.currentCash), 10), 0, 100),
    targetStocks: clampNumber(parseNumber(String(values.targetStocks), 60), 0, 100),
    targetBonds: clampNumber(parseNumber(String(values.targetBonds), 30), 0, 100),
    targetCash: clampNumber(parseNumber(String(values.targetCash), 10), 0, 100),
  };
}

export function calculatePortfolioRebalancing(
  inputs: PortfolioRebalancingInputs,
): PortfolioRebalancingResult {
  const buckets = [
    {
      label: "Stocks",
      current: inputs.currentStocks,
      target: inputs.targetStocks,
    },
    {
      label: "Bonds",
      current: inputs.currentBonds,
      target: inputs.targetBonds,
    },
    {
      label: "Cash",
      current: inputs.currentCash,
      target: inputs.targetCash,
    },
  ];

  const actions = buckets.map((bucket) => {
    const delta = ((bucket.target - bucket.current) / 100) * inputs.portfolioValue;

    return {
      label: bucket.label,
      delta,
      gap: Math.abs(bucket.target - bucket.current),
    };
  });

  return {
    totalBuyAmount: actions
      .filter((item) => item.delta > 0)
      .reduce((sum, item) => sum + item.delta, 0),
    totalSellAmount: Math.abs(
      actions
        .filter((item) => item.delta < 0)
        .reduce((sum, item) => sum + item.delta, 0),
    ),
    actionSummary: actions
      .map((item) => {
        const sign = item.delta > 0 ? "+" : "";
        return `${item.label} ${sign}${item.delta.toFixed(0)}`;
      })
      .join(" | "),
    allocationGap: actions.reduce((sum, item) => sum + item.gap, 0),
  };
}

export function buildPortfolioRebalancingSummary(
  result: PortfolioRebalancingResult,
  locale: Locale,
): ResultCard[] {
  const actionSummary =
    locale === "zh"
      ? result.actionSummary
          .replace("Stocks", "股票")
          .replace("Bonds", "债券")
          .replace("Cash", "现金")
      : result.actionSummary;

  if (locale === "zh") {
    return [
      {
        label: "需要买入总额",
        value: formatCompactCurrency(result.totalBuyAmount, locale),
        detailValue: formatCurrency(result.totalBuyAmount, locale),
        helperText: "为了贴近目标配置，理论上需要新增买入的金额。",
        tone: "--color-accent",
      },
      {
        label: "需要卖出总额",
        value: formatCompactCurrency(result.totalSellAmount, locale),
        detailValue: formatCurrency(result.totalSellAmount, locale),
        helperText: "为了贴近目标配置，理论上需要卖出的金额。",
      },
      {
        label: "再平衡动作",
        value: actionSummary,
        helperText: "按资产类别拆分的买卖调整方向与金额。",
        tone: "--color-highlight",
        wrapValue: true,
      },
    ];
  }

  return [
    {
      label: "Total amount to buy",
      value: formatCompactCurrency(result.totalBuyAmount, locale),
      detailValue: formatCurrency(result.totalBuyAmount, locale),
      helperText: "The capital you would add across assets to move toward target weights.",
      tone: "--color-accent",
    },
    {
      label: "Total amount to sell",
      value: formatCompactCurrency(result.totalSellAmount, locale),
      detailValue: formatCurrency(result.totalSellAmount, locale),
      helperText: "The capital you would trim from overweight positions.",
    },
    {
      label: "Rebalancing actions",
      value: actionSummary,
      helperText: "Asset-by-asset guidance on how much to buy or sell.",
      tone: "--color-highlight",
      wrapValue: true,
    },
  ];
}

