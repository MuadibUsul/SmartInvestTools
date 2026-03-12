import { clampNumber, formatPercent, parseNumber } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

type RiskVsReturnInputs = {
  expectedReturn: number;
  volatility: number;
};

type RiskVsReturnResult = {
  expectedReturn: number;
  volatility: number;
  efficiencyScore: number;
  profileSummary: string;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    { key: "expectedReturn", label: "Expected return", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "8" },
    { key: "volatility", label: "Volatility proxy", type: "percentage", suffix: "%", min: 0.1, step: "0.1", placeholder: "12" },
  ],
  zh: [
    { key: "expectedReturn", label: "预期收益率", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "8" },
    { key: "volatility", label: "波动率代理值", type: "percentage", suffix: "%", min: 0.1, step: "0.1", placeholder: "12" },
  ],
};

const defaults: FormState = {
  expectedReturn: "8",
  volatility: "12",
};

export function getRiskVsReturnFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getRiskVsReturnDefaultState(_locale: Locale) {
  return defaults;
}

export function parseRiskVsReturnInputs(values: FormState): RiskVsReturnInputs {
  return {
    expectedReturn: clampNumber(parseNumber(String(values.expectedReturn), 8), 0, 100),
    volatility: clampNumber(parseNumber(String(values.volatility), 12), 0.1, 100),
  };
}

export function calculateRiskVsReturn(
  inputs: RiskVsReturnInputs,
): RiskVsReturnResult {
  const efficiencyScore = inputs.expectedReturn / inputs.volatility;
  const profileSummary =
    efficiencyScore >= 0.8
      ? "Return assumptions look strong relative to the selected volatility."
      : efficiencyScore >= 0.5
        ? "Expected return and volatility appear moderately balanced."
        : "The volatility assumption looks high relative to expected return.";

  return {
    ...inputs,
    efficiencyScore,
    profileSummary,
  };
}

export function buildRiskVsReturnSummary(
  result: RiskVsReturnResult,
  locale: Locale,
): ResultCard[] {
  const summary =
    locale === "zh"
      ? result.profileSummary
          .replace(
            "Return assumptions look strong relative to the selected volatility.",
            "相对于你设定的波动水平，这组收益假设看起来较强。",
          )
          .replace(
            "Expected return and volatility appear moderately balanced.",
            "预期收益与波动假设处于中等平衡状态。",
          )
          .replace(
            "The volatility assumption looks high relative to expected return.",
            "相对于预期收益，这组波动假设显得偏高。",
          )
      : result.profileSummary;

  if (locale === "zh") {
    return [
      {
        label: "预期收益率",
        value: formatPercent(result.expectedReturn, 1),
        helperText: "你对年化回报的主观假设。",
        tone: "--color-accent",
      },
      {
        label: "波动率代理值",
        value: formatPercent(result.volatility, 1),
        helperText: "用来近似描述风险水平的波动参数。",
      },
      {
        label: "风险收益概况",
        value: summary,
        helperText: "一个简化版的风险与回报关系提示，不构成投资建议。",
        tone: "--color-highlight",
        wrapValue: true,
      },
    ];
  }

  return [
    {
      label: "Expected return",
      value: formatPercent(result.expectedReturn, 1),
      helperText: "Your assumed annual return.",
      tone: "--color-accent",
    },
    {
      label: "Volatility proxy",
      value: formatPercent(result.volatility, 1),
      helperText: "A simple proxy for the risk or fluctuation level.",
    },
    {
      label: "Risk-return profile",
      value: summary,
      helperText:
        "A simplified interpretation of how your return and volatility assumptions interact.",
      tone: "--color-highlight",
      wrapValue: true,
    },
  ];
}

