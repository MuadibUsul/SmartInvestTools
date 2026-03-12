import {
  clampNumber,
  formatNumber,
  formatPercent,
  parseNumber,
} from "@/lib/format";
import { calculateCagr } from "@/lib/financial";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

type CagrInputs = {
  beginningValue: number;
  endingValue: number;
  years: number;
};

type CagrResult = {
  cagr: number;
  growthMultiple: number;
  totalGrowth: number;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    { key: "beginningValue", label: "Beginning value", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "10000" },
    { key: "endingValue", label: "Ending value", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "18000" },
    { key: "years", label: "Years", type: "number", suffix: "years", min: 1, step: "1", placeholder: "5" },
  ],
  zh: [
    { key: "beginningValue", label: "起始金额", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "10000" },
    { key: "endingValue", label: "结束金额", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "18000" },
    { key: "years", label: "年数", type: "number", suffix: "年", min: 1, step: "1", placeholder: "5" },
  ],
};

const defaults: FormState = {
  beginningValue: "10000",
  endingValue: "18000",
  years: "5",
};

export function getCagrFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getCagrDefaultState(_locale: Locale) {
  return defaults;
}

export function parseCagrInputs(values: FormState): CagrInputs {
  return {
    beginningValue: clampNumber(parseNumber(String(values.beginningValue), 10000)),
    endingValue: clampNumber(parseNumber(String(values.endingValue), 18000)),
    years: clampNumber(Math.round(parseNumber(String(values.years), 5)), 1, 100),
  };
}

export function calculateCagrTool(inputs: CagrInputs): CagrResult {
  return {
    cagr: calculateCagr(inputs.beginningValue, inputs.endingValue, inputs.years),
    growthMultiple:
      inputs.beginningValue > 0 ? inputs.endingValue / inputs.beginningValue : 0,
    totalGrowth:
      inputs.beginningValue > 0
        ? ((inputs.endingValue - inputs.beginningValue) / inputs.beginningValue) *
          100
        : 0,
  };
}

export function buildCagrSummary(
  result: CagrResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "年复合增长率",
        value: formatPercent(result.cagr, 2),
        helperText: "把总增长换算成每年等效增速后的结果。",
        tone: "--color-accent",
      },
      {
        label: "总增长率",
        value: formatPercent(result.totalGrowth, 1),
        helperText: "结束金额相对起始金额的总体涨幅。",
      },
      {
        label: "增长倍数",
        value: `${formatNumber(result.growthMultiple, locale, 2)}x`,
        helperText: "结束金额相对起始金额的倍数。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "CAGR",
      value: formatPercent(result.cagr, 2),
      helperText: "The annualized growth rate implied by the total change.",
      tone: "--color-accent",
    },
    {
      label: "Total growth",
      value: formatPercent(result.totalGrowth, 1),
      helperText: "The overall increase from beginning value to ending value.",
    },
    {
      label: "Growth multiple",
      value: `${formatNumber(result.growthMultiple, locale, 2)}x`,
      helperText: "How many times larger the ending value became.",
      tone: "--color-highlight",
    },
  ];
}

