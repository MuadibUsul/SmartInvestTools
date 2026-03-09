import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  parseNumber,
} from "@/lib/format";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

export type DividendIncomeInputs = {
  investmentAmount: number;
  dividendYield: number;
};

export type DividendIncomeResult = {
  annualDividendIncome: number;
  monthlyDividendIncome: number;
};

export const dividendCalculatorFields: ToolFieldConfig[] = [
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
];

export const dividendCalculatorDefaults: FormState = {
  investmentAmount: "25000",
  dividendYield: "3.5",
};

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

export function buildDividendSummary(result: DividendIncomeResult): ResultCard[] {
  return [
    {
      label: "Annual dividend income",
      value: formatCompactCurrency(result.annualDividendIncome),
      detailValue: formatCurrency(result.annualDividendIncome),
      helperText: "Estimated cash income before taxes and fees.",
      tone: "--color-accent",
    },
    {
      label: "Monthly dividend income",
      value: formatCompactCurrency(result.monthlyDividendIncome),
      detailValue: formatCurrency(result.monthlyDividendIncome),
      helperText: "Average monthly income based on annualized yield.",
      tone: "--color-highlight",
    },
  ];
}
