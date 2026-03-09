import {
  buildCompoundInterestChart,
  buildCompoundInterestSummary,
  calculateCompoundInterest,
  compoundInterestDefaults,
  compoundInterestFields,
  parseCompoundInterestInputs,
} from "@/lib/tools/compound-interest";
import {
  buildDividendSummary,
  calculateDividendIncome,
  dividendCalculatorDefaults,
  dividendCalculatorFields,
  parseDividendIncomeInputs,
} from "@/lib/tools/dividend-calculator";
import {
  buildEtfOverlapSummary,
  calculateEtfOverlap,
  etfOverlapDefaults,
  etfOverlapFields,
  parseEtfOverlapInputs,
} from "@/lib/tools/etf-overlap";
import {
  buildPortfolioAllocationChart,
  buildPortfolioAllocationSummary,
  calculatePortfolioAllocation,
  parsePortfolioAllocationInputs,
  portfolioAllocationDefaults,
  portfolioAllocationFields,
} from "@/lib/tools/portfolio-allocation";
import {
  buildRetirementFireChart,
  buildRetirementFireSummary,
  calculateRetirementFire,
  parseRetirementFireInputs,
  retirementFireDefaults,
  retirementFireFields,
} from "@/lib/tools/retirement-fire";
import { toolsConfig } from "@/lib/tools-config";
import type { RegisteredTool, ToolDefinition } from "@/lib/types";

const toolDefinitions: Record<string, ToolDefinition> = {
  "compound-interest-calculator": {
    fields: compoundInterestFields,
    defaults: compoundInterestDefaults,
    parseInputs: parseCompoundInterestInputs,
    calculate: calculateCompoundInterest,
    buildSummaryItems: buildCompoundInterestSummary,
    buildChartData: buildCompoundInterestChart,
  } as ToolDefinition,
  "dividend-income-calculator": {
    fields: dividendCalculatorFields,
    defaults: dividendCalculatorDefaults,
    parseInputs: parseDividendIncomeInputs,
    calculate: calculateDividendIncome,
    buildSummaryItems: buildDividendSummary,
  } as ToolDefinition,
  "etf-overlap-tool": {
    fields: etfOverlapFields,
    defaults: etfOverlapDefaults,
    parseInputs: parseEtfOverlapInputs,
    calculate: calculateEtfOverlap,
    buildSummaryItems: buildEtfOverlapSummary,
  } as ToolDefinition,
  "portfolio-allocation-calculator": {
    fields: portfolioAllocationFields,
    defaults: portfolioAllocationDefaults,
    parseInputs: parsePortfolioAllocationInputs,
    calculate: calculatePortfolioAllocation,
    buildSummaryItems: buildPortfolioAllocationSummary,
    buildChartData: buildPortfolioAllocationChart,
  } as ToolDefinition,
  "retirement-fire-calculator": {
    fields: retirementFireFields,
    defaults: retirementFireDefaults,
    parseInputs: parseRetirementFireInputs,
    calculate: calculateRetirementFire,
    buildSummaryItems: buildRetirementFireSummary,
    buildChartData: buildRetirementFireChart,
  } as ToolDefinition,
};

const registeredTools: RegisteredTool[] = toolsConfig.map((tool) => ({
  ...tool,
  definition: toolDefinitions[tool.slug],
}));

export function getAllTools() {
  return registeredTools;
}

export function getToolBySlug(slug: string) {
  return registeredTools.find((tool) => tool.slug === slug);
}
