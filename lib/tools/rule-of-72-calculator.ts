import { clampNumber, formatNumber, formatPercent, parseNumber } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

type RuleOf72Inputs = {
  annualReturnRate: number;
};

type RuleOf72Result = {
  annualReturnRate: number;
  ruleEstimateYears: number;
  exactDoublingYears: number;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    {
      key: "annualReturnRate",
      label: "Annual return rate",
      type: "percentage",
      suffix: "%",
      min: 0.1,
      step: "0.1",
      placeholder: "8",
    },
  ],
  zh: [
    {
      key: "annualReturnRate",
      label: "年化收益率",
      type: "percentage",
      suffix: "%",
      min: 0.1,
      step: "0.1",
      placeholder: "8",
    },
  ],
};

const defaults: FormState = {
  annualReturnRate: "8",
};

function formatYears(value: number, locale: Locale) {
  return locale === "zh"
    ? `${formatNumber(value, locale, 1)} 年`
    : `${formatNumber(value, locale, 1)} years`;
}

export function getRuleOf72Fields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getRuleOf72DefaultState(_locale: Locale) {
  return defaults;
}

export function parseRuleOf72Inputs(values: FormState): RuleOf72Inputs {
  return {
    annualReturnRate: clampNumber(
      parseNumber(String(values.annualReturnRate), 8),
      0.1,
      100,
    ),
  };
}

export function calculateRuleOf72(inputs: RuleOf72Inputs): RuleOf72Result {
  return {
    annualReturnRate: inputs.annualReturnRate,
    ruleEstimateYears: 72 / inputs.annualReturnRate,
    exactDoublingYears:
      Math.log(2) / Math.log(1 + inputs.annualReturnRate / 100),
  };
}

export function buildRuleOf72Summary(
  result: RuleOf72Result,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "72 法则估算翻倍时间",
        value: formatYears(result.ruleEstimateYears, locale),
        helperText: "用 72 除以年化收益率，快速估算资金翻倍大约需要多久。",
        tone: "--color-accent",
      },
      {
        label: "精确翻倍时间",
        value: formatYears(result.exactDoublingYears, locale),
        helperText: "基于复利公式得到的更精确估算值。",
      },
      {
        label: "输入收益率",
        value: formatPercent(result.annualReturnRate, 1),
        helperText: "收益率越高，翻倍所需时间通常越短。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Rule of 72 estimate",
      value: formatYears(result.ruleEstimateYears, locale),
      helperText:
        "A quick shortcut for estimating how long money takes to double.",
      tone: "--color-accent",
    },
    {
      label: "Exact doubling time",
      value: formatYears(result.exactDoublingYears, locale),
      helperText: "A more precise estimate using compound growth math.",
    },
    {
      label: "Input return rate",
      value: formatPercent(result.annualReturnRate, 1),
      helperText: "Higher annual returns generally shorten doubling time.",
      tone: "--color-highlight",
    },
  ];
}

