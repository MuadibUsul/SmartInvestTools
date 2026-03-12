import {
  buildCompoundInterestChart,
  buildCompoundInterestSummary,
  calculateCompoundInterest,
  getCompoundInterestDefaultState,
  getCompoundInterestFields,
  parseCompoundInterestInputs,
} from "@/lib/tools/compound-interest";
import {
  buildDividendSummary,
  calculateDividendIncome,
  getDividendCalculatorDefaultState,
  getDividendCalculatorFields,
  parseDividendIncomeInputs,
} from "@/lib/tools/dividend-calculator";
import {
  buildEtfOverlapSummary,
  calculateEtfOverlap,
  getEtfOverlapDefaultState,
  getEtfOverlapFields,
  parseEtfOverlapInputs,
} from "@/lib/tools/etf-overlap";
import {
  buildPortfolioAllocationChart,
  buildPortfolioAllocationSummary,
  calculatePortfolioAllocation,
  getPortfolioAllocationDefaultState,
  getPortfolioAllocationFields,
  parsePortfolioAllocationInputs,
} from "@/lib/tools/portfolio-allocation";
import {
  buildRetirementFireChart,
  buildRetirementFireSummary,
  calculateRetirementFire,
  getRetirementFireDefaultState,
  getRetirementFireFields,
  parseRetirementFireInputs,
} from "@/lib/tools/retirement-fire";
import type { Locale } from "@/lib/i18n";
import { toolsConfig } from "@/lib/tools-config";
import type { RegisteredTool, ToolConfig, ToolDefinition } from "@/lib/types";

const toolDefinitions: Record<string, ToolDefinition> = {
  "compound-interest-calculator": {
    getFields: getCompoundInterestFields,
    getDefaultState: getCompoundInterestDefaultState,
    parseInputs: parseCompoundInterestInputs,
    calculate: calculateCompoundInterest,
    buildSummaryItems: buildCompoundInterestSummary,
    buildChartData: buildCompoundInterestChart,
  } as ToolDefinition,
  "dividend-income-calculator": {
    getFields: getDividendCalculatorFields,
    getDefaultState: getDividendCalculatorDefaultState,
    parseInputs: parseDividendIncomeInputs,
    calculate: calculateDividendIncome,
    buildSummaryItems: buildDividendSummary,
  } as ToolDefinition,
  "etf-overlap-tool": {
    getFields: getEtfOverlapFields,
    getDefaultState: getEtfOverlapDefaultState,
    parseInputs: parseEtfOverlapInputs,
    calculate: calculateEtfOverlap,
    buildSummaryItems: buildEtfOverlapSummary,
  } as ToolDefinition,
  "portfolio-allocation-calculator": {
    getFields: getPortfolioAllocationFields,
    getDefaultState: getPortfolioAllocationDefaultState,
    parseInputs: parsePortfolioAllocationInputs,
    calculate: calculatePortfolioAllocation,
    buildSummaryItems: buildPortfolioAllocationSummary,
    buildChartData: buildPortfolioAllocationChart,
  } as ToolDefinition,
  "retirement-fire-calculator": {
    getFields: getRetirementFireFields,
    getDefaultState: getRetirementFireDefaultState,
    parseInputs: parseRetirementFireInputs,
    calculate: calculateRetirementFire,
    buildSummaryItems: buildRetirementFireSummary,
    buildChartData: buildRetirementFireChart,
  } as ToolDefinition,
};

const registeredTools: Array<ToolConfig & { definition: ToolDefinition }> = toolsConfig.map((tool) => ({
  ...tool,
  definition: toolDefinitions[tool.slug],
}));

function localizeTool(
  tool: ToolConfig & { definition: ToolDefinition },
  locale: Locale,
): RegisteredTool {
  const localizedContent = tool.locales[locale];

  return {
    slug: tool.slug,
    hasChart: tool.hasChart,
    relatedTools: tool.relatedTools,
    title: localizedContent.title,
    shortDescription: localizedContent.shortDescription,
    longDescription: localizedContent.longDescription,
    category: localizedContent.category,
    tags: localizedContent.tags,
    seo: localizedContent.seo,
    faq: localizedContent.faq,
    educationContent: localizedContent.educationContent,
    definition: tool.definition,
  };
}

export function getAllToolSlugs() {
  return registeredTools.map((tool) => tool.slug);
}

export function getAllTools(locale: Locale) {
  return registeredTools.map((tool) => localizeTool(tool, locale));
}

export function getToolBySlug(slug: string, locale: Locale) {
  const tool = registeredTools.find((entry) => entry.slug === slug);

  if (!tool) {
    return undefined;
  }

  return localizeTool(tool, locale);
}
