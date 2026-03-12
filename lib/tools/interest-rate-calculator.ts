import {
  clampNumber,
  formatNumber,
  formatPercent,
  parseNumber,
} from "@/lib/format";
import { calculateImpliedAnnualRate } from "@/lib/financial";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

type InterestRateInputs = {
  presentValue: number;
  futureValue: number;
  years: number;
};

type InterestRateResult = {
  impliedAnnualRate: number;
  totalGrowth: number;
  growthMultiple: number;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    { key: "presentValue", label: "Present value", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "10000" },
    { key: "futureValue", label: "Future value", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "18000" },
    { key: "years", label: "Years", type: "number", suffix: "years", min: 1, step: "1", placeholder: "5" },
  ],
  zh: [
    { key: "presentValue", label: "当前金额", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "10000" },
    { key: "futureValue", label: "未来金额", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "18000" },
    { key: "years", label: "年数", type: "number", suffix: "年", min: 1, step: "1", placeholder: "5" },
  ],
};

const defaults: FormState = {
  presentValue: "10000",
  futureValue: "18000",
  years: "5",
};

export function getInterestRateFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getInterestRateDefaultState(_locale: Locale) {
  return defaults;
}

export function parseInterestRateInputs(values: FormState): InterestRateInputs {
  return {
    presentValue: clampNumber(parseNumber(String(values.presentValue), 10000)),
    futureValue: clampNumber(parseNumber(String(values.futureValue), 18000)),
    years: clampNumber(Math.round(parseNumber(String(values.years), 5)), 1, 100),
  };
}

export function calculateInterestRate(
  inputs: InterestRateInputs,
): InterestRateResult {
  return {
    impliedAnnualRate: calculateImpliedAnnualRate(
      inputs.presentValue,
      inputs.futureValue,
      inputs.years,
    ),
    totalGrowth:
      inputs.presentValue > 0
        ? ((inputs.futureValue - inputs.presentValue) / inputs.presentValue) * 100
        : 0,
    growthMultiple:
      inputs.presentValue > 0 ? inputs.futureValue / inputs.presentValue : 0,
  };
}

export function buildInterestRateSummary(
  result: InterestRateResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "隐含年化收益率",
        value: formatPercent(result.impliedAnnualRate, 2),
        helperText: "根据当前金额、未来金额和年数反推出的等效年化收益率。",
        tone: "--color-accent",
      },
      {
        label: "总增长率",
        value: formatPercent(result.totalGrowth, 1),
        helperText: "未来金额相对当前金额的总增幅。",
      },
      {
        label: "增长倍数",
        value: `${formatNumber(result.growthMultiple, locale, 2)}x`,
        helperText: "未来金额相对当前金额的倍数。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Implied annual rate",
      value: formatPercent(result.impliedAnnualRate, 2),
      helperText:
        "The annualized rate implied by the present value, future value, and time period.",
      tone: "--color-accent",
    },
    {
      label: "Total growth",
      value: formatPercent(result.totalGrowth, 1),
      helperText: "The overall increase from present value to future value.",
    },
    {
      label: "Growth multiple",
      value: `${formatNumber(result.growthMultiple, locale, 2)}x`,
      helperText: "How many times larger the future value becomes.",
      tone: "--color-highlight",
    },
  ];
}

