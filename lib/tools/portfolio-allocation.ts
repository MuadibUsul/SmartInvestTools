import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  parseNumber,
} from "@/lib/format";
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

const defaultAllocations: AllocationFormValue[] = [
  { key: "stocks", label: "Stocks", value: "60" },
  { key: "bonds", label: "Bonds", value: "20" },
  { key: "realEstate", label: "Real estate", value: "10" },
  { key: "cash", label: "Cash", value: "10" },
];

export const portfolioAllocationFields: ToolFieldConfig[] = [
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
    items: defaultAllocations,
  },
];

export const portfolioAllocationDefaults: FormState = {
  totalInvestmentAmount: "100000",
  allocations: defaultAllocations,
};

export function parsePortfolioAllocationInputs(
  values: FormState,
): PortfolioAllocationInputs {
  const allocations = Array.isArray(values.allocations)
    ? values.allocations
    : defaultAllocations;

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
): ResultCard[] {
  const largestSlice =
    [...result.slices].sort((a, b) => b.amount - a.amount)[0]?.label ?? "N/A";

  return [
    {
      label: "Invested capital",
      value: formatCompactCurrency(result.totalInvestmentAmount),
      detailValue: formatCurrency(result.totalInvestmentAmount),
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
): ToolChartData {
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
