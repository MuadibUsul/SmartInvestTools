import {
  clampNumber,
  formatCompactCurrency,
  formatCurrency,
  parseNumber,
} from "@/lib/format";
import { buildLoanProjection } from "@/lib/financial";
import type { Locale } from "@/lib/i18n";
import type {
  FormState,
  ResultCard,
  ToolChartData,
  ToolFieldConfig,
} from "@/lib/types";

type LoanInterestInputs = {
  principal: number;
  annualRate: number;
  years: number;
};

type LoanInterestResult = ReturnType<typeof buildLoanProjection>;

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    { key: "principal", label: "Loan principal", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "250000" },
    { key: "annualRate", label: "Annual interest rate", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "6.5" },
    { key: "years", label: "Loan term", type: "number", suffix: "years", min: 1, step: "1", placeholder: "30" },
  ],
  zh: [
    { key: "principal", label: "贷款本金", type: "currency", prefix: "$", min: 0, step: "1000", placeholder: "250000" },
    { key: "annualRate", label: "年利率", type: "percentage", suffix: "%", min: 0, step: "0.1", placeholder: "6.5" },
    { key: "years", label: "贷款年限", type: "number", suffix: "年", min: 1, step: "1", placeholder: "30" },
  ],
};

const defaults: FormState = {
  principal: "250000",
  annualRate: "6.5",
  years: "30",
};

export function getLoanInterestFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getLoanInterestDefaultState(_locale: Locale) {
  return defaults;
}

export function parseLoanInterestInputs(values: FormState): LoanInterestInputs {
  return {
    principal: clampNumber(parseNumber(String(values.principal), 250000)),
    annualRate: clampNumber(parseNumber(String(values.annualRate), 6.5), 0, 100),
    years: clampNumber(Math.round(parseNumber(String(values.years), 30)), 1, 50),
  };
}

export function calculateLoanInterest(
  inputs: LoanInterestInputs,
): LoanInterestResult {
  return buildLoanProjection(inputs.principal, inputs.annualRate, inputs.years);
}

export function buildLoanInterestSummary(
  result: LoanInterestResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "每月还款额",
        value: formatCompactCurrency(result.monthlyPayment, locale),
        detailValue: formatCurrency(result.monthlyPayment, locale),
        helperText: "按照等额本息估算的月供金额。",
        tone: "--color-accent",
      },
      {
        label: "总还款额",
        value: formatCompactCurrency(result.totalRepayment, locale),
        detailValue: formatCurrency(result.totalRepayment, locale),
        helperText: "在整个贷款周期内预计支付的总金额。",
      },
      {
        label: "总利息成本",
        value: formatCompactCurrency(result.totalInterest, locale),
        detailValue: formatCurrency(result.totalInterest, locale),
        helperText: "总还款额中由利息构成的部分。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Monthly payment",
      value: formatCompactCurrency(result.monthlyPayment, locale),
      detailValue: formatCurrency(result.monthlyPayment, locale),
      helperText: "Estimated monthly payment under a standard amortized loan.",
      tone: "--color-accent",
    },
    {
      label: "Total repayment",
      value: formatCompactCurrency(result.totalRepayment, locale),
      detailValue: formatCurrency(result.totalRepayment, locale),
      helperText: "The total amount repaid over the selected loan term.",
    },
    {
      label: "Total interest",
      value: formatCompactCurrency(result.totalInterest, locale),
      detailValue: formatCurrency(result.totalInterest, locale),
      helperText: "The portion of total repayment attributable to interest.",
      tone: "--color-highlight",
    },
  ];
}

export function buildLoanInterestChart(
  result: LoanInterestResult,
  locale: Locale,
): ToolChartData {
  return {
    type: "bar",
    title: locale === "zh" ? "贷款余额路径" : "Loan balance path",
    description:
      locale === "zh"
        ? "按年份观察贷款余额如何逐步下降。"
        : "See how the estimated remaining balance declines over time.",
    labels: result.yearlyBalances.map((point) =>
      locale === "zh" ? `${point.year} 年` : `Year ${point.year}`,
    ),
    datasets: [
      {
        label: locale === "zh" ? "剩余本金" : "Remaining balance",
        data: result.yearlyBalances.map((point) => point.balance),
        borderColor: "rgba(59, 130, 246, 0.92)",
        backgroundColor: "rgba(59, 130, 246, 0.72)",
      },
    ],
    valuePrefix: "$",
  };
}

