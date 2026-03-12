import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  parseNumber,
} from "@/lib/format";
import { calculateSimpleInterest } from "@/lib/financial";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

type SimpleInterestInputs = {
  principal: number;
  annualRate: number;
  years: number;
};

type SimpleInterestResult = ReturnType<typeof calculateSimpleInterest> & {
  totalReturnPercentage: number;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    {
      key: "principal",
      label: "Principal",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "10000",
    },
    {
      key: "annualRate",
      label: "Annual rate",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.1",
      placeholder: "5",
    },
    {
      key: "years",
      label: "Years",
      type: "number",
      suffix: "years",
      min: 1,
      step: "1",
      placeholder: "4",
    },
  ],
  zh: [
    {
      key: "principal",
      label: "本金",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "10000",
    },
    {
      key: "annualRate",
      label: "年利率",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.1",
      placeholder: "5",
    },
    {
      key: "years",
      label: "年数",
      type: "number",
      suffix: "年",
      min: 1,
      step: "1",
      placeholder: "4",
    },
  ],
};

const defaults: FormState = {
  principal: "10000",
  annualRate: "5",
  years: "4",
};

export function getSimpleInterestFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getSimpleInterestDefaultState(_locale: Locale) {
  return defaults;
}

export function parseSimpleInterestInputs(values: FormState): SimpleInterestInputs {
  return {
    principal: clampNumber(parseNumber(String(values.principal), 10000)),
    annualRate: clampNumber(parseNumber(String(values.annualRate), 5), 0, 100),
    years: clampNumber(Math.round(parseNumber(String(values.years), 4)), 1, 100),
  };
}

export function calculateSimpleInterestTool(
  inputs: SimpleInterestInputs,
): SimpleInterestResult {
  const result = calculateSimpleInterest(
    inputs.principal,
    inputs.annualRate,
    inputs.years,
  );

  return {
    ...result,
    totalReturnPercentage:
      inputs.principal > 0 ? (result.interestEarned / inputs.principal) * 100 : 0,
  };
}

export function buildSimpleInterestSummary(
  result: SimpleInterestResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "利息收益",
        value: formatCompactCurrency(result.interestEarned, locale),
        detailValue: formatCurrency(result.interestEarned, locale),
        helperText: "按单利公式估算得到的利息部分。",
        tone: "--color-accent",
      },
      {
        label: "期末总金额",
        value: formatCompactCurrency(result.finalAmount, locale),
        detailValue: formatCurrency(result.finalAmount, locale),
        helperText: "本金加上单利收益后的最终金额。",
      },
      {
        label: "总回报率",
        value: formatPercent(result.totalReturnPercentage, 1),
        helperText: "利息收益相对于初始本金的比例。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Interest earned",
      value: formatCompactCurrency(result.interestEarned, locale),
      detailValue: formatCurrency(result.interestEarned, locale),
      helperText: "Estimated interest under a simple interest calculation.",
      tone: "--color-accent",
    },
    {
      label: "Final amount",
      value: formatCompactCurrency(result.finalAmount, locale),
      detailValue: formatCurrency(result.finalAmount, locale),
      helperText: "Principal plus accumulated simple interest.",
    },
    {
      label: "Total return",
      value: formatPercent(result.totalReturnPercentage, 1),
      helperText: "Interest earned as a share of the initial principal.",
      tone: "--color-highlight",
    },
  ];
}

