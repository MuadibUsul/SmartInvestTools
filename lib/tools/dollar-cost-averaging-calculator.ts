import {
  buildMonthlyContributionProjection,
  futureValueOfMonthlyContributions,
} from "@/lib/financial";
import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  parseNumber,
} from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type {
  FormState,
  ResultCard,
  ToolChartData,
  ToolFieldConfig,
} from "@/lib/types";

type DollarCostAveragingInputs = {
  monthlyInvestment: number;
  annualReturnRate: number;
  years: number;
};

type DollarCostAveragingResult = {
  endingValue: number;
  totalContributions: number;
  totalGain: number;
  yearlyValues: ReturnType<typeof buildMonthlyContributionProjection>;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    { key: "monthlyInvestment", label: "Monthly investment", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "500" },
    { key: "annualReturnRate", label: "Expected annual return", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "8" },
    { key: "years", label: "Years", type: "number", suffix: "years", min: 1, step: "1", placeholder: "20" },
  ],
  zh: [
    { key: "monthlyInvestment", label: "每月定投金额", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "500" },
    { key: "annualReturnRate", label: "预期年化收益率", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "8" },
    { key: "years", label: "投资年限", type: "number", suffix: "年", min: 1, step: "1", placeholder: "20" },
  ],
};

const defaults: FormState = {
  monthlyInvestment: "500",
  annualReturnRate: "8",
  years: "20",
};

export function getDollarCostAveragingFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getDollarCostAveragingDefaultState(_locale: Locale) {
  return defaults;
}

export function parseDollarCostAveragingInputs(
  values: FormState,
): DollarCostAveragingInputs {
  return {
    monthlyInvestment: clampNumber(
      parseNumber(String(values.monthlyInvestment), 500),
    ),
    annualReturnRate: clampNumber(
      parseNumber(String(values.annualReturnRate), 8),
      0,
      30,
    ),
    years: clampNumber(Math.round(parseNumber(String(values.years), 20)), 1, 60),
  };
}

export function calculateDollarCostAveraging(
  inputs: DollarCostAveragingInputs,
): DollarCostAveragingResult {
  const endingValue = futureValueOfMonthlyContributions({
    initialAmount: 0,
    monthlyContribution: inputs.monthlyInvestment,
    annualRatePercent: inputs.annualReturnRate,
    years: inputs.years,
  });
  const totalContributions = inputs.monthlyInvestment * inputs.years * 12;

  return {
    endingValue,
    totalContributions,
    totalGain: endingValue - totalContributions,
    yearlyValues: buildMonthlyContributionProjection({
      initialAmount: 0,
      monthlyContribution: inputs.monthlyInvestment,
      annualRatePercent: inputs.annualReturnRate,
      years: inputs.years,
    }),
  };
}

export function buildDollarCostAveragingSummary(
  result: DollarCostAveragingResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "期末资产价值",
        value: formatCompactCurrency(result.endingValue, locale),
        detailValue: formatCurrency(result.endingValue, locale),
        helperText: "在给定定投金额、收益率和年限下的资产估算。",
        tone: "--color-accent",
      },
      {
        label: "累计投入本金",
        value: formatCompactCurrency(result.totalContributions, locale),
        detailValue: formatCurrency(result.totalContributions, locale),
        helperText: "整个定投周期内累计投入的总本金。",
      },
      {
        label: "累计收益",
        value: formatCompactCurrency(result.totalGain, locale),
        detailValue: formatCurrency(result.totalGain, locale),
        helperText: "期末资产与累计本金之间的差额。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Ending value",
      value: formatCompactCurrency(result.endingValue, locale),
      detailValue: formatCurrency(result.endingValue, locale),
      helperText: "The projected ending value under the selected DCA plan.",
      tone: "--color-accent",
    },
    {
      label: "Total contributions",
      value: formatCompactCurrency(result.totalContributions, locale),
      detailValue: formatCurrency(result.totalContributions, locale),
      helperText: "The total principal added over the full DCA period.",
    },
    {
      label: "Total gain",
      value: formatCompactCurrency(result.totalGain, locale),
      detailValue: formatCurrency(result.totalGain, locale),
      helperText: "The growth generated above the capital you contributed.",
      tone: "--color-highlight",
    },
  ];
}

export function buildDollarCostAveragingChart(
  result: DollarCostAveragingResult,
  locale: Locale,
): ToolChartData {
  return {
    type: "line",
    title: locale === "zh" ? "定投增长路径" : "Dollar-cost averaging growth path",
    description:
      locale === "zh"
        ? "比较定投过程中资产价值与累计投入本金的变化。"
        : "Compare portfolio growth and total contributions across the DCA timeline.",
    labels: result.yearlyValues.map((point) =>
      locale === "zh" ? `${point.year} 年` : `Year ${point.year}`,
    ),
    datasets: [
      {
        label: locale === "zh" ? "投资组合价值" : "Portfolio value",
        data: result.yearlyValues.map((point) => point.balance),
        borderColor: "rgba(15, 155, 142, 0.92)",
        backgroundColor: "rgba(15, 155, 142, 0.18)",
      },
      {
        label: locale === "zh" ? "累计投入" : "Total contributions",
        data: result.yearlyValues.map((point) => point.contributions),
        borderColor: "rgba(245, 158, 11, 0.92)",
        backgroundColor: "rgba(245, 158, 11, 0.18)",
      },
    ],
    valuePrefix: "$",
  };
}
