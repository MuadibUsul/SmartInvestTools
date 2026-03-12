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

type InflationInputs = {
  currentAmount: number;
  inflationRate: number;
  years: number;
};

type InflationResult = {
  futureCost: number;
  futurePurchasingPower: number;
  lostPurchasingPower: number;
  yearlyValues: Array<{
    year: number;
    futureCost: number;
    futurePurchasingPower: number;
  }>;
};

const fieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    {
      key: "currentAmount",
      label: "Current amount",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "10000",
    },
    {
      key: "inflationRate",
      label: "Annual inflation rate",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.1",
      placeholder: "3",
    },
    {
      key: "years",
      label: "Years",
      type: "number",
      suffix: "years",
      min: 1,
      step: "1",
      placeholder: "10",
    },
  ],
  zh: [
    {
      key: "currentAmount",
      label: "当前金额",
      type: "currency",
      prefix: "$",
      min: 0,
      step: "100",
      placeholder: "10000",
    },
    {
      key: "inflationRate",
      label: "年通胀率",
      type: "percentage",
      suffix: "%",
      min: 0,
      step: "0.1",
      placeholder: "3",
    },
    {
      key: "years",
      label: "年数",
      type: "number",
      suffix: "年",
      min: 1,
      step: "1",
      placeholder: "10",
    },
  ],
};

const defaults: FormState = {
  currentAmount: "10000",
  inflationRate: "3",
  years: "10",
};

export function getInflationFields(locale: Locale) {
  return fieldsByLocale[locale];
}

export function getInflationDefaultState(_locale: Locale) {
  return defaults;
}

export function parseInflationInputs(values: FormState): InflationInputs {
  return {
    currentAmount: clampNumber(parseNumber(String(values.currentAmount), 10000)),
    inflationRate: clampNumber(
      parseNumber(String(values.inflationRate), 3),
      0,
      100,
    ),
    years: clampNumber(Math.round(parseNumber(String(values.years), 10)), 1, 100),
  };
}

export function calculateInflation(inputs: InflationInputs): InflationResult {
  const yearlyValues = Array.from({ length: inputs.years }, (_, index) => {
    const year = index + 1;
    const factor = (1 + inputs.inflationRate / 100) ** year;

    return {
      year,
      futureCost: inputs.currentAmount * factor,
      futurePurchasingPower: inputs.currentAmount / factor,
    };
  });

  const lastPoint = yearlyValues[yearlyValues.length - 1];

  return {
    futureCost: lastPoint.futureCost,
    futurePurchasingPower: lastPoint.futurePurchasingPower,
    lostPurchasingPower: inputs.currentAmount - lastPoint.futurePurchasingPower,
    yearlyValues,
  };
}

export function buildInflationSummary(
  result: InflationResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "未来等值购买成本",
        value: formatCompactCurrency(result.futureCost, locale),
        detailValue: formatCurrency(result.futureCost, locale),
        helperText: "按设定通胀率推算，未来买到同样东西可能需要的金额。",
        tone: "--color-accent",
      },
      {
        label: "当前金额未来购买力",
        value: formatCompactCurrency(result.futurePurchasingPower, locale),
        detailValue: formatCurrency(result.futurePurchasingPower, locale),
        helperText: "如果金额不增长，它在未来可能对应的购买力水平。",
      },
      {
        label: "购买力缩水",
        value: formatCompactCurrency(result.lostPurchasingPower, locale),
        detailValue: formatCurrency(result.lostPurchasingPower, locale),
        helperText: "与今天相比，被通胀侵蚀掉的购买力差额。",
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Future equivalent cost",
      value: formatCompactCurrency(result.futureCost, locale),
      detailValue: formatCurrency(result.futureCost, locale),
      helperText:
        "What the same basket of goods could cost in the future at your inflation assumption.",
      tone: "--color-accent",
    },
    {
      label: "Future purchasing power",
      value: formatCompactCurrency(result.futurePurchasingPower, locale),
      detailValue: formatCurrency(result.futurePurchasingPower, locale),
      helperText:
        "The future buying power of the same amount if it does not grow.",
    },
    {
      label: "Purchasing power lost",
      value: formatCompactCurrency(result.lostPurchasingPower, locale),
      detailValue: formatCurrency(result.lostPurchasingPower, locale),
      helperText:
        "The amount of buying power lost to inflation over the selected timeline.",
      tone: "--color-highlight",
    },
  ];
}

export function buildInflationChart(
  result: InflationResult,
  locale: Locale,
): ToolChartData {
  return {
    type: "line",
    title: locale === "zh" ? "通胀影响路径" : "Inflation path",
    description:
      locale === "zh"
        ? "对比未来等值成本与当前金额购买力随时间的变化。"
        : "Compare how future cost and purchasing power evolve over time.",
    labels: result.yearlyValues.map((point) =>
      locale === "zh" ? `${point.year} 年` : `Year ${point.year}`,
    ),
    datasets: [
      {
        label: locale === "zh" ? "未来等值成本" : "Future equivalent cost",
        data: result.yearlyValues.map((point) => point.futureCost),
        borderColor: "rgba(15, 155, 142, 0.92)",
        backgroundColor: "rgba(15, 155, 142, 0.18)",
      },
      {
        label: locale === "zh" ? "购买力" : "Purchasing power",
        data: result.yearlyValues.map((point) => point.futurePurchasingPower),
        borderColor: "rgba(245, 158, 11, 0.92)",
        backgroundColor: "rgba(245, 158, 11, 0.18)",
      },
    ],
    valuePrefix: "$",
  };
}

