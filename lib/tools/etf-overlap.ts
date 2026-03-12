import type { Locale } from "@/lib/i18n";
import type { FormState, ResultCard, ToolFieldConfig } from "@/lib/types";

export type EtfOverlapInputs = {
  etfOneTicker: string;
  etfTwoTicker: string;
};

export type OverlapHolding = {
  symbol: string;
  name: string;
  weightInEtfOne: number;
  weightInEtfTwo: number;
};

export type EtfOverlapResult = {
  estimatedOverlapPercentage: number;
  overlappingHoldings: OverlapHolding[];
};

const overlapMap: Record<string, EtfOverlapResult> = {
  "VTI:VOO": {
    estimatedOverlapPercentage: 86,
    overlappingHoldings: [
      { symbol: "AAPL", name: "Apple", weightInEtfOne: 5.9, weightInEtfTwo: 7.1 },
      { symbol: "MSFT", name: "Microsoft", weightInEtfOne: 5.2, weightInEtfTwo: 6.4 },
      { symbol: "NVDA", name: "NVIDIA", weightInEtfOne: 4.1, weightInEtfTwo: 4.8 },
    ],
  },
  "QQQ:VGT": {
    estimatedOverlapPercentage: 41,
    overlappingHoldings: [
      { symbol: "AAPL", name: "Apple", weightInEtfOne: 9.3, weightInEtfTwo: 18.2 },
      { symbol: "MSFT", name: "Microsoft", weightInEtfOne: 8.5, weightInEtfTwo: 16.8 },
      { symbol: "NVDA", name: "NVIDIA", weightInEtfOne: 7.8, weightInEtfTwo: 11.4 },
    ],
  },
};

const etfOverlapFieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    {
      key: "etfOneTicker",
      label: "ETF 1 ticker",
      type: "ticker",
      placeholder: "VTI",
      helpText: "Placeholder data is available for VTI / VOO and QQQ / VGT.",
    },
    {
      key: "etfTwoTicker",
      label: "ETF 2 ticker",
      type: "ticker",
      placeholder: "VOO",
    },
  ],
  zh: [
    {
      key: "etfOneTicker",
      label: "ETF 1 代码",
      type: "ticker",
      placeholder: "VTI",
      helpText: "当前占位数据支持 VTI / VOO 和 QQQ / VGT 组合。",
    },
    {
      key: "etfTwoTicker",
      label: "ETF 2 代码",
      type: "ticker",
      placeholder: "VOO",
    },
  ],
};

const etfOverlapDefaults: FormState = {
  etfOneTicker: "VTI",
  etfTwoTicker: "VOO",
};

export function getEtfOverlapFields(locale: Locale) {
  return etfOverlapFieldsByLocale[locale];
}

export function getEtfOverlapDefaultState(_locale: Locale) {
  return etfOverlapDefaults;
}

export function parseEtfOverlapInputs(values: FormState): EtfOverlapInputs {
  return {
    etfOneTicker: String(values.etfOneTicker ?? "VTI").trim().toUpperCase(),
    etfTwoTicker: String(values.etfTwoTicker ?? "VOO").trim().toUpperCase(),
  };
}

export function calculateEtfOverlap(inputs: EtfOverlapInputs): EtfOverlapResult {
  const key = `${inputs.etfOneTicker}:${inputs.etfTwoTicker}`;
  const reverseKey = `${inputs.etfTwoTicker}:${inputs.etfOneTicker}`;

  return (
    overlapMap[key] ??
    overlapMap[reverseKey] ?? {
      estimatedOverlapPercentage: 24,
      overlappingHoldings: [
        {
          symbol: "AAPL",
          name: "Apple",
          weightInEtfOne: 3.8,
          weightInEtfTwo: 2.9,
        },
        {
          symbol: "MSFT",
          name: "Microsoft",
          weightInEtfOne: 3.1,
          weightInEtfTwo: 2.4,
        },
        {
          symbol: "AMZN",
          name: "Amazon",
          weightInEtfOne: 1.9,
          weightInEtfTwo: 1.6,
        },
      ],
    }
  );
}

export function buildEtfOverlapSummary(
  result: EtfOverlapResult,
  locale: Locale,
): ResultCard[] {
  if (locale === "zh") {
    return [
      {
        label: "估算重叠比例",
        value: `${result.estimatedOverlapPercentage}%`,
        helperText: "基于占位 ETF 持仓数据得出的静态估算值。",
        tone: "--color-accent",
      },
      {
        label: "主要重叠持仓",
        value: result.overlappingHoldings.map((item) => item.symbol).join(", "),
        helperText: "当前占位模型识别出的主要重叠标的。",
        wrapValue: true,
      },
    ];
  }

  return [
    {
      label: "Estimated overlap percentage",
      value: `${result.estimatedOverlapPercentage}%`,
      helperText: "Static estimate based on placeholder ETF holdings data.",
      tone: "--color-accent",
    },
    {
      label: "Overlapping holdings",
      value: result.overlappingHoldings.map((item) => item.symbol).join(", "),
      helperText: "Top overlapping names currently surfaced by the placeholder model.",
      wrapValue: true,
    },
  ];
}
