import { clampNumber } from "@/lib/format";

export type EtfAssetClass = "equity" | "fixed-income" | "real-estate";
export type EtfMarketExposure =
  | "us"
  | "global"
  | "ex-us-all"
  | "ex-us-developed"
  | "emerging";
export type EtfStrategy =
  | "broad"
  | "growth"
  | "value"
  | "dividend"
  | "sector"
  | "bond";
export type EtfSizeProfile = "total" | "large" | "small" | "mixed";
export type EtfSector =
  | "technology"
  | "financials"
  | "healthcare"
  | "energy"
  | undefined;
export type BondDuration = "core" | "long" | undefined;

export type EtfHolding = {
  symbol: string;
  name: string;
  weight: number;
};

export type EtfProfile = {
  ticker: string;
  name: string;
  assetClass: EtfAssetClass;
  marketExposure: EtfMarketExposure;
  strategy: EtfStrategy;
  sizeProfile: EtfSizeProfile;
  sector: EtfSector;
  bondDuration: BondDuration;
  exactFamily?: "sp500";
  aliases: string[];
  holdings: EtfHolding[];
};

export type EtfSuggestion = {
  value: string;
  label: string;
};

export const etfUniverse: EtfProfile[] = [
  {
    ticker: "VTI",
    name: "Vanguard Total Stock Market ETF",
    assetClass: "equity",
    marketExposure: "us",
    strategy: "broad",
    sizeProfile: "total",
    sector: undefined,
    bondDuration: undefined,
    aliases: [
      "Vanguard Total Stock Market ETF",
      "Vanguard Total Stock Market",
      "Total Stock Market ETF",
    ],
    holdings: [
      { symbol: "AAPL", name: "Apple", weight: 6.0 },
      { symbol: "MSFT", name: "Microsoft", weight: 5.5 },
      { symbol: "NVDA", name: "NVIDIA", weight: 4.4 },
      { symbol: "AMZN", name: "Amazon", weight: 3.5 },
      { symbol: "META", name: "Meta Platforms", weight: 2.4 },
      { symbol: "BRK.B", name: "Berkshire Hathaway", weight: 1.8 },
      { symbol: "GOOGL", name: "Alphabet", weight: 1.7 },
      { symbol: "AVGO", name: "Broadcom", weight: 1.5 },
      { symbol: "JPM", name: "JPMorgan Chase", weight: 1.3 },
      { symbol: "TSLA", name: "Tesla", weight: 1.2 },
    ],
  },
  {
    ticker: "VOO",
    name: "Vanguard S&P 500 ETF",
    assetClass: "equity",
    marketExposure: "us",
    strategy: "broad",
    sizeProfile: "large",
    sector: undefined,
    bondDuration: undefined,
    exactFamily: "sp500",
    aliases: ["Vanguard S&P 500 ETF", "Vanguard S&P 500", "S&P 500 ETF"],
    holdings: [
      { symbol: "AAPL", name: "Apple", weight: 7.0 },
      { symbol: "MSFT", name: "Microsoft", weight: 6.8 },
      { symbol: "NVDA", name: "NVIDIA", weight: 6.0 },
      { symbol: "AMZN", name: "Amazon", weight: 3.8 },
      { symbol: "META", name: "Meta Platforms", weight: 2.7 },
      { symbol: "BRK.B", name: "Berkshire Hathaway", weight: 2.0 },
      { symbol: "GOOGL", name: "Alphabet", weight: 1.9 },
      { symbol: "AVGO", name: "Broadcom", weight: 1.8 },
      { symbol: "JPM", name: "JPMorgan Chase", weight: 1.4 },
      { symbol: "TSLA", name: "Tesla", weight: 1.4 },
    ],
  },
  {
    ticker: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    assetClass: "equity",
    marketExposure: "us",
    strategy: "broad",
    sizeProfile: "large",
    sector: undefined,
    bondDuration: undefined,
    exactFamily: "sp500",
    aliases: ["SPDR S&P 500 ETF Trust", "SPDR S&P 500", "SPY ETF"],
    holdings: [
      { symbol: "AAPL", name: "Apple", weight: 7.0 },
      { symbol: "MSFT", name: "Microsoft", weight: 6.8 },
      { symbol: "NVDA", name: "NVIDIA", weight: 6.0 },
      { symbol: "AMZN", name: "Amazon", weight: 3.8 },
      { symbol: "META", name: "Meta Platforms", weight: 2.7 },
      { symbol: "BRK.B", name: "Berkshire Hathaway", weight: 2.0 },
      { symbol: "GOOGL", name: "Alphabet", weight: 1.9 },
      { symbol: "AVGO", name: "Broadcom", weight: 1.8 },
      { symbol: "JPM", name: "JPMorgan Chase", weight: 1.4 },
      { symbol: "TSLA", name: "Tesla", weight: 1.4 },
    ],
  },
  {
    ticker: "IVV",
    name: "iShares Core S&P 500 ETF",
    assetClass: "equity",
    marketExposure: "us",
    strategy: "broad",
    sizeProfile: "large",
    sector: undefined,
    bondDuration: undefined,
    exactFamily: "sp500",
    aliases: ["iShares Core S&P 500 ETF", "iShares S&P 500 ETF", "IVV ETF"],
    holdings: [
      { symbol: "AAPL", name: "Apple", weight: 7.0 },
      { symbol: "MSFT", name: "Microsoft", weight: 6.8 },
      { symbol: "NVDA", name: "NVIDIA", weight: 6.0 },
      { symbol: "AMZN", name: "Amazon", weight: 3.8 },
      { symbol: "META", name: "Meta Platforms", weight: 2.7 },
      { symbol: "BRK.B", name: "Berkshire Hathaway", weight: 2.0 },
      { symbol: "GOOGL", name: "Alphabet", weight: 1.9 },
      { symbol: "AVGO", name: "Broadcom", weight: 1.8 },
      { symbol: "JPM", name: "JPMorgan Chase", weight: 1.4 },
      { symbol: "TSLA", name: "Tesla", weight: 1.4 },
    ],
  },
  {
    ticker: "QQQ",
    name: "Invesco QQQ Trust",
    assetClass: "equity",
    marketExposure: "us",
    strategy: "growth",
    sizeProfile: "large",
    sector: undefined,
    bondDuration: undefined,
    aliases: ["Invesco QQQ Trust", "Nasdaq 100 ETF", "QQQ ETF"],
    holdings: [
      { symbol: "MSFT", name: "Microsoft", weight: 8.5 },
      { symbol: "AAPL", name: "Apple", weight: 8.4 },
      { symbol: "NVDA", name: "NVIDIA", weight: 8.1 },
      { symbol: "AMZN", name: "Amazon", weight: 5.6 },
      { symbol: "META", name: "Meta Platforms", weight: 4.2 },
      { symbol: "AVGO", name: "Broadcom", weight: 4.1 },
      { symbol: "GOOGL", name: "Alphabet", weight: 3.2 },
      { symbol: "TSLA", name: "Tesla", weight: 3.0 },
      { symbol: "COST", name: "Costco", weight: 2.7 },
      { symbol: "NFLX", name: "Netflix", weight: 2.6 },
    ],
  },
  {
    ticker: "VGT",
    name: "Vanguard Information Technology ETF",
    assetClass: "equity",
    marketExposure: "us",
    strategy: "sector",
    sizeProfile: "large",
    sector: "technology",
    bondDuration: undefined,
    aliases: [
      "Vanguard Information Technology ETF",
      "Vanguard Information Technology",
      "Technology ETF",
    ],
    holdings: [
      { symbol: "MSFT", name: "Microsoft", weight: 18.0 },
      { symbol: "AAPL", name: "Apple", weight: 16.5 },
      { symbol: "NVDA", name: "NVIDIA", weight: 11.8 },
      { symbol: "AVGO", name: "Broadcom", weight: 4.8 },
      { symbol: "CRM", name: "Salesforce", weight: 2.0 },
      { symbol: "ORCL", name: "Oracle", weight: 1.9 },
      { symbol: "AMD", name: "AMD", weight: 1.8 },
      { symbol: "ADBE", name: "Adobe", weight: 1.7 },
      { symbol: "CSCO", name: "Cisco", weight: 1.7 },
      { symbol: "IBM", name: "IBM", weight: 1.4 },
    ],
  },
  {
    ticker: "XLK",
    name: "Technology Select Sector SPDR Fund",
    assetClass: "equity",
    marketExposure: "us",
    strategy: "sector",
    sizeProfile: "large",
    sector: "technology",
    bondDuration: undefined,
    aliases: [
      "Technology Select Sector SPDR Fund",
      "Technology Select Sector SPDR",
      "XLK ETF",
    ],
    holdings: [
      { symbol: "MSFT", name: "Microsoft", weight: 22.0 },
      { symbol: "NVDA", name: "NVIDIA", weight: 17.0 },
      { symbol: "AAPL", name: "Apple", weight: 16.0 },
      { symbol: "AVGO", name: "Broadcom", weight: 6.0 },
      { symbol: "CRM", name: "Salesforce", weight: 2.6 },
      { symbol: "ORCL", name: "Oracle", weight: 2.4 },
      { symbol: "AMD", name: "AMD", weight: 2.2 },
      { symbol: "CSCO", name: "Cisco", weight: 2.1 },
      { symbol: "ACN", name: "Accenture", weight: 1.8 },
      { symbol: "IBM", name: "IBM", weight: 1.7 },
    ],
  },
  {
    ticker: "SCHD",
    name: "Schwab U.S. Dividend Equity ETF",
    assetClass: "equity",
    marketExposure: "us",
    strategy: "dividend",
    sizeProfile: "large",
    sector: undefined,
    bondDuration: undefined,
    aliases: [
      "Schwab U.S. Dividend Equity ETF",
      "Schwab Dividend ETF",
      "SCHD ETF",
    ],
    holdings: [
      { symbol: "TXN", name: "Texas Instruments", weight: 4.5 },
      { symbol: "KO", name: "Coca-Cola", weight: 4.2 },
      { symbol: "AMGN", name: "Amgen", weight: 4.0 },
      { symbol: "CSCO", name: "Cisco", weight: 3.8 },
      { symbol: "PEP", name: "PepsiCo", weight: 3.6 },
      { symbol: "HD", name: "Home Depot", weight: 3.5 },
      { symbol: "ABBV", name: "AbbVie", weight: 3.3 },
      { symbol: "MRK", name: "Merck", weight: 3.2 },
      { symbol: "CVX", name: "Chevron", weight: 3.1 },
      { symbol: "VZ", name: "Verizon", weight: 2.8 },
    ],
  },
  {
    ticker: "VYM",
    name: "Vanguard High Dividend Yield ETF",
    assetClass: "equity",
    marketExposure: "us",
    strategy: "dividend",
    sizeProfile: "large",
    sector: undefined,
    bondDuration: undefined,
    aliases: [
      "Vanguard High Dividend Yield ETF",
      "High Dividend Yield ETF",
      "VYM ETF",
    ],
    holdings: [
      { symbol: "BRK.B", name: "Berkshire Hathaway", weight: 4.3 },
      { symbol: "JPM", name: "JPMorgan Chase", weight: 3.6 },
      { symbol: "XOM", name: "Exxon Mobil", weight: 2.9 },
      { symbol: "WMT", name: "Walmart", weight: 2.2 },
      { symbol: "PG", name: "Procter & Gamble", weight: 2.1 },
      { symbol: "JNJ", name: "Johnson & Johnson", weight: 2.0 },
      { symbol: "BAC", name: "Bank of America", weight: 1.9 },
      { symbol: "CVX", name: "Chevron", weight: 1.8 },
      { symbol: "HD", name: "Home Depot", weight: 1.7 },
      { symbol: "MRK", name: "Merck", weight: 1.7 },
    ],
  },
  {
    ticker: "DGRO",
    name: "iShares Core Dividend Growth ETF",
    assetClass: "equity",
    marketExposure: "us",
    strategy: "dividend",
    sizeProfile: "large",
    sector: undefined,
    bondDuration: undefined,
    aliases: [
      "iShares Core Dividend Growth ETF",
      "Dividend Growth ETF",
      "DGRO ETF",
    ],
    holdings: [
      { symbol: "MSFT", name: "Microsoft", weight: 3.6 },
      { symbol: "AAPL", name: "Apple", weight: 3.5 },
      { symbol: "JPM", name: "JPMorgan Chase", weight: 2.3 },
      { symbol: "XOM", name: "Exxon Mobil", weight: 1.9 },
      { symbol: "JNJ", name: "Johnson & Johnson", weight: 1.7 },
      { symbol: "AVGO", name: "Broadcom", weight: 1.6 },
      { symbol: "PG", name: "Procter & Gamble", weight: 1.5 },
      { symbol: "HD", name: "Home Depot", weight: 1.4 },
      { symbol: "ABBV", name: "AbbVie", weight: 1.3 },
      { symbol: "CVX", name: "Chevron", weight: 1.3 },
    ],
  },
  {
    ticker: "VT",
    name: "Vanguard Total World Stock ETF",
    assetClass: "equity",
    marketExposure: "global",
    strategy: "broad",
    sizeProfile: "total",
    sector: undefined,
    bondDuration: undefined,
    aliases: [
      "Vanguard Total World Stock ETF",
      "Total World Stock ETF",
      "VT ETF",
    ],
    holdings: [
      { symbol: "AAPL", name: "Apple", weight: 4.0 },
      { symbol: "MSFT", name: "Microsoft", weight: 3.7 },
      { symbol: "NVDA", name: "NVIDIA", weight: 3.0 },
      { symbol: "AMZN", name: "Amazon", weight: 2.1 },
      { symbol: "META", name: "Meta Platforms", weight: 1.4 },
      { symbol: "TSM", name: "Taiwan Semiconductor", weight: 1.3 },
      { symbol: "AVGO", name: "Broadcom", weight: 1.1 },
      { symbol: "GOOGL", name: "Alphabet", weight: 1.0 },
      { symbol: "TCEHY", name: "Tencent", weight: 0.7 },
      { symbol: "NVO", name: "Novo Nordisk", weight: 0.7 },
    ],
  },
  {
    ticker: "VXUS",
    name: "Vanguard Total International Stock ETF",
    assetClass: "equity",
    marketExposure: "ex-us-all",
    strategy: "broad",
    sizeProfile: "total",
    sector: undefined,
    bondDuration: undefined,
    aliases: [
      "Vanguard Total International Stock ETF",
      "Total International Stock ETF",
      "VXUS ETF",
    ],
    holdings: [
      { symbol: "TSM", name: "Taiwan Semiconductor", weight: 2.8 },
      { symbol: "TCEHY", name: "Tencent", weight: 1.2 },
      { symbol: "SAP", name: "SAP", weight: 1.0 },
      { symbol: "ASML", name: "ASML", weight: 1.0 },
      { symbol: "NVO", name: "Novo Nordisk", weight: 0.9 },
      { symbol: "NESN", name: "Nestle", weight: 0.8 },
      { symbol: "ROG", name: "Roche", weight: 0.7 },
      { symbol: "TM", name: "Toyota", weight: 0.7 },
      { symbol: "BABA", name: "Alibaba", weight: 0.6 },
      { symbol: "AZN", name: "AstraZeneca", weight: 0.6 },
    ],
  },
  {
    ticker: "VEA",
    name: "Vanguard FTSE Developed Markets ETF",
    assetClass: "equity",
    marketExposure: "ex-us-developed",
    strategy: "broad",
    sizeProfile: "large",
    sector: undefined,
    bondDuration: undefined,
    aliases: [
      "Vanguard FTSE Developed Markets ETF",
      "Developed Markets ETF",
      "VEA ETF",
    ],
    holdings: [
      { symbol: "ASML", name: "ASML", weight: 1.8 },
      { symbol: "SAP", name: "SAP", weight: 1.5 },
      { symbol: "NESN", name: "Nestle", weight: 1.4 },
      { symbol: "NVO", name: "Novo Nordisk", weight: 1.4 },
      { symbol: "ROG", name: "Roche", weight: 1.2 },
      { symbol: "AZN", name: "AstraZeneca", weight: 1.2 },
      { symbol: "TM", name: "Toyota", weight: 1.1 },
      { symbol: "SHEL", name: "Shell", weight: 1.0 },
      { symbol: "NVS", name: "Novartis", weight: 0.9 },
      { symbol: "HSBC", name: "HSBC", weight: 0.9 },
    ],
  },
  {
    ticker: "VWO",
    name: "Vanguard FTSE Emerging Markets ETF",
    assetClass: "equity",
    marketExposure: "emerging",
    strategy: "broad",
    sizeProfile: "large",
    sector: undefined,
    bondDuration: undefined,
    aliases: [
      "Vanguard FTSE Emerging Markets ETF",
      "Emerging Markets ETF",
      "VWO ETF",
    ],
    holdings: [
      { symbol: "TSM", name: "Taiwan Semiconductor", weight: 8.7 },
      { symbol: "TCEHY", name: "Tencent", weight: 4.0 },
      { symbol: "BABA", name: "Alibaba", weight: 2.1 },
      { symbol: "005930", name: "Samsung Electronics", weight: 2.0 },
      { symbol: "3690", name: "Meituan", weight: 1.3 },
      { symbol: "HDFCBANK", name: "HDFC Bank", weight: 1.2 },
      { symbol: "RELIANCE", name: "Reliance Industries", weight: 1.1 },
      { symbol: "1810", name: "Xiaomi", weight: 1.0 },
      { symbol: "PDD", name: "PDD Holdings", weight: 0.9 },
      { symbol: "ICICIBANK", name: "ICICI Bank", weight: 0.9 },
    ],
  },
  {
    ticker: "BND",
    name: "Vanguard Total Bond Market ETF",
    assetClass: "fixed-income",
    marketExposure: "us",
    strategy: "bond",
    sizeProfile: "mixed",
    sector: undefined,
    bondDuration: "core",
    aliases: [
      "Vanguard Total Bond Market ETF",
      "Total Bond Market ETF",
      "BND ETF",
    ],
    holdings: [
      { symbol: "UST-INT", name: "U.S. Treasury Intermediate", weight: 18.0 },
      { symbol: "MBS", name: "Agency Mortgage-Backed Securities", weight: 16.0 },
      { symbol: "IG-CORP", name: "Investment Grade Corporates", weight: 13.0 },
      { symbol: "UST-SHORT", name: "U.S. Treasury Short", weight: 10.0 },
      { symbol: "UST-LONG", name: "U.S. Treasury Long", weight: 8.0 },
      { symbol: "ABS", name: "Asset-Backed Securities", weight: 4.0 },
      { symbol: "CMBS", name: "Commercial Mortgage-Backed Securities", weight: 3.0 },
      { symbol: "AGENCY", name: "Agency Bonds", weight: 3.0 },
      { symbol: "MUNI", name: "Taxable Municipals", weight: 2.0 },
      { symbol: "HY-CORP", name: "High Yield Corporates", weight: 1.0 },
    ],
  },
  {
    ticker: "AGG",
    name: "iShares Core U.S. Aggregate Bond ETF",
    assetClass: "fixed-income",
    marketExposure: "us",
    strategy: "bond",
    sizeProfile: "mixed",
    sector: undefined,
    bondDuration: "core",
    aliases: [
      "iShares Core U.S. Aggregate Bond ETF",
      "U.S. Aggregate Bond ETF",
      "AGG ETF",
    ],
    holdings: [
      { symbol: "UST-INT", name: "U.S. Treasury Intermediate", weight: 19.0 },
      { symbol: "MBS", name: "Agency Mortgage-Backed Securities", weight: 17.0 },
      { symbol: "IG-CORP", name: "Investment Grade Corporates", weight: 12.0 },
      { symbol: "UST-SHORT", name: "U.S. Treasury Short", weight: 9.0 },
      { symbol: "UST-LONG", name: "U.S. Treasury Long", weight: 7.0 },
      { symbol: "ABS", name: "Asset-Backed Securities", weight: 4.0 },
      { symbol: "CMBS", name: "Commercial Mortgage-Backed Securities", weight: 2.0 },
      { symbol: "AGENCY", name: "Agency Bonds", weight: 2.0 },
      { symbol: "MUNI", name: "Taxable Municipals", weight: 1.0 },
      { symbol: "HY-CORP", name: "High Yield Corporates", weight: 1.0 },
    ],
  },
  {
    ticker: "TLT",
    name: "iShares 20+ Year Treasury Bond ETF",
    assetClass: "fixed-income",
    marketExposure: "us",
    strategy: "bond",
    sizeProfile: "mixed",
    sector: undefined,
    bondDuration: "long",
    aliases: [
      "iShares 20+ Year Treasury Bond ETF",
      "20+ Year Treasury Bond ETF",
      "TLT ETF",
    ],
    holdings: [
      { symbol: "UST-LONG", name: "U.S. Treasury Long", weight: 21.0 },
      { symbol: "UST-20Y", name: "20 Year Treasury", weight: 18.0 },
      { symbol: "UST-25Y", name: "25 Year Treasury", weight: 16.0 },
      { symbol: "UST-30Y", name: "30 Year Treasury", weight: 15.0 },
      { symbol: "UST-27Y", name: "27 Year Treasury", weight: 8.0 },
      { symbol: "UST-22Y", name: "22 Year Treasury", weight: 7.0 },
      { symbol: "UST-24Y", name: "24 Year Treasury", weight: 6.0 },
      { symbol: "UST-28Y", name: "28 Year Treasury", weight: 4.0 },
      { symbol: "UST-29Y", name: "29 Year Treasury", weight: 3.0 },
      { symbol: "UST-21Y", name: "21 Year Treasury", weight: 2.0 },
    ],
  },
  {
    ticker: "VNQ",
    name: "Vanguard Real Estate ETF",
    assetClass: "real-estate",
    marketExposure: "us",
    strategy: "sector",
    sizeProfile: "large",
    sector: undefined,
    bondDuration: undefined,
    aliases: ["Vanguard Real Estate ETF", "Real Estate ETF", "VNQ ETF"],
    holdings: [
      { symbol: "PLD", name: "Prologis", weight: 7.5 },
      { symbol: "AMT", name: "American Tower", weight: 6.5 },
      { symbol: "EQIX", name: "Equinix", weight: 6.3 },
      { symbol: "WELL", name: "Welltower", weight: 4.5 },
      { symbol: "DLR", name: "Digital Realty", weight: 4.2 },
      { symbol: "SPG", name: "Simon Property Group", weight: 3.0 },
      { symbol: "O", name: "Realty Income", weight: 2.9 },
      { symbol: "CCI", name: "Crown Castle", weight: 2.8 },
      { symbol: "PSA", name: "Public Storage", weight: 2.7 },
      { symbol: "VICI", name: "VICI Properties", weight: 2.6 },
    ],
  },
  {
    ticker: "XLF",
    name: "Financial Select Sector SPDR Fund",
    assetClass: "equity",
    marketExposure: "us",
    strategy: "sector",
    sizeProfile: "large",
    sector: "financials",
    bondDuration: undefined,
    aliases: [
      "Financial Select Sector SPDR Fund",
      "Financial Sector ETF",
      "XLF ETF",
    ],
    holdings: [
      { symbol: "BRK.B", name: "Berkshire Hathaway", weight: 13.0 },
      { symbol: "JPM", name: "JPMorgan Chase", weight: 9.5 },
      { symbol: "V", name: "Visa", weight: 7.4 },
      { symbol: "MA", name: "Mastercard", weight: 6.5 },
      { symbol: "BAC", name: "Bank of America", weight: 4.2 },
      { symbol: "WFC", name: "Wells Fargo", weight: 3.4 },
      { symbol: "GS", name: "Goldman Sachs", weight: 2.8 },
      { symbol: "SPGI", name: "S&P Global", weight: 2.7 },
      { symbol: "MS", name: "Morgan Stanley", weight: 2.4 },
      { symbol: "BLK", name: "BlackRock", weight: 2.1 },
    ],
  },
  {
    ticker: "XLV",
    name: "Health Care Select Sector SPDR Fund",
    assetClass: "equity",
    marketExposure: "us",
    strategy: "sector",
    sizeProfile: "large",
    sector: "healthcare",
    bondDuration: undefined,
    aliases: [
      "Health Care Select Sector SPDR Fund",
      "Healthcare Sector ETF",
      "XLV ETF",
    ],
    holdings: [
      { symbol: "LLY", name: "Eli Lilly", weight: 12.5 },
      { symbol: "UNH", name: "UnitedHealth", weight: 8.8 },
      { symbol: "JNJ", name: "Johnson & Johnson", weight: 6.6 },
      { symbol: "ABBV", name: "AbbVie", weight: 5.2 },
      { symbol: "MRK", name: "Merck", weight: 4.8 },
      { symbol: "TMO", name: "Thermo Fisher", weight: 3.6 },
      { symbol: "ABT", name: "Abbott", weight: 3.1 },
      { symbol: "DHR", name: "Danaher", weight: 2.9 },
      { symbol: "AMGN", name: "Amgen", weight: 2.8 },
      { symbol: "ISRG", name: "Intuitive Surgical", weight: 2.4 },
    ],
  },
  {
    ticker: "XLE",
    name: "Energy Select Sector SPDR Fund",
    assetClass: "equity",
    marketExposure: "us",
    strategy: "sector",
    sizeProfile: "large",
    sector: "energy",
    bondDuration: undefined,
    aliases: ["Energy Select Sector SPDR Fund", "Energy Sector ETF", "XLE ETF"],
    holdings: [
      { symbol: "XOM", name: "Exxon Mobil", weight: 22.0 },
      { symbol: "CVX", name: "Chevron", weight: 16.0 },
      { symbol: "COP", name: "ConocoPhillips", weight: 7.0 },
      { symbol: "EOG", name: "EOG Resources", weight: 4.8 },
      { symbol: "SLB", name: "Schlumberger", weight: 4.1 },
      { symbol: "MPC", name: "Marathon Petroleum", weight: 3.8 },
      { symbol: "PSX", name: "Phillips 66", weight: 3.4 },
      { symbol: "OXY", name: "Occidental Petroleum", weight: 3.1 },
      { symbol: "KMI", name: "Kinder Morgan", weight: 2.5 },
      { symbol: "VLO", name: "Valero", weight: 2.3 },
    ],
  },
  {
    ticker: "IWM",
    name: "iShares Russell 2000 ETF",
    assetClass: "equity",
    marketExposure: "us",
    strategy: "broad",
    sizeProfile: "small",
    sector: undefined,
    bondDuration: undefined,
    aliases: ["iShares Russell 2000 ETF", "Russell 2000 ETF", "IWM ETF"],
    holdings: [
      { symbol: "FIX", name: "Comfort Systems USA", weight: 0.7 },
      { symbol: "EME", name: "EMCOR Group", weight: 0.7 },
      { symbol: "FIVE", name: "Five Below", weight: 0.6 },
      { symbol: "ATI", name: "ATI", weight: 0.6 },
      { symbol: "HALO", name: "Halozyme", weight: 0.6 },
      { symbol: "FN", name: "Fabrinet", weight: 0.6 },
      { symbol: "SKY", name: "Skyline Champion", weight: 0.6 },
      { symbol: "AAON", name: "AAON", weight: 0.6 },
      { symbol: "RBC", name: "RBC Bearings", weight: 0.5 },
      { symbol: "EXLS", name: "ExlService", weight: 0.5 },
    ],
  },
  {
    ticker: "VUG",
    name: "Vanguard Growth ETF",
    assetClass: "equity",
    marketExposure: "us",
    strategy: "growth",
    sizeProfile: "large",
    sector: undefined,
    bondDuration: undefined,
    aliases: ["Vanguard Growth ETF", "Vanguard Growth", "Growth ETF"],
    holdings: [
      { symbol: "MSFT", name: "Microsoft", weight: 12.0 },
      { symbol: "AAPL", name: "Apple", weight: 11.0 },
      { symbol: "NVDA", name: "NVIDIA", weight: 10.0 },
      { symbol: "AMZN", name: "Amazon", weight: 6.0 },
      { symbol: "META", name: "Meta Platforms", weight: 4.8 },
      { symbol: "AVGO", name: "Broadcom", weight: 4.3 },
      { symbol: "GOOGL", name: "Alphabet", weight: 3.9 },
      { symbol: "TSLA", name: "Tesla", weight: 3.2 },
      { symbol: "COST", name: "Costco", weight: 2.4 },
      { symbol: "NFLX", name: "Netflix", weight: 2.2 },
    ],
  },
  {
    ticker: "VTV",
    name: "Vanguard Value ETF",
    assetClass: "equity",
    marketExposure: "us",
    strategy: "value",
    sizeProfile: "large",
    sector: undefined,
    bondDuration: undefined,
    aliases: ["Vanguard Value ETF", "Vanguard Value", "Value ETF"],
    holdings: [
      { symbol: "BRK.B", name: "Berkshire Hathaway", weight: 3.8 },
      { symbol: "JPM", name: "JPMorgan Chase", weight: 3.0 },
      { symbol: "XOM", name: "Exxon Mobil", weight: 2.8 },
      { symbol: "WMT", name: "Walmart", weight: 2.6 },
      { symbol: "PG", name: "Procter & Gamble", weight: 2.3 },
      { symbol: "UNH", name: "UnitedHealth", weight: 2.2 },
      { symbol: "JNJ", name: "Johnson & Johnson", weight: 2.0 },
      { symbol: "CVX", name: "Chevron", weight: 1.9 },
      { symbol: "BAC", name: "Bank of America", weight: 1.7 },
      { symbol: "KO", name: "Coca-Cola", weight: 1.6 },
    ],
  },
];

export const supportedEtfCount = etfUniverse.length;
export const etfSuggestions: EtfSuggestion[] = etfUniverse.map((profile) => ({
  value: profile.ticker,
  label: profile.name,
}));
export const featuredSupportedTickers = etfUniverse
  .slice(0, 10)
  .map((profile) => profile.ticker)
  .join(", ");

const etfProfileByTicker = new Map(
  etfUniverse.map((profile) => [profile.ticker, profile]),
);

function normalizeIdentifier(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/&/g, "AND")
    .replace(/[^A-Z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const etfAliasMap = new Map<string, string>();

for (const profile of etfUniverse) {
  etfAliasMap.set(normalizeIdentifier(profile.ticker), profile.ticker);

  for (const alias of profile.aliases) {
    etfAliasMap.set(normalizeIdentifier(alias), profile.ticker);
  }
}

export function resolveEtfProfile(value: string) {
  const normalized = normalizeIdentifier(value);
  const ticker = etfAliasMap.get(normalized);

  return ticker ? etfProfileByTicker.get(ticker) : undefined;
}

export function calculateRegionSimilarity(etfOne: EtfProfile, etfTwo: EtfProfile) {
  if (etfOne.marketExposure === etfTwo.marketExposure) {
    return 1;
  }

  const pair = [etfOne.marketExposure, etfTwo.marketExposure].sort().join(":");

  switch (pair) {
    case "global:us":
    case "ex-us-all:global":
    case "ex-us-developed:global":
    case "emerging:global":
      return 0.62;
    case "ex-us-all:ex-us-developed":
      return 0.7;
    case "emerging:ex-us-all":
      return 0.35;
    case "emerging:ex-us-developed":
      return 0.1;
    default:
      return 0.05;
  }
}

export function calculateStrategySimilarity(
  etfOne: EtfProfile,
  etfTwo: EtfProfile,
) {
  if (etfOne.strategy === "sector" && etfTwo.strategy === "sector") {
    return etfOne.sector === etfTwo.sector ? 1 : 0.1;
  }

  if (etfOne.strategy === etfTwo.strategy) {
    return 0.78;
  }

  const strategies = [etfOne.strategy, etfTwo.strategy];

  if (strategies.includes("broad") && strategies.includes("growth")) {
    return 0.48;
  }

  if (strategies.includes("broad") && strategies.includes("value")) {
    return 0.44;
  }

  if (strategies.includes("broad") && strategies.includes("dividend")) {
    return 0.5;
  }

  if (strategies.includes("broad") && strategies.includes("sector")) {
    return 0.24;
  }

  if (strategies.includes("growth") && strategies.includes("sector")) {
    return etfOne.sector === "technology" || etfTwo.sector === "technology"
      ? 0.32
      : 0.18;
  }

  if (strategies.includes("value") && strategies.includes("dividend")) {
    return 0.58;
  }

  if (strategies.includes("bond")) {
    return 0.72;
  }

  return 0.18;
}

export function calculateSizeSimilarity(etfOne: EtfProfile, etfTwo: EtfProfile) {
  if (etfOne.sizeProfile === etfTwo.sizeProfile) {
    return 1;
  }

  const pair = [etfOne.sizeProfile, etfTwo.sizeProfile].sort().join(":");

  switch (pair) {
    case "large:total":
      return 0.8;
    case "large:mixed":
    case "mixed:small":
    case "mixed:total":
      return 0.65;
    case "small:total":
      return 0.25;
    case "large:small":
      return 0.08;
    default:
      return 0.4;
  }
}

export function calculateCoverageBonus(etfOne: EtfProfile, etfTwo: EtfProfile) {
  if (etfOne.exactFamily && etfOne.exactFamily === etfTwo.exactFamily) {
    return 100;
  }

  if (etfOne.assetClass === "fixed-income" && etfTwo.assetClass === "fixed-income") {
    let score = 18;

    if (etfOne.bondDuration === etfTwo.bondDuration) {
      score += 38;
    } else if (
      etfOne.bondDuration === "core" ||
      etfTwo.bondDuration === "core"
    ) {
      score += 12;
    }

    return score;
  }

  let bonus = 0;

  if (
    etfOne.marketExposure === "us" &&
    etfTwo.marketExposure === "us" &&
    etfOne.strategy === "broad" &&
    etfTwo.strategy === "broad" &&
    [etfOne.sizeProfile, etfTwo.sizeProfile].includes("total") &&
    [etfOne.sizeProfile, etfTwo.sizeProfile].includes("large")
  ) {
    bonus += 14;
  }

  if (
    [etfOne.marketExposure, etfTwo.marketExposure].sort().join(":") ===
    "ex-us-all:ex-us-developed"
  ) {
    bonus += 8;
  }

  if (
    [etfOne.marketExposure, etfTwo.marketExposure].sort().join(":") ===
    "emerging:ex-us-all"
  ) {
    bonus += 4;
  }

  if (
    (etfOne.marketExposure === "global" && etfTwo.strategy === "broad") ||
    (etfTwo.marketExposure === "global" && etfOne.strategy === "broad")
  ) {
    bonus += 8;
  }

  if (
    (etfOne.strategy === "value" && etfTwo.strategy === "dividend") ||
    (etfOne.strategy === "dividend" && etfTwo.strategy === "value")
  ) {
    bonus += 8;
  }

  if (
    (etfOne.strategy === "growth" && etfTwo.sector === "technology") ||
    (etfTwo.strategy === "growth" && etfOne.sector === "technology")
  ) {
    bonus += 10;
  }

  if (etfOne.sector && etfOne.sector === etfTwo.sector) {
    bonus += 20;
  }

  if (
    (etfOne.assetClass === "real-estate" && etfTwo.marketExposure === "us") ||
    (etfTwo.assetClass === "real-estate" && etfOne.marketExposure === "us")
  ) {
    bonus += 4;
  }

  return bonus;
}

export function clampOverlap(value: number) {
  return clampNumber(Math.round(value), 1, 98);
}
