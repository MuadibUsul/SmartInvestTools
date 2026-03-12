import * as bondYield from "@/lib/tools/bond-yield-calculator";
import * as cagr from "@/lib/tools/cagr-calculator";
import * as compoundInterest from "@/lib/tools/compound-interest";
import * as dividendIncome from "@/lib/tools/dividend-calculator";
import * as dividendReinvestment from "@/lib/tools/dividend-reinvestment-calculator";
import * as dollarCostAveraging from "@/lib/tools/dollar-cost-averaging-calculator";
import * as earlyRetirement from "@/lib/tools/early-retirement-calculator";
import * as emergencyFund from "@/lib/tools/emergency-fund-calculator";
import * as etfExpense from "@/lib/tools/etf-expense-calculator";
import * as etfOverlap from "@/lib/tools/etf-overlap";
import * as financialIndependence from "@/lib/tools/financial-independence-calculator";
import * as futureValue from "@/lib/tools/future-value-calculator";
import * as inflation from "@/lib/tools/inflation-calculator";
import * as interestRate from "@/lib/tools/interest-rate-calculator";
import * as investmentFee from "@/lib/tools/investment-fee-calculator";
import * as investmentHorizon from "@/lib/tools/investment-horizon-calculator";
import * as investmentReturn from "@/lib/tools/investment-return-calculator";
import * as investmentTime from "@/lib/tools/investment-time-calculator";
import * as loanInterest from "@/lib/tools/loan-interest-calculator";
import * as lumpSumInvestment from "@/lib/tools/lump-sum-investment-calculator";
import * as monthlyInvestment from "@/lib/tools/monthly-investment-calculator";
import * as netWorth from "@/lib/tools/net-worth-calculator";
import * as passiveIncome from "@/lib/tools/passive-income-calculator";
import * as portfolioAllocation from "@/lib/tools/portfolio-allocation";
import * as portfolioRebalancing from "@/lib/tools/portfolio-rebalancing-calculator";
import * as presentValue from "@/lib/tools/present-value-calculator";
import * as retirementContribution from "@/lib/tools/retirement-contribution-calculator";
import * as retirementFire from "@/lib/tools/retirement-fire";
import * as riskVsReturn from "@/lib/tools/risk-vs-return-calculator";
import * as ruleOf72 from "@/lib/tools/rule-of-72-calculator";
import * as savingsGoal from "@/lib/tools/savings-goal-calculator";
import * as simpleInterest from "@/lib/tools/simple-interest-calculator";
import * as stockAveragePrice from "@/lib/tools/stock-average-price-calculator";
import * as stockProfit from "@/lib/tools/stock-profit-calculator";
import * as withdrawalRate from "@/lib/tools/withdrawal-rate-calculator";

import type { Locale } from "@/lib/i18n";
import { toolsConfig } from "@/lib/tools-config";
import type { RegisteredTool, ToolConfig, ToolDefinition } from "@/lib/types";

type AnyToolDefinition = ToolDefinition<any, any>;

const toolDefinitions: Record<string, AnyToolDefinition> = {
  "compound-interest-calculator": {
    getFields: compoundInterest.getCompoundInterestFields,
    getDefaultState: compoundInterest.getCompoundInterestDefaultState,
    parseInputs: compoundInterest.parseCompoundInterestInputs,
    calculate: compoundInterest.calculateCompoundInterest,
    buildSummaryItems: compoundInterest.buildCompoundInterestSummary,
    buildChartData: compoundInterest.buildCompoundInterestChart,
  },
  "rule-of-72-calculator": {
    getFields: ruleOf72.getRuleOf72Fields,
    getDefaultState: ruleOf72.getRuleOf72DefaultState,
    parseInputs: ruleOf72.parseRuleOf72Inputs,
    calculate: ruleOf72.calculateRuleOf72,
    buildSummaryItems: ruleOf72.buildRuleOf72Summary,
  },
  "investment-return-calculator": {
    getFields: investmentReturn.getInvestmentReturnFields,
    getDefaultState: investmentReturn.getInvestmentReturnDefaultState,
    parseInputs: investmentReturn.parseInvestmentReturnInputs,
    calculate: investmentReturn.calculateInvestmentReturn,
    buildSummaryItems: investmentReturn.buildInvestmentReturnSummary,
  },
  "simple-interest-calculator": {
    getFields: simpleInterest.getSimpleInterestFields,
    getDefaultState: simpleInterest.getSimpleInterestDefaultState,
    parseInputs: simpleInterest.parseSimpleInterestInputs,
    calculate: simpleInterest.calculateSimpleInterestTool,
    buildSummaryItems: simpleInterest.buildSimpleInterestSummary,
  },
  "future-value-calculator": {
    getFields: futureValue.getFutureValueFields,
    getDefaultState: futureValue.getFutureValueDefaultState,
    parseInputs: futureValue.parseFutureValueInputs,
    calculate: futureValue.calculateFutureValueTool,
    buildSummaryItems: futureValue.buildFutureValueSummary,
  },
  "cagr-calculator": {
    getFields: cagr.getCagrFields,
    getDefaultState: cagr.getCagrDefaultState,
    parseInputs: cagr.parseCagrInputs,
    calculate: cagr.calculateCagrTool,
    buildSummaryItems: cagr.buildCagrSummary,
  },
  "monthly-investment-calculator": {
    getFields: monthlyInvestment.getMonthlyInvestmentFields,
    getDefaultState: monthlyInvestment.getMonthlyInvestmentDefaultState,
    parseInputs: monthlyInvestment.parseMonthlyInvestmentInputs,
    calculate: monthlyInvestment.calculateMonthlyInvestment,
    buildSummaryItems: monthlyInvestment.buildMonthlyInvestmentSummary,
    buildChartData: monthlyInvestment.buildMonthlyInvestmentChart,
  },
  "lump-sum-investment-calculator": {
    getFields: lumpSumInvestment.getLumpSumInvestmentFields,
    getDefaultState: lumpSumInvestment.getLumpSumInvestmentDefaultState,
    parseInputs: lumpSumInvestment.parseLumpSumInvestmentInputs,
    calculate: lumpSumInvestment.calculateLumpSumInvestment,
    buildSummaryItems: lumpSumInvestment.buildLumpSumInvestmentSummary,
    buildChartData: lumpSumInvestment.buildLumpSumInvestmentChart,
  },
  "dollar-cost-averaging-calculator": {
    getFields: dollarCostAveraging.getDollarCostAveragingFields,
    getDefaultState: dollarCostAveraging.getDollarCostAveragingDefaultState,
    parseInputs: dollarCostAveraging.parseDollarCostAveragingInputs,
    calculate: dollarCostAveraging.calculateDollarCostAveraging,
    buildSummaryItems: dollarCostAveraging.buildDollarCostAveragingSummary,
    buildChartData: dollarCostAveraging.buildDollarCostAveragingChart,
  },
  "dividend-income-calculator": {
    getFields: dividendIncome.getDividendCalculatorFields,
    getDefaultState: dividendIncome.getDividendCalculatorDefaultState,
    parseInputs: dividendIncome.parseDividendIncomeInputs,
    calculate: dividendIncome.calculateDividendIncome,
    buildSummaryItems: dividendIncome.buildDividendSummary,
  },
  "dividend-reinvestment-calculator": {
    getFields: dividendReinvestment.getDividendReinvestmentFields,
    getDefaultState: dividendReinvestment.getDividendReinvestmentDefaultState,
    parseInputs: dividendReinvestment.parseDividendReinvestmentInputs,
    calculate: dividendReinvestment.calculateDividendReinvestment,
    buildSummaryItems: dividendReinvestment.buildDividendReinvestmentSummary,
    buildChartData: dividendReinvestment.buildDividendReinvestmentChart,
  },
  "passive-income-calculator": {
    getFields: passiveIncome.getPassiveIncomeFields,
    getDefaultState: passiveIncome.getPassiveIncomeDefaultState,
    parseInputs: passiveIncome.parsePassiveIncomeInputs,
    calculate: passiveIncome.calculatePassiveIncome,
    buildSummaryItems: passiveIncome.buildPassiveIncomeSummary,
  },
  "bond-yield-calculator": {
    getFields: bondYield.getBondYieldFields,
    getDefaultState: bondYield.getBondYieldDefaultState,
    parseInputs: bondYield.parseBondYieldInputs,
    calculate: bondYield.calculateBondYield,
    buildSummaryItems: bondYield.buildBondYieldSummary,
  },
  "etf-overlap-tool": {
    getFields: etfOverlap.getEtfOverlapFields,
    getDefaultState: etfOverlap.getEtfOverlapDefaultState,
    parseInputs: etfOverlap.parseEtfOverlapInputs,
    calculate: etfOverlap.calculateEtfOverlap,
    buildSummaryItems: etfOverlap.buildEtfOverlapSummary,
  },
  "portfolio-allocation-calculator": {
    getFields: portfolioAllocation.getPortfolioAllocationFields,
    getDefaultState: portfolioAllocation.getPortfolioAllocationDefaultState,
    parseInputs: portfolioAllocation.parsePortfolioAllocationInputs,
    calculate: portfolioAllocation.calculatePortfolioAllocation,
    buildSummaryItems: portfolioAllocation.buildPortfolioAllocationSummary,
    buildChartData: portfolioAllocation.buildPortfolioAllocationChart,
  },
  "stock-average-price-calculator": {
    getFields: stockAveragePrice.getStockAveragePriceFields,
    getDefaultState: stockAveragePrice.getStockAveragePriceDefaultState,
    parseInputs: stockAveragePrice.parseStockAveragePriceInputs,
    calculate: stockAveragePrice.calculateStockAveragePrice,
    buildSummaryItems: stockAveragePrice.buildStockAveragePriceSummary,
  },
  "stock-profit-calculator": {
    getFields: stockProfit.getStockProfitFields,
    getDefaultState: stockProfit.getStockProfitDefaultState,
    parseInputs: stockProfit.parseStockProfitInputs,
    calculate: stockProfit.calculateStockProfit,
    buildSummaryItems: stockProfit.buildStockProfitSummary,
  },
  "portfolio-rebalancing-calculator": {
    getFields: portfolioRebalancing.getPortfolioRebalancingFields,
    getDefaultState: portfolioRebalancing.getPortfolioRebalancingDefaultState,
    parseInputs: portfolioRebalancing.parsePortfolioRebalancingInputs,
    calculate: portfolioRebalancing.calculatePortfolioRebalancing,
    buildSummaryItems: portfolioRebalancing.buildPortfolioRebalancingSummary,
  },
  "investment-fee-calculator": {
    getFields: investmentFee.getInvestmentFeeFields,
    getDefaultState: investmentFee.getInvestmentFeeDefaultState,
    parseInputs: investmentFee.parseInvestmentFeeInputs,
    calculate: investmentFee.calculateInvestmentFee,
    buildSummaryItems: investmentFee.buildInvestmentFeeSummary,
    buildChartData: investmentFee.buildInvestmentFeeChart,
  },
  "etf-expense-calculator": {
    getFields: etfExpense.getEtfExpenseFields,
    getDefaultState: etfExpense.getEtfExpenseDefaultState,
    parseInputs: etfExpense.parseEtfExpenseInputs,
    calculate: etfExpense.calculateEtfExpense,
    buildSummaryItems: etfExpense.buildEtfExpenseSummary,
    buildChartData: etfExpense.buildEtfExpenseChart,
  },
  "risk-vs-return-calculator": {
    getFields: riskVsReturn.getRiskVsReturnFields,
    getDefaultState: riskVsReturn.getRiskVsReturnDefaultState,
    parseInputs: riskVsReturn.parseRiskVsReturnInputs,
    calculate: riskVsReturn.calculateRiskVsReturn,
    buildSummaryItems: riskVsReturn.buildRiskVsReturnSummary,
  },
  "retirement-fire-calculator": {
    getFields: retirementFire.getRetirementFireFields,
    getDefaultState: retirementFire.getRetirementFireDefaultState,
    parseInputs: retirementFire.parseRetirementFireInputs,
    calculate: retirementFire.calculateRetirementFire,
    buildSummaryItems: retirementFire.buildRetirementFireSummary,
    buildChartData: retirementFire.buildRetirementFireChart,
  },
  "withdrawal-rate-calculator": {
    getFields: withdrawalRate.getWithdrawalRateFields,
    getDefaultState: withdrawalRate.getWithdrawalRateDefaultState,
    parseInputs: withdrawalRate.parseWithdrawalRateInputs,
    calculate: withdrawalRate.calculateWithdrawalRate,
    buildSummaryItems: withdrawalRate.buildWithdrawalRateSummary,
  },
  "retirement-contribution-calculator": {
    getFields: retirementContribution.getRetirementContributionFields,
    getDefaultState: retirementContribution.getRetirementContributionDefaultState,
    parseInputs: retirementContribution.parseRetirementContributionInputs,
    calculate: retirementContribution.calculateRetirementContribution,
    buildSummaryItems: retirementContribution.buildRetirementContributionSummary,
    buildChartData: retirementContribution.buildRetirementContributionChart,
  },
  "financial-independence-calculator": {
    getFields: financialIndependence.getFinancialIndependenceFields,
    getDefaultState: financialIndependence.getFinancialIndependenceDefaultState,
    parseInputs: financialIndependence.parseFinancialIndependenceInputs,
    calculate: financialIndependence.calculateFinancialIndependence,
    buildSummaryItems: financialIndependence.buildFinancialIndependenceSummary,
  },
  "early-retirement-calculator": {
    getFields: earlyRetirement.getEarlyRetirementFields,
    getDefaultState: earlyRetirement.getEarlyRetirementDefaultState,
    parseInputs: earlyRetirement.parseEarlyRetirementInputs,
    calculate: earlyRetirement.calculateEarlyRetirement,
    buildSummaryItems: earlyRetirement.buildEarlyRetirementSummary,
    buildChartData: earlyRetirement.buildEarlyRetirementChart,
  },
  "loan-interest-calculator": {
    getFields: loanInterest.getLoanInterestFields,
    getDefaultState: loanInterest.getLoanInterestDefaultState,
    parseInputs: loanInterest.parseLoanInterestInputs,
    calculate: loanInterest.calculateLoanInterest,
    buildSummaryItems: loanInterest.buildLoanInterestSummary,
    buildChartData: loanInterest.buildLoanInterestChart,
  },
  "inflation-calculator": {
    getFields: inflation.getInflationFields,
    getDefaultState: inflation.getInflationDefaultState,
    parseInputs: inflation.parseInflationInputs,
    calculate: inflation.calculateInflation,
    buildSummaryItems: inflation.buildInflationSummary,
    buildChartData: inflation.buildInflationChart,
  },
  "savings-goal-calculator": {
    getFields: savingsGoal.getSavingsGoalFields,
    getDefaultState: savingsGoal.getSavingsGoalDefaultState,
    parseInputs: savingsGoal.parseSavingsGoalInputs,
    calculate: savingsGoal.calculateSavingsGoal,
    buildSummaryItems: savingsGoal.buildSavingsGoalSummary,
    buildChartData: savingsGoal.buildSavingsGoalChart,
  },
  "present-value-calculator": {
    getFields: presentValue.getPresentValueFields,
    getDefaultState: presentValue.getPresentValueDefaultState,
    parseInputs: presentValue.parsePresentValueInputs,
    calculate: presentValue.calculatePresentValueTool,
    buildSummaryItems: presentValue.buildPresentValueSummary,
  },
  "net-worth-calculator": {
    getFields: netWorth.getNetWorthFields,
    getDefaultState: netWorth.getNetWorthDefaultState,
    parseInputs: netWorth.parseNetWorthInputs,
    calculate: netWorth.calculateNetWorth,
    buildSummaryItems: netWorth.buildNetWorthSummary,
  },
  "emergency-fund-calculator": {
    getFields: emergencyFund.getEmergencyFundFields,
    getDefaultState: emergencyFund.getEmergencyFundDefaultState,
    parseInputs: emergencyFund.parseEmergencyFundInputs,
    calculate: emergencyFund.calculateEmergencyFund,
    buildSummaryItems: emergencyFund.buildEmergencyFundSummary,
  },
  "investment-time-calculator": {
    getFields: investmentTime.getInvestmentTimeFields,
    getDefaultState: investmentTime.getInvestmentTimeDefaultState,
    parseInputs: investmentTime.parseInvestmentTimeInputs,
    calculate: investmentTime.calculateInvestmentTime,
    buildSummaryItems: investmentTime.buildInvestmentTimeSummary,
    buildChartData: investmentTime.buildInvestmentTimeChart,
  },
  "interest-rate-calculator": {
    getFields: interestRate.getInterestRateFields,
    getDefaultState: interestRate.getInterestRateDefaultState,
    parseInputs: interestRate.parseInterestRateInputs,
    calculate: interestRate.calculateInterestRate,
    buildSummaryItems: interestRate.buildInterestRateSummary,
  },
  "investment-horizon-calculator": {
    getFields: investmentHorizon.getInvestmentHorizonFields,
    getDefaultState: investmentHorizon.getInvestmentHorizonDefaultState,
    parseInputs: investmentHorizon.parseInvestmentHorizonInputs,
    calculate: investmentHorizon.calculateInvestmentHorizon,
    buildSummaryItems: investmentHorizon.buildInvestmentHorizonSummary,
  },
};

const registeredTools: Array<ToolConfig & { definition: AnyToolDefinition }> = toolsConfig.map((tool) => {
  const definition = toolDefinitions[tool.slug];

  if (!definition) {
    throw new Error(`Missing tool definition for slug: ${tool.slug}`);
  }

  return {
    ...tool,
    definition,
  };
});

function localizeTool(
  tool: ToolConfig & { definition: AnyToolDefinition },
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
