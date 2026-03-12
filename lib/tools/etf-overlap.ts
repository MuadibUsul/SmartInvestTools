import {
  calculateCoverageBonus,
  calculateRegionSimilarity,
  calculateSizeSimilarity,
  calculateStrategySimilarity,
  clampOverlap,
  etfSuggestions,
  featuredSupportedTickers,
  resolveEtfProfile,
  supportedEtfCount,
  type EtfProfile,
} from "@/lib/etf-catalog";
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
  estimatedOverlapPercentage: number | null;
  overlappingHoldings: OverlapHolding[];
  matchedFundSummary: string;
  supportMessage: string;
  supportedPair: boolean;
};

function buildOverlapHoldings(
  etfOne: EtfProfile,
  etfTwo: EtfProfile,
): OverlapHolding[] {
  const etfTwoHoldings = new Map(
    etfTwo.holdings.map((holding) => [holding.symbol, holding]),
  );

  return etfOne.holdings
    .flatMap((holding) => {
      const matching = etfTwoHoldings.get(holding.symbol);

      if (!matching) {
        return [];
      }

      return [
        {
          symbol: holding.symbol,
          name: holding.name,
          weightInEtfOne: holding.weight,
          weightInEtfTwo: matching.weight,
        },
      ];
    })
    .sort(
      (left, right) =>
        Math.min(right.weightInEtfOne, right.weightInEtfTwo) -
        Math.min(left.weightInEtfOne, left.weightInEtfTwo),
    )
    .slice(0, 6);
}

function calculateHoldingOverlapScore(overlappingHoldings: OverlapHolding[]) {
  return overlappingHoldings.reduce(
    (sum, holding) => sum + Math.min(holding.weightInEtfOne, holding.weightInEtfTwo),
    0,
  );
}

function estimateOverlapPercentage(etfOne: EtfProfile, etfTwo: EtfProfile) {
  if (etfOne.ticker === etfTwo.ticker) {
    return 100;
  }

  if (etfOne.exactFamily && etfOne.exactFamily === etfTwo.exactFamily) {
    return 100;
  }

  const overlappingHoldings = buildOverlapHoldings(etfOne, etfTwo);
  const holdingOverlapScore = calculateHoldingOverlapScore(overlappingHoldings);

  if (etfOne.assetClass === "fixed-income" && etfTwo.assetClass === "fixed-income") {
    return clampOverlap(
      calculateCoverageBonus(etfOne, etfTwo) +
        Math.min(holdingOverlapScore * 0.6, 18),
    );
  }

  const assetClassScore =
    etfOne.assetClass === etfTwo.assetClass
      ? 10
      : etfOne.assetClass === "real-estate" || etfTwo.assetClass === "real-estate"
        ? 3
        : 1;

  return clampOverlap(
    assetClassScore +
      calculateRegionSimilarity(etfOne, etfTwo) * 16 +
      calculateStrategySimilarity(etfOne, etfTwo) * 26 +
      calculateSizeSimilarity(etfOne, etfTwo) * 10 +
      calculateCoverageBonus(etfOne, etfTwo) +
      Math.min(holdingOverlapScore * 0.45, 16),
  );
}

function formatMatchedFundSummary(etfOne: EtfProfile, etfTwo: EtfProfile) {
  return `${etfOne.ticker} · ${etfOne.name} | ${etfTwo.ticker} · ${etfTwo.name}`;
}

const etfOverlapFieldsByLocale: Record<Locale, ToolFieldConfig[]> = {
  en: [
    {
      key: "etfOneTicker",
      label: "ETF 1",
      type: "ticker",
      placeholder: "VOO",
      helpText: `Supports ${supportedEtfCount} widely used ETFs. Type a ticker or official fund name. Quick picks: ${featuredSupportedTickers}.`,
      suggestions: etfSuggestions,
    },
    {
      key: "etfTwoTicker",
      label: "ETF 2",
      type: "ticker",
      placeholder: "QQQ",
      helpText:
        "The tool uses a curated local ETF universe and estimated overlap logic, not live holdings data.",
      suggestions: etfSuggestions,
    },
  ],
  zh: [
    {
      key: "etfOneTicker",
      label: "ETF 1 代码",
      type: "ticker",
      placeholder: "VOO",
      helpText: `当前内置支持 ${supportedEtfCount} 只主流 ETF。可直接输入代码或基金正式名称，常用示例：${featuredSupportedTickers}。`,
      suggestions: etfSuggestions,
    },
    {
      key: "etfTwoTicker",
      label: "ETF 2 代码",
      type: "ticker",
      placeholder: "QQQ",
      helpText: "该工具基于本地内置 ETF 名录与估算逻辑，不是实时持仓数据源。",
      suggestions: etfSuggestions,
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
  const etfOne = resolveEtfProfile(inputs.etfOneTicker);
  const etfTwo = resolveEtfProfile(inputs.etfTwoTicker);

  if (!etfOne || !etfTwo) {
    const missingInputs = [
      !etfOne ? inputs.etfOneTicker : undefined,
      !etfTwo ? inputs.etfTwoTicker : undefined,
    ].filter(Boolean) as string[];

    return {
      estimatedOverlapPercentage: null,
      overlappingHoldings: [],
      matchedFundSummary: featuredSupportedTickers,
      supportMessage: `Unsupported input: ${missingInputs.join(", ")}`,
      supportedPair: false,
    };
  }

  return {
    estimatedOverlapPercentage: estimateOverlapPercentage(etfOne, etfTwo),
    overlappingHoldings: buildOverlapHoldings(etfOne, etfTwo),
    matchedFundSummary: formatMatchedFundSummary(etfOne, etfTwo),
    supportMessage:
      "Estimated using a curated local ETF universe of widely used U.S.-listed ETFs.",
    supportedPair: true,
  };
}

export function buildEtfOverlapSummary(
  result: EtfOverlapResult,
  locale: Locale,
): ResultCard[] {
  if (!result.supportedPair) {
    if (locale === "zh") {
      return [
        {
          label: "估算重叠比例",
          value: "--",
          helperText: "当前输入未命中内置 ETF 名录，请改用支持的代码或基金正式名称。",
          tone: "--color-accent",
        },
        {
          label: "支持的热门 ETF",
          value: result.matchedFundSummary,
          helperText: `当前内置支持 ${supportedEtfCount} 只主流 ETF，可直接从建议列表中选择。`,
          wrapValue: true,
        },
        {
          label: "输入状态",
          value: result.supportMessage.replace("Unsupported input:", "未识别输入:"),
          helperText: "例如可以输入 VOO、QQQ，也可以输入完整基金名称。",
          wrapValue: true,
          tone: "--color-highlight",
        },
      ];
    }

    return [
      {
        label: "Estimated overlap percentage",
        value: "--",
        helperText:
          "The current entry is outside the built-in ETF universe. Try a supported ticker or official fund name.",
        tone: "--color-accent",
      },
      {
        label: "Popular supported ETFs",
        value: result.matchedFundSummary,
        helperText: `The tool currently supports ${supportedEtfCount} widely used ETFs through the built-in universe.`,
        wrapValue: true,
      },
      {
        label: "Input status",
        value: result.supportMessage,
        helperText:
          "You can enter either a ticker such as VOO or an official fund name.",
        wrapValue: true,
        tone: "--color-highlight",
      },
    ];
  }

  const holdingsValue =
    result.overlappingHoldings.length > 0
      ? result.overlappingHoldings.map((item) => item.symbol).join(", ")
      : locale === "zh"
        ? "暂无明显重叠持仓"
        : "No clear overlap surfaced";

  if (locale === "zh") {
    return [
      {
        label: "估算重叠比例",
        value: `${result.estimatedOverlapPercentage}%`,
        helperText: "基于内置 ETF 名录、前排重仓股和结构相似度得出的本地估算值。",
        tone: "--color-accent",
      },
      {
        label: "主要重叠持仓",
        value: holdingsValue,
        helperText: "展示当前这对 ETF 中识别到的代表性重叠持仓。",
        wrapValue: true,
      },
      {
        label: "当前比较基金",
        value: result.matchedFundSummary,
        helperText: "输入时既可以使用代码，也可以直接输入基金正式名称。",
        wrapValue: true,
        tone: "--color-highlight",
      },
    ];
  }

  return [
    {
      label: "Estimated overlap percentage",
      value: `${result.estimatedOverlapPercentage}%`,
      helperText:
        "Local estimate based on the built-in ETF universe, top holdings, and structural similarity.",
      tone: "--color-accent",
    },
    {
      label: "Overlapping holdings",
      value: holdingsValue,
      helperText: "Representative overlapping names surfaced for the selected ETF pair.",
      wrapValue: true,
    },
    {
      label: "Funds compared",
      value: result.matchedFundSummary,
      helperText: "You can use either the ticker or the official ETF name in the input.",
      wrapValue: true,
      tone: "--color-highlight",
    },
  ];
}
