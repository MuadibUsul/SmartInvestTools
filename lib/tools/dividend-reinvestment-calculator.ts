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

type DividendReinvestmentInputs = {
  initialInvestment: number;
  dividendYield: number;
  annualPriceGrowth: number;
  years: number;
};

type DividendReinvestmentResult = {
  projectedValue: number;
  endingAnnualDividendIncome: number;
  totalGain: number;
  yearlyBalances: Array<{
    year: number;
    balance: number;
    dividendIncome: number;
  }>;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    { key: "initialInvestment", label: "Initial investment", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "20000" },
    { key: "dividendYield", label: "Dividend yield", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "3.5" },
    { key: "annualPriceGrowth", label: "Annual price growth", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "5" },
    { key: "years", label: "Years", type: "number", suffix: "years", min: 1, step: "1", placeholder: "15" },
  ],
  zh: [
    { key: "initialInvestment", label: "初始投入", type: "currency", prefix: "$", min: 0, step: "100", placeholder: "20000" },
    { key: "dividendYield", label: "股息率", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "3.5" },
    { key: "annualPriceGrowth", label: "年度价格增长", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "5" },
    { key: "years", label: "年数", type: "number", suffix: "年", min: 1, step: "1", placeholder: "15" },
  ],
};

const defaults: FormState = {
  initialInvestment: "20000",
  dividendYield: "3.5",
  annualPriceGrowth: "5",
  years: "15",
};

export function getDividendReinvestmentFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getDividendReinvestmentDefaultState(_locale: Locale) {
  return defaults;
}

export function parseDividendReinvestmentInputs(
  values: FormState,
): DividendReinvestmentInputs {
  return {
    initialInvestment: clampNumber(parseNumber(String(values.initialInvestment), 20000)),
    dividendYield: clampNumber(parseNumber(String(values.dividendYield), 3.5), 0, 100),
    annualPriceGrowth: clampNumber(parseNumber(String(values.annualPriceGrowth), 5), 0, 100),
    years: clampNumber(Math.round(parseNumber(String(values.years), 15)), 1, 100),
  };
}

export function calculateDividendReinvestment(
  inputs: DividendReinvestmentInputs,
): DividendReinvestmentResult {
  let balance = inputs.initialInvestment;
  const yearlyBalances = [];

  for (let year = 1; year <= inputs.years; year += 1) {
    balance *= 1 + (inputs.dividendYield + inputs.annualPriceGrowth) / 100;
    yearlyBalances.push({
      year,
      balance,
      dividendIncome: balance * (inputs.dividendYield / 100),
    });
  }

  const endingPoint = yearlyBalances[yearlyBalances.length - 1];

  return {
    projectedValue: endingPoint.balance,
    endingAnnualDividendIncome: endingPoint.dividendIncome,
    totalGain: endingPoint.balance - inputs.initialInvestment,
    yearlyBalances,
  };
}

export function buildDividendReinvestmentSummary(
  result: DividendReinvestmentResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "预计组合价值",
        value: formatCompactCurrency(result.projectedValue, locale),
        detailValue: formatCurrency(result.projectedValue, locale),
        helperText: "假设股息持续再投资后，组合可能达到的价值。",
        tone: "--color-accent",
      },
      {
        label: "期末年度股息收入",
        value: formatCompactCurrency(result.endingAnnualDividendIncome, locale),
        detailValue: formatCurrency(result.endingAnnualDividendIncome, locale),
        helperText: "按期末组合规模估算的年度股息收入。",
      },
      {
        label: "累计增长",
        value: formatCompactCurrency(result.totalGain, locale),
        detailValue: formatCurrency(result.totalGain, locale),
        helperText: "组合价值相对于初始投入的增量。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Projected portfolio value",
      value: formatCompactCurrency(result.projectedValue, locale),
      detailValue: formatCurrency(result.projectedValue, locale),
      helperText:
        "The estimated portfolio value assuming dividends continue to be reinvested.",
      tone: "--color-accent",
    },
    {
      label: "Ending annual dividend income",
      value: formatCompactCurrency(result.endingAnnualDividendIncome, locale),
      detailValue: formatCurrency(result.endingAnnualDividendIncome, locale),
      helperText:
        "Estimated annual dividend income based on the ending portfolio value.",
    },
    {
      label: "Total growth",
      value: formatCompactCurrency(result.totalGain, locale),
      detailValue: formatCurrency(result.totalGain, locale),
      helperText: "Growth above the initial capital contribution.",
      tone: "--color-highlight",
    },
  ];
}

export function buildDividendReinvestmentChart(
  result: DividendReinvestmentResult,
  locale: Locale,
): ToolChartData {
  return {
    type: "line",
    title:
      locale === "zh" ? "股息再投资增长路径" : "Dividend reinvestment growth",
    description:
      locale === "zh"
        ? "查看组合价值与股息收入如何随着再投资持续增长。"
        : "See how reinvested dividends can expand both value and income over time.",
    labels: result.yearlyBalances.map((point) =>
      locale === "zh" ? `${point.year} 年` : `Year ${point.year}`,
    ),
    datasets: [
      {
        label: locale === "zh" ? "组合价值" : "Portfolio value",
        data: result.yearlyBalances.map((point) => point.balance),
        borderColor: "rgba(15, 155, 142, 0.92)",
        backgroundColor: "rgba(15, 155, 142, 0.18)",
      },
      {
        label: locale === "zh" ? "年度股息收入" : "Annual dividend income",
        data: result.yearlyBalances.map((point) => point.dividendIncome),
        borderColor: "rgba(245, 158, 11, 0.92)",
        backgroundColor: "rgba(245, 158, 11, 0.18)",
      },
    ],
    valuePrefix: "$",
  };
}

