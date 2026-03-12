import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  parseNumber,
} from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type {
  AllocationFormValue,
  FormState,
  ResultCard,
  ToolChartData,
  ToolFieldConfig,
} from "@/lib/types";

export type PortfolioAllocationInputs = {
  totalInvestmentAmount: number;
  allocations: AllocationFormValue[];
};

export type PortfolioAllocationSlice = {
  key: string;
  label: string;
  percentage: number;
  amount: number;
};

export type PortfolioAllocationResult = {
  totalInvestmentAmount: number;
  totalPercentage: number;
  slices: PortfolioAllocationSlice[];
};

const defaultAllocationsByLocale: Record<Locale, AllocationFormValue[]> = {
  en: [
    { key: "stocks", label: "Stocks", value: "60" },
    { key: "bonds", label: "Bonds", value: "20" },
    { key: "realEstate", label: "Real estate", value: "10" },
    { key: "cash", label: "Cash", value: "10" },
  ],
  zh: [
    { key: "stocks", label: "股票", value: "60" },
    { key: "bonds", label: "债券", value: "20" },
    { key: "realEstate", label: "房地产", value: "10" },
    { key: "cash", label: "现金", value: "10" },
  ],
};

const portfolioAllocationFieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    {
      key: "totalInvestmentAmount",
      label: "Total investment amount",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "100000",
    },
    {
      key: "allocations",
      label: "Asset allocation percentages",
      type: "allocation-list",
      helpText:
        "A simple asset mix for portfolio planning. Percentages can total above or below 100% and will still be shown.",
      items: defaultAllocationsByLocale.en,
    },
  ],
  zh: [
    {
      key: "totalInvestmentAmount",
      label: "总投资金额",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "100000",
    },
    {
      key: "allocations",
      label: "资产配置比例",
      type: "allocation-list",
      helpText:
        "这是一个简化的资产配置模型。即使总比例高于或低于 100%，工具仍会显示拆分结果。",
      items: defaultAllocationsByLocale.zh,
    },
  ],
};

export function getPortfolioAllocationFields(locale: Locale) {
  return portfolioAllocationFieldsByLocale[locale];
}

export function getPortfolioAllocationDefaultState(locale: Locale): FormState {
  return {
    totalInvestmentAmount: "100000",
    allocations: defaultAllocationsByLocale[locale].map((item) => ({ ...item })),
  };
}

export function parsePortfolioAllocationInputs(
  values: FormState,
): PortfolioAllocationInputs {
  const allocations = Array.isArray(values.allocations)
    ? values.allocations
    : defaultAllocationsByLocale.en;

  return {
    totalInvestmentAmount: clampNumber(
      parseNumber(String(values.totalInvestmentAmount), 100000),
    ),
    allocations: allocations.map((item) => ({
      ...item,
      value: String(clampNumber(parseNumber(item.value, 0), 0, 100)),
    })),
  };
}

export function calculatePortfolioAllocation(
  inputs: PortfolioAllocationInputs,
): PortfolioAllocationResult {
  const slices = inputs.allocations.map((item) => {
    const percentage = clampNumber(parseNumber(item.value, 0), 0, 100);

    return {
      key: item.key,
      label: item.label,
      percentage,
      amount: inputs.totalInvestmentAmount * (percentage / 100),
    };
  });

  return {
    totalInvestmentAmount: inputs.totalInvestmentAmount,
    totalPercentage: slices.reduce((sum, slice) => sum + slice.percentage, 0),
    slices,
  };
}

export function buildPortfolioAllocationSummary(
  result: PortfolioAllocationResult,
  locale: Locale,
): ResultCard[] {
  const largestSlice =
    [...result.slices].sort((a, b) => b.amount - a.amount)[0]?.label ??
    (locale === "zh" ? "暂无" : "N/A");

  if (locale === "zh") {
    return [
      {
        label: "投入资金",
        value: formatCompactCurrency(result.totalInvestmentAmount, locale),
        detailValue: formatCurrency(result.totalInvestmentAmount, locale),
        helperText: "用于本次配置模型的总资产金额。",
        tone: "--color-accent",
      },
      {
        label: "配置比例合计",
        value: formatPercent(result.totalPercentage, 1),
        helperText: "检查比例总和是否与你的目标配置一致。",
        tone: result.totalPercentage === 100 ? "--color-accent" : "--color-highlight",
      },
      {
        label: "最大仓位",
        value: largestSlice,
        helperText: "当前组合中金额占比最高的资产类别。",
      },
    ];
  }

  return [
    {
      label: "Invested capital",
      value: formatCompactCurrency(result.totalInvestmentAmount, locale),
      detailValue: formatCurrency(result.totalInvestmentAmount, locale),
      helperText: "Total portfolio value used for the allocation model.",
      tone: "--color-accent",
    },
    {
      label: "Allocation total",
      value: formatPercent(result.totalPercentage, 1),
      helperText: "Review whether the combined percentages align with your intended target.",
      tone: result.totalPercentage === 100 ? "--color-accent" : "--color-highlight",
    },
    {
      label: "Largest allocation",
      value: largestSlice,
      helperText: "The largest slice in your current portfolio mix.",
    },
  ];
}

export function buildPortfolioAllocationChart(
  result: PortfolioAllocationResult,
  locale: Locale,
): ToolChartData {
  if (locale === "zh") {
    return {
      type: "doughnut",
      title: "配置拆分图",
      description: "直观看到资金在各类资产之间的分布方式。",
      labels: result.slices.map((slice) => slice.label),
      datasets: [
        {
          label: "资产配置",
          data: result.slices.map((slice) => slice.amount),
          backgroundColor: [
            "rgba(15, 155, 142, 0.88)",
            "rgba(245, 158, 11, 0.88)",
            "rgba(59, 130, 246, 0.88)",
            "rgba(148, 163, 184, 0.88)",
          ],
        },
      ],
      valuePrefix: "$",
    };
  }

  return {
    type: "doughnut",
    title: "Allocation breakdown",
    description: "Visualize how your capital is distributed across asset classes.",
    labels: result.slices.map((slice) => slice.label),
    datasets: [
      {
        label: "Allocation",
        data: result.slices.map((slice) => slice.amount),
        backgroundColor: [
          "rgba(15, 155, 142, 0.88)",
          "rgba(245, 158, 11, 0.88)",
          "rgba(59, 130, 246, 0.88)",
          "rgba(148, 163, 184, 0.88)",
        ],
      },
    ],
    valuePrefix: "$",
  };
}
