import { clampNumber, parseNumber } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

type InvestmentHorizonInputs = {
  goalAmount: number;
  years: number;
  riskScore: number;
};

type InvestmentHorizonResult = {
  annualTargetPace: number;
  guidance: string;
  horizonLabel: string;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    { key: "goalAmount", label: "Goal amount", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "250000" },
    { key: "years", label: "Time horizon", type: "number", suffix: "years", min: 1, step: "1", placeholder: "12" },
    { key: "riskScore", label: "Risk preference (1-10)", type: "number", min: 1, max: 10, step: "1", placeholder: "6" },
  ],
  zh: [
    { key: "goalAmount", label: "目标金额", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "250000" },
    { key: "years", label: "投资期限", type: "number", suffix: "年", min: 1, step: "1", placeholder: "12" },
    { key: "riskScore", label: "风险偏好（1-10）", type: "number", min: 1, max: 10, step: "1", placeholder: "6" },
  ],
};

const defaults: FormState = {
  goalAmount: "250000",
  years: "12",
  riskScore: "6",
};

export function getInvestmentHorizonFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getInvestmentHorizonDefaultState(_locale: Locale) {
  return defaults;
}

export function parseInvestmentHorizonInputs(
  values: FormState,
): InvestmentHorizonInputs {
  return {
    goalAmount: clampNumber(parseNumber(String(values.goalAmount), 250000)),
    years: clampNumber(Math.round(parseNumber(String(values.years), 12)), 1, 50),
    riskScore: clampNumber(Math.round(parseNumber(String(values.riskScore), 6)), 1, 10),
  };
}

export function calculateInvestmentHorizon(
  inputs: InvestmentHorizonInputs,
): InvestmentHorizonResult {
  const horizonLabel =
    inputs.years <= 3 ? "Short horizon" : inputs.years <= 10 ? "Medium horizon" : "Long horizon";

  let guidance = "A longer horizon can usually absorb more short-term volatility.";

  if (inputs.years <= 3 && inputs.riskScore >= 7) {
    guidance = "High risk appetite combined with a short horizon can create uncomfortable drawdown risk.";
  } else if (inputs.years >= 10 && inputs.riskScore <= 4) {
    guidance = "A long horizon with low risk tolerance may trade away too much expected growth.";
  } else if (inputs.years <= 10 && inputs.riskScore <= 4) {
    guidance = "A balanced or conservative allocation may fit better if capital stability matters most.";
  }

  return {
    annualTargetPace: inputs.goalAmount / inputs.years,
    guidance,
    horizonLabel,
  };
}

export function buildInvestmentHorizonSummary(
  result: InvestmentHorizonResult,
  locale: Locale,
): ResultCard[] {
  const guidance =
    locale === "zh"
      ? result.guidance
          .replace(
            "A longer horizon can usually absorb more short-term volatility.",
            "较长的投资期限通常更能承受短期波动。",
          )
          .replace(
            "High risk appetite combined with a short horizon can create uncomfortable drawdown risk.",
            "高风险偏好叠加较短期限，可能带来更难承受的回撤风险。",
          )
          .replace(
            "A long horizon with low risk tolerance may trade away too much expected growth.",
            "较长期限但风险承受力偏低，可能会放弃过多潜在增长。",
          )
          .replace(
            "A balanced or conservative allocation may fit better if capital stability matters most.",
            "如果资金稳定性更重要，平衡型或偏保守配置可能更合适。",
          )
      : result.guidance;
  const label =
    locale === "zh"
      ? result.horizonLabel
          .replace("Short horizon", "短期")
          .replace("Medium horizon", "中期")
          .replace("Long horizon", "长期")
      : result.horizonLabel;

  return locale === "zh"
    ? [
        {
          label: "期限类型",
          value: label,
          helperText: "根据你输入的年数做出的简化期限分类。",
          tone: "--color-accent",
        },
        {
          label: "年均目标进度",
          value: `${result.annualTargetPace.toFixed(0)}`,
          helperText: "把目标金额平均到每年后的参考节奏。",
        },
        {
          label: "期限建议",
          value: guidance,
          helperText: "结合期限与风险偏好的简化提示。",
          tone: "--color-highlight",
          wrapValue: true,
        },
      ]
    : [
        {
          label: "Horizon type",
          value: label,
          helperText: "A simplified classification based on your selected years.",
          tone: "--color-accent",
        },
        {
          label: "Annual target pace",
          value: `${result.annualTargetPace.toFixed(0)}`,
          helperText: "The average amount your goal implies per year.",
        },
        {
          label: "Planning guidance",
          value: guidance,
          helperText: "A lightweight interpretation of horizon and risk preference.",
          tone: "--color-highlight",
          wrapValue: true,
        },
      ];
}

