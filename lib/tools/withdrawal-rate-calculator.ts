import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  parseNumber,
} from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

type WithdrawalRateInputs = {
  portfolioSize: number;
  annualWithdrawal: number;
};

type WithdrawalRateResult = {
  withdrawalRate: number;
  monthlyWithdrawal: number;
  remainingMultiple: number;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    { key: "portfolioSize", label: "Portfolio size", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "1000000" },
    { key: "annualWithdrawal", label: "Annual withdrawal", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "40000" },
  ],
  zh: [
    { key: "portfolioSize", label: "投资组合规模", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "1000000" },
    { key: "annualWithdrawal", label: "年度提取金额", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "40000" },
  ],
};

const defaults: FormState = {
  portfolioSize: "1000000",
  annualWithdrawal: "40000",
};

export function getWithdrawalRateFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getWithdrawalRateDefaultState(_locale: Locale) {
  return defaults;
}

export function parseWithdrawalRateInputs(
  values: FormState,
): WithdrawalRateInputs {
  return {
    portfolioSize: clampNumber(parseNumber(String(values.portfolioSize), 1000000)),
    annualWithdrawal: clampNumber(
      parseNumber(String(values.annualWithdrawal), 40000),
    ),
  };
}

export function calculateWithdrawalRate(
  inputs: WithdrawalRateInputs,
): WithdrawalRateResult {
  return {
    withdrawalRate:
      inputs.portfolioSize > 0
        ? (inputs.annualWithdrawal / inputs.portfolioSize) * 100
        : 0,
    monthlyWithdrawal: inputs.annualWithdrawal / 12,
    remainingMultiple:
      inputs.annualWithdrawal > 0
        ? inputs.portfolioSize / inputs.annualWithdrawal
        : 0,
  };
}

export function buildWithdrawalRateSummary(
  result: WithdrawalRateResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "提取率",
        value: formatPercent(result.withdrawalRate, 2),
        helperText: "年度提取金额相对于投资组合规模的比例。",
        tone: "--color-accent",
      },
      {
        label: "月度提取额",
        value: formatCompactCurrency(result.monthlyWithdrawal, locale),
        detailValue: formatCurrency(result.monthlyWithdrawal, locale),
        helperText: "把年度提取金额平均到每个月后的水平。",
      },
      {
        label: "资产覆盖年数倍数",
        value: `${result.remainingMultiple.toFixed(1)}x`,
        helperText: "当前组合规模约相当于年度提取额的多少倍。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Withdrawal rate",
      value: formatPercent(result.withdrawalRate, 2),
      helperText:
        "Your annual withdrawal amount expressed as a share of portfolio value.",
      tone: "--color-accent",
    },
    {
      label: "Monthly withdrawal",
      value: formatCompactCurrency(result.monthlyWithdrawal, locale),
      detailValue: formatCurrency(result.monthlyWithdrawal, locale),
      helperText: "The annual withdrawal amount averaged across 12 months.",
    },
    {
      label: "Portfolio multiple",
      value: `${result.remainingMultiple.toFixed(1)}x`,
      helperText:
        "How many times your portfolio covers the selected annual withdrawal.",
      tone: "--color-highlight",
    },
  ];
}

