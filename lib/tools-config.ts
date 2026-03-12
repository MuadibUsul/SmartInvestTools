import type { Locale } from "@/lib/i18n";
import type { EducationSection, ToolConfig, ToolFaqItem } from "@/lib/types";

type CategoryKey =
  | "growth"
  | "income"
  | "portfolio"
  | "retirement"
  | "debt"
  | "planning";

type ToolLocaleSeed = {
  title: string;
  shortDescription: string;
  focus: string;
  assumptions: string;
  tags: string[];
};

type ToolSeed = {
  slug: string;
  hasChart: boolean;
  category: CategoryKey;
  relatedTools: string[];
  locales: Record<Locale, ToolLocaleSeed>;
};

const categoryLabels: Record<CategoryKey, Record<Locale, string>> = {
  growth: { en: "Growth", zh: "增长" },
  income: { en: "Income", zh: "收入" },
  portfolio: { en: "Portfolio", zh: "组合" },
  retirement: { en: "Retirement", zh: "退休" },
  debt: { en: "Debt", zh: "债务" },
  planning: { en: "Planning", zh: "规划" },
};

function buildLongDescription(locale: Locale, seed: ToolLocaleSeed) {
  if (locale === "zh") {
    return `${seed.shortDescription}。它可以帮助你围绕${seed.assumptions}快速评估${seed.focus}。`;
  }

  return `${seed.shortDescription}. It helps you model ${seed.focus} while testing assumptions around ${seed.assumptions}.`;
}

function buildFaq(locale: Locale, seed: ToolLocaleSeed): ToolFaqItem[] {
  if (locale === "zh") {
    return [
      {
        question: `这款${seed.title}主要估算什么？`,
        answer: `它用于估算${seed.focus}，并基于${seed.assumptions}来生成结果。`,
      },
      {
        question: "使用结果前最该检查什么？",
        answer:
          `重点检查${seed.assumptions}。这些输入的微小变化，都可能明显改变最终结果。`,
      },
    ];
  }

  return [
    {
      question: `What does the ${seed.title} estimate?`,
      answer: `It estimates ${seed.focus} using assumptions around ${seed.assumptions}.`,
    },
    {
      question: "What should I review before using the result?",
      answer:
        `Focus on ${seed.assumptions}. Small changes in those assumptions can materially change the outcome.`,
    },
  ];
}

function buildEducation(locale: Locale, seed: ToolLocaleSeed): EducationSection[] {
  if (locale === "zh") {
    return [
      {
        heading: "这款工具能帮你看什么",
        paragraphs: [
          `这款工具聚焦于${seed.focus}，适合在做情景比较时快速看到不同输入假设带来的变化。`,
          "由于计算逻辑直接运行在浏览器中，你可以连续调整参数，并立即观察结果如何变化。",
        ],
      },
      {
        heading: "哪些假设最值得反复校验",
        paragraphs: [
          `请优先检查${seed.assumptions}，因为这些变量通常最能影响输出结果。`,
          "把结果当作规划参考更合适，真正做决策时还应结合税费、通胀、现金流约束和个人风险承受能力一起判断。",
        ],
      },
    ];
  }

  return [
    {
      heading: "What this calculator helps you model",
      paragraphs: [
        `This tool focuses on ${seed.focus} and gives you a fast way to compare realistic scenarios inside the existing calculator workflow.`,
        "Because the logic runs in the browser, you can adjust inputs freely and immediately see how the result changes.",
      ],
    },
    {
      heading: "Assumptions worth reviewing carefully",
      paragraphs: [
        `Pay close attention to ${seed.assumptions}, because those inputs usually drive the result the most.`,
        "Use the output as a planning reference, then pressure-test it against fees, taxes, inflation, and real-world constraints when relevant.",
      ],
    },
  ];
}

function buildLocaleContent(
  locale: Locale,
  category: CategoryKey,
  seed: ToolLocaleSeed,
) {
  return {
    title: seed.title,
    shortDescription: seed.shortDescription,
    longDescription: buildLongDescription(locale, seed),
    category: categoryLabels[category][locale],
    tags: seed.tags,
    seo: {
      title:
        locale === "zh"
          ? `${seed.title} | 智投工具`
          : `${seed.title} | Smart Invest Tools`,
      description:
        locale === "zh"
          ? `围绕${seed.assumptions}估算${seed.focus}，快速比较不同输入假设。`
          : `Estimate ${seed.focus} with inputs for ${seed.assumptions}. Compare practical scenarios quickly.`,
    },
    faq: buildFaq(locale, seed),
    educationContent: buildEducation(locale, seed),
  };
}

const toolSeeds: ToolSeed[] = [
  {
    slug: "compound-interest-calculator",
    hasChart: true,
    category: "growth",
    relatedTools: ["rule-of-72-calculator", "future-value-calculator", "monthly-investment-calculator"],
    locales: {
      en: { title: "Compound Interest Calculator", shortDescription: "Project portfolio growth with an initial amount, monthly contributions, and an annual return assumption", focus: "long-term portfolio growth and total compounding gains", assumptions: "the starting balance, monthly contribution, annual return, and time horizon", tags: ["Compound interest", "Investment growth", "Monthly contributions"] },
      zh: { title: "复利计算器", shortDescription: "根据初始资金、每月投入和年化收益率估算投资增长", focus: "长期资产增长和复利带来的累计收益", assumptions: "初始本金、每月投入、年化收益率和投资年限", tags: ["复利", "投资增长", "每月投入"] },
    },
  },
  {
    slug: "rule-of-72-calculator",
    hasChart: false,
    category: "growth",
    relatedTools: ["compound-interest-calculator", "cagr-calculator", "future-value-calculator"],
    locales: {
      en: { title: "Rule of 72 Calculator", shortDescription: "Estimate how many years it may take for money to double at a given annual return", focus: "the doubling timeline for an investment", assumptions: "the annual return rate and the simplified Rule of 72 shortcut", tags: ["Rule of 72", "Doubling time", "Compounding"] },
      zh: { title: "72 法则计算器", shortDescription: "根据年化收益率估算资金翻倍大约需要多久", focus: "投资资金翻倍所需的大致时间", assumptions: "年化收益率和 72 法则的近似前提", tags: ["72 法则", "翻倍时间", "复利"] },
    },
  },
  {
    slug: "investment-return-calculator",
    hasChart: false,
    category: "growth",
    relatedTools: ["cagr-calculator", "stock-profit-calculator", "compound-interest-calculator"],
    locales: {
      en: { title: "Investment Return Calculator", shortDescription: "Measure total gain, loss, and return percentage from an investment with contributions", focus: "overall investment performance and return rate", assumptions: "starting value, ending value, and total contributions added", tags: ["Investment return", "Gain", "Performance"] },
      zh: { title: "投资回报计算器", shortDescription: "计算包含追加投入时的总收益、亏损和回报率", focus: "整体投资表现和收益率", assumptions: "初始价值、期末价值和期间累计投入", tags: ["投资回报", "收益", "表现"] },
    },
  },
  {
    slug: "simple-interest-calculator",
    hasChart: false,
    category: "growth",
    relatedTools: ["loan-interest-calculator", "future-value-calculator", "present-value-calculator"],
    locales: {
      en: { title: "Simple Interest Calculator", shortDescription: "Estimate interest earned when returns are calculated only on the original principal", focus: "interest earned under a simple interest model", assumptions: "principal, annual rate, and time without compounding", tags: ["Simple interest", "Interest earned", "Principal"] },
      zh: { title: "单利计算器", shortDescription: "估算只按原始本金计息时的利息收入", focus: "单利模型下的利息收入", assumptions: "本金、年利率和不复利的持有年限", tags: ["单利", "利息收入", "本金"] },
    },
  },
  {
    slug: "future-value-calculator",
    hasChart: false,
    category: "growth",
    relatedTools: ["compound-interest-calculator", "lump-sum-investment-calculator", "present-value-calculator"],
    locales: {
      en: { title: "Future Value Calculator", shortDescription: "Estimate how much a current amount could grow to over time at a chosen annual rate", focus: "the future value of money under compound growth", assumptions: "the current amount, annual rate, and investment horizon", tags: ["Future value", "Compounding", "Time value"] },
      zh: { title: "终值计算器", shortDescription: "按设定年化收益率和时间估算当前金额未来会增长到多少", focus: "复利增长下的资金终值", assumptions: "当前金额、年化收益率和持有期限", tags: ["终值", "复利", "时间价值"] },
    },
  },
  {
    slug: "cagr-calculator",
    hasChart: false,
    category: "growth",
    relatedTools: ["investment-return-calculator", "compound-interest-calculator", "interest-rate-calculator"],
    locales: {
      en: { title: "CAGR Calculator", shortDescription: "Calculate the compound annual growth rate between a beginning value and an ending value", focus: "the annualized growth rate of an investment or business metric", assumptions: "the beginning value, ending value, and number of years", tags: ["CAGR", "Annualized return", "Growth rate"] },
      zh: { title: "CAGR 计算器", shortDescription: "根据起始值、终值和年数计算复合年增长率", focus: "投资或指标的年化增长率", assumptions: "起始值、终值和持有年数", tags: ["CAGR", "年化收益率", "增长率"] },
    },
  },
  {
    slug: "monthly-investment-calculator",
    hasChart: true,
    category: "growth",
    relatedTools: ["savings-goal-calculator", "dollar-cost-averaging-calculator", "compound-interest-calculator"],
    locales: {
      en: { title: "Monthly Investment Calculator", shortDescription: "Estimate the monthly investment required to reach a target portfolio value over time", focus: "the monthly contribution needed to hit a portfolio target", assumptions: "the target amount, time horizon, and expected annual return", tags: ["Monthly investing", "Target amount", "Contribution planning"] },
      zh: { title: "每月投资计算器", shortDescription: "估算在给定期限内达到目标资产所需的每月投入", focus: "达到目标资产所需的每月定投金额", assumptions: "目标金额、投资年限和预期年化收益率", tags: ["每月投资", "目标金额", "投入规划"] },
    },
  },
  {
    slug: "lump-sum-investment-calculator",
    hasChart: true,
    category: "growth",
    relatedTools: ["compound-interest-calculator", "future-value-calculator", "investment-return-calculator"],
    locales: {
      en: { title: "Lump Sum Investment Calculator", shortDescription: "Project the future value of a one-time investment using an annual return assumption", focus: "the growth path of a single upfront investment", assumptions: "the one-time investment amount, annual return, and years invested", tags: ["Lump sum", "Future value", "One-time investment"] },
      zh: { title: "一次性投资计算器", shortDescription: "按年化收益率假设估算一次性投入的未来价值", focus: "一笔初始投入的增长路径", assumptions: "一次性投资金额、年化收益率和持有年限", tags: ["一次性投资", "终值", "单笔投入"] },
    },
  },
  {
    slug: "dollar-cost-averaging-calculator",
    hasChart: true,
    category: "growth",
    relatedTools: ["compound-interest-calculator", "monthly-investment-calculator", "lump-sum-investment-calculator"],
    locales: {
      en: { title: "Dollar Cost Averaging Calculator", shortDescription: "Project portfolio growth from recurring monthly investments over a chosen timeline", focus: "the outcome of a recurring dollar-cost averaging plan", assumptions: "monthly contribution size, annual return, and years invested", tags: ["Dollar-cost averaging", "Recurring investing", "Monthly contributions"] },
      zh: { title: "定投计算器", shortDescription: "估算按月定投在一段时间后的资产增长结果", focus: "定投计划下的资产累积结果", assumptions: "每月投入金额、年化收益率和投资年限", tags: ["定投", "持续投资", "每月投入"] },
    },
  },

  {
    slug: "dividend-income-calculator",
    hasChart: false,
    category: "income",
    relatedTools: ["passive-income-calculator", "dividend-reinvestment-calculator", "bond-yield-calculator"],
    locales: {
      en: { title: "Dividend Income Calculator", shortDescription: "Estimate annual and monthly dividend income from a portfolio using a yield assumption", focus: "portfolio income generated from dividends", assumptions: "investment size and the dividend yield used for the estimate", tags: ["Dividend income", "Yield", "Cash flow"] },
      zh: { title: "股息收入计算器", shortDescription: "根据投资金额和收益率假设估算年度与月度股息收入", focus: "投资组合带来的股息现金流", assumptions: "投资金额和用于测算的股息率", tags: ["股息收入", "收益率", "现金流"] },
    },
  },
  {
    slug: "dividend-reinvestment-calculator",
    hasChart: true,
    category: "income",
    relatedTools: ["dividend-income-calculator", "compound-interest-calculator", "passive-income-calculator"],
    locales: {
      en: { title: "Dividend Reinvestment Calculator", shortDescription: "Project portfolio growth when dividends are reinvested alongside price appreciation", focus: "portfolio value growth from reinvested dividends", assumptions: "starting capital, dividend yield, price growth, and holding period", tags: ["Dividend reinvestment", "Income growth", "Compounding"] },
      zh: { title: "股息再投资计算器", shortDescription: "估算把股息持续再投入后带来的组合增长", focus: "股息再投资带来的资产增长", assumptions: "初始资金、股息率、价格增长率和持有年限", tags: ["股息再投资", "收入增长", "复利"] },
    },
  },
  {
    slug: "passive-income-calculator",
    hasChart: false,
    category: "income",
    relatedTools: ["dividend-income-calculator", "financial-independence-calculator", "retirement-fire-calculator"],
    locales: {
      en: { title: "Passive Income Calculator", shortDescription: "Estimate the capital required to generate a target monthly passive income stream", focus: "the capital needed to support a target passive income level", assumptions: "target monthly income and the yield available on your capital", tags: ["Passive income", "Yield target", "Capital required"] },
      zh: { title: "被动收入计算器", shortDescription: "估算实现目标月度被动收入需要准备多少资本", focus: "支撑目标被动收入所需的资本规模", assumptions: "目标月收入和资本可获得的收益率", tags: ["被动收入", "收益目标", "所需资本"] },
    },
  },
  {
    slug: "bond-yield-calculator",
    hasChart: false,
    category: "income",
    relatedTools: ["passive-income-calculator", "dividend-income-calculator", "etf-expense-calculator"],
    locales: {
      en: { title: "Bond Yield Calculator", shortDescription: "Estimate current bond yield using face value, coupon rate, and market price", focus: "the current income yield of a bond position", assumptions: "face value, coupon rate, and the bond price paid", tags: ["Bond yield", "Coupon income", "Fixed income"] },
      zh: { title: "债券收益率计算器", shortDescription: "根据面值、票息和买入价格估算债券当前收益率", focus: "债券持仓的当前收益率", assumptions: "债券面值、票面利率和实际买入价格", tags: ["债券收益率", "票息收入", "固定收益"] },
    },
  },

  {
    slug: "etf-overlap-tool",
    hasChart: false,
    category: "portfolio",
    relatedTools: ["portfolio-allocation-calculator", "portfolio-rebalancing-calculator", "etf-expense-calculator"],
    locales: {
      en: { title: "ETF Overlap Tool", shortDescription: "Compare two ETFs and estimate how much their holdings overlap", focus: "concentration risk created by overlapping fund holdings", assumptions: "the placeholder ETF holdings data and the selected pair of funds", tags: ["ETF overlap", "Diversification", "Fund research"] },
      zh: { title: "ETF 重叠工具", shortDescription: "比较两只 ETF 的底层持仓重叠程度", focus: "基金持仓重叠带来的集中度风险", assumptions: "占位 ETF 持仓数据和你选择的两只基金", tags: ["ETF 重叠", "分散化", "基金研究"] },
    },
  },
  {
    slug: "portfolio-allocation-calculator",
    hasChart: true,
    category: "portfolio",
    relatedTools: ["etf-overlap-tool", "portfolio-rebalancing-calculator", "risk-vs-return-calculator"],
    locales: {
      en: { title: "Portfolio Allocation Calculator", shortDescription: "Convert target asset allocation percentages into real portfolio amounts", focus: "how capital is distributed across asset classes", assumptions: "portfolio size and the allocation percentages entered for each asset bucket", tags: ["Asset allocation", "Portfolio mix", "Capital breakdown"] },
      zh: { title: "资产配置计算器", shortDescription: "把目标配置比例换算成各类资产的实际金额", focus: "资金在不同资产类别之间的分布情况", assumptions: "组合总规模和各资产桶的配置比例", tags: ["资产配置", "组合结构", "资金拆分"] },
    },
  },
  {
    slug: "stock-average-price-calculator",
    hasChart: false,
    category: "portfolio",
    relatedTools: ["stock-profit-calculator", "investment-return-calculator", "portfolio-allocation-calculator"],
    locales: {
      en: { title: "Stock Average Price Calculator", shortDescription: "Calculate the weighted average purchase price across multiple stock buy lots", focus: "your blended cost basis across several share purchases", assumptions: "shares bought and the purchase price of each lot", tags: ["Average price", "Cost basis", "Share lots"] },
      zh: { title: "股票均价计算器", shortDescription: "计算多次买入后股票持仓的加权平均成本", focus: "多批买入后的综合持仓成本", assumptions: "每一批买入股数和对应成交价格", tags: ["均价", "持仓成本", "买入批次"] },
    },
  },
  {
    slug: "stock-profit-calculator",
    hasChart: false,
    category: "portfolio",
    relatedTools: ["stock-average-price-calculator", "investment-return-calculator", "cagr-calculator"],
    locales: {
      en: { title: "Stock Profit Calculator", shortDescription: "Estimate gross profit, net profit, and return percentage from a stock trade", focus: "profit and return on a stock trade after fees", assumptions: "buy price, sell price, position size, and optional trading fees", tags: ["Stock profit", "Trade return", "Net gain"] },
      zh: { title: "股票盈亏计算器", shortDescription: "估算一笔股票交易的毛利润、净利润和回报率", focus: "扣除费用后的股票交易收益", assumptions: "买入价、卖出价、股数和可选交易费用", tags: ["股票盈亏", "交易回报", "净收益"] },
    },
  },
  {
    slug: "portfolio-rebalancing-calculator",
    hasChart: false,
    category: "portfolio",
    relatedTools: ["portfolio-allocation-calculator", "risk-vs-return-calculator", "etf-overlap-tool"],
    locales: {
      en: { title: "Portfolio Rebalancing Calculator", shortDescription: "Estimate how much to buy or sell to move a portfolio back toward target weights", focus: "the buy and sell actions required to rebalance a portfolio", assumptions: "portfolio size plus the current and target asset weights", tags: ["Rebalancing", "Target weights", "Portfolio management"] },
      zh: { title: "组合再平衡计算器", shortDescription: "估算把组合拉回目标配置时各资产需要买卖多少", focus: "实现再平衡所需的买卖动作", assumptions: "组合总规模以及当前和目标资产权重", tags: ["再平衡", "目标权重", "组合管理"] },
    },
  },
  {
    slug: "investment-fee-calculator",
    hasChart: true,
    category: "portfolio",
    relatedTools: ["etf-expense-calculator", "compound-interest-calculator", "retirement-fire-calculator"],
    locales: {
      en: { title: "Investment Fee Calculator", shortDescription: "Estimate how annual portfolio fees can reduce long-term ending value", focus: "the long-term drag created by ongoing investment fees", assumptions: "portfolio size, annual fee rate, expected return, and holding period", tags: ["Investment fees", "Fee drag", "Ending value"] },
      zh: { title: "投资费用计算器", shortDescription: "估算年度管理费对长期资产终值的影响", focus: "持续收取投资费用带来的长期拖累", assumptions: "组合规模、年度费率、预期收益和持有年限", tags: ["投资费用", "费用拖累", "终值"] },
    },
  },
  {
    slug: "etf-expense-calculator",
    hasChart: true,
    category: "portfolio",
    relatedTools: ["investment-fee-calculator", "etf-overlap-tool", "portfolio-allocation-calculator"],
    locales: {
      en: { title: "ETF Expense Calculator", shortDescription: "Estimate the long-term cost of an ETF expense ratio on an investment position", focus: "the cumulative cost of ETF expenses over time", assumptions: "investment size, expense ratio, expected return, and holding period", tags: ["ETF expenses", "Expense ratio", "Fee impact"] },
      zh: { title: "ETF 费率计算器", shortDescription: "估算 ETF 费率对持仓长期收益的影响", focus: "ETF 费率带来的长期成本", assumptions: "投资金额、费率、预期收益和持有年限", tags: ["ETF 费率", "费用率", "成本影响"] },
    },
  },
  {
    slug: "risk-vs-return-calculator",
    hasChart: false,
    category: "portfolio",
    relatedTools: ["portfolio-allocation-calculator", "investment-horizon-calculator", "portfolio-rebalancing-calculator"],
    locales: {
      en: { title: "Risk vs Return Calculator", shortDescription: "Compare expected return with a simple risk score to frame an investment profile", focus: "the balance between potential return and the risk taken to pursue it", assumptions: "expected return and the volatility or risk score you assign", tags: ["Risk and return", "Volatility", "Portfolio profile"] },
      zh: { title: "风险收益计算器", shortDescription: "结合预期收益和风险评分来判断投资画像", focus: "潜在收益与承担风险之间的平衡", assumptions: "预期收益率以及你输入的波动或风险评分", tags: ["风险收益", "波动性", "投资画像"] },
    },
  },

  {
    slug: "retirement-fire-calculator",
    hasChart: true,
    category: "retirement",
    relatedTools: ["retirement-contribution-calculator", "financial-independence-calculator", "early-retirement-calculator"],
    locales: {
      en: { title: "Retirement FIRE Calculator", shortDescription: "Project a retirement portfolio value and timeline using a simplified FIRE model", focus: "when your assets may be enough to support a FIRE-style retirement", assumptions: "current savings, annual expenses, expected return, and years until retirement", tags: ["FIRE", "Retirement", "Financial independence"] },
      zh: { title: "退休 FIRE 计算器", shortDescription: "使用简化 FIRE 模型估算退休资产规模和时间线", focus: "你何时可能达到支持 FIRE 退休的资产水平", assumptions: "当前储蓄、年度支出、预期收益率和退休前剩余年数", tags: ["FIRE", "退休", "财务独立"] },
    },
  },
  {
    slug: "withdrawal-rate-calculator",
    hasChart: false,
    category: "retirement",
    relatedTools: ["financial-independence-calculator", "retirement-fire-calculator", "passive-income-calculator"],
    locales: {
      en: { title: "Withdrawal Rate Calculator", shortDescription: "Measure how much of a portfolio is withdrawn each year based on annual spending", focus: "the withdrawal rate implied by your portfolio and spending plan", assumptions: "portfolio size and the annual withdrawal amount", tags: ["Withdrawal rate", "Retirement spending", "Portfolio drawdown"] },
      zh: { title: "提取率计算器", shortDescription: "根据投资组合规模和年度支出计算资金提取率", focus: "组合与支出计划对应的提取率", assumptions: "资产规模和每年需要提取的金额", tags: ["提取率", "退休支出", "资金消耗"] },
    },
  },
  {
    slug: "retirement-contribution-calculator",
    hasChart: true,
    category: "retirement",
    relatedTools: ["retirement-fire-calculator", "early-retirement-calculator", "monthly-investment-calculator"],
    locales: {
      en: { title: "Retirement Contribution Calculator", shortDescription: "Estimate the monthly contribution needed to reach a target retirement balance", focus: "the monthly savings pace required for a retirement target", assumptions: "current savings, target retirement amount, expected return, and years remaining", tags: ["Retirement contributions", "Monthly savings", "Retirement target"] },
      zh: { title: "退休投入计算器", shortDescription: "估算达到退休目标资产所需的每月投入金额", focus: "实现退休目标所需的储蓄速度", assumptions: "当前储蓄、退休目标金额、预期收益率和剩余年数", tags: ["退休投入", "每月储蓄", "退休目标"] },
    },
  },
  {
    slug: "financial-independence-calculator",
    hasChart: false,
    category: "retirement",
    relatedTools: ["retirement-fire-calculator", "withdrawal-rate-calculator", "passive-income-calculator"],
    locales: {
      en: { title: "Financial Independence Calculator", shortDescription: "Estimate the FI number required to support annual spending at a chosen withdrawal rate", focus: "the portfolio size required for financial independence", assumptions: "annual expenses and the safe withdrawal rate you plan to use", tags: ["Financial independence", "FI number", "Safe withdrawal rate"] },
      zh: { title: "财务独立计算器", shortDescription: "根据年度支出和提取率估算实现财务独立所需资产", focus: "实现财务独立所需的资产规模", assumptions: "年度支出和你采用的安全提取率", tags: ["财务独立", "FI 数字", "安全提取率"] },
    },
  },
  {
    slug: "early-retirement-calculator",
    hasChart: true,
    category: "retirement",
    relatedTools: ["retirement-fire-calculator", "retirement-contribution-calculator", "financial-independence-calculator"],
    locales: {
      en: { title: "Early Retirement Calculator", shortDescription: "Estimate a retirement age and year based on savings, spending, return, and yearly contributions", focus: "the timeline to reach an early retirement target", assumptions: "current age, current savings, annual expenses, yearly contributions, and expected return", tags: ["Early retirement", "FIRE timeline", "Retirement age"] },
      zh: { title: "提前退休计算器", shortDescription: "根据年龄、储蓄、支出和投入估算提前退休年龄与年份", focus: "达到提前退休目标所需的时间线", assumptions: "当前年龄、储蓄、年度支出、每年投入和预期收益率", tags: ["提前退休", "FIRE 时间线", "退休年龄"] },
    },
  },

  {
    slug: "loan-interest-calculator",
    hasChart: true,
    category: "debt",
    relatedTools: ["simple-interest-calculator", "emergency-fund-calculator", "net-worth-calculator"],
    locales: {
      en: { title: "Loan Interest Calculator", shortDescription: "Estimate monthly payment, total repayment, and total interest on an amortizing loan", focus: "the repayment cost and interest burden of a loan", assumptions: "loan principal, annual interest rate, and repayment period", tags: ["Loan payment", "Total interest", "Debt cost"] },
      zh: { title: "贷款利息计算器", shortDescription: "估算等额还款贷款的月供、总还款和总利息", focus: "一笔贷款的还款成本和利息负担", assumptions: "贷款本金、年利率和还款年限", tags: ["贷款月供", "总利息", "债务成本"] },
    },
  },

  {
    slug: "inflation-calculator",
    hasChart: true,
    category: "planning",
    relatedTools: ["savings-goal-calculator", "future-value-calculator", "present-value-calculator"],
    locales: {
      en: { title: "Inflation Calculator", shortDescription: "Estimate how inflation changes future costs and the purchasing power of today’s money", focus: "future cost levels and lost purchasing power", assumptions: "current amount, inflation rate, and the number of years", tags: ["Inflation", "Purchasing power", "Future cost"] },
      zh: { title: "通胀计算器", shortDescription: "估算通胀对未来成本和当前购买力的影响", focus: "未来成本水平和购买力缩水", assumptions: "当前金额、通胀率和年数", tags: ["通胀", "购买力", "未来成本"] },
    },
  },
  {
    slug: "savings-goal-calculator",
    hasChart: true,
    category: "planning",
    relatedTools: ["monthly-investment-calculator", "investment-time-calculator", "compound-interest-calculator"],
    locales: {
      en: { title: "Savings Goal Calculator", shortDescription: "Estimate how long it may take to reach a savings target with contributions and investment growth", focus: "the timeline required to reach a target savings balance", assumptions: "target amount, current savings, monthly savings, and expected return", tags: ["Savings goal", "Target timeline", "Contribution planning"] },
      zh: { title: "储蓄目标计算器", shortDescription: "估算在持续投入和增长下达到储蓄目标需要多久", focus: "达到目标储蓄规模所需的时间", assumptions: "目标金额、当前储蓄、每月储蓄和预期收益率", tags: ["储蓄目标", "目标时间", "投入规划"] },
    },
  },
  {
    slug: "present-value-calculator",
    hasChart: false,
    category: "planning",
    relatedTools: ["future-value-calculator", "interest-rate-calculator", "inflation-calculator"],
    locales: {
      en: { title: "Present Value Calculator", shortDescription: "Discount a future amount back to today’s value using an annual discount rate", focus: "what a future amount is worth in present terms", assumptions: "future value, discount rate, and the number of years", tags: ["Present value", "Discounting", "Time value of money"] },
      zh: { title: "现值计算器", shortDescription: "按折现率把未来金额换算成今天的价值", focus: "未来金额对应的当前价值", assumptions: "未来金额、折现率和持有年数", tags: ["现值", "折现", "资金时间价值"] },
    },
  },
  {
    slug: "net-worth-calculator",
    hasChart: false,
    category: "planning",
    relatedTools: ["emergency-fund-calculator", "financial-independence-calculator", "investment-horizon-calculator"],
    locales: {
      en: { title: "Net Worth Calculator", shortDescription: "Measure total assets, total liabilities, and net worth using a simple balance sheet view", focus: "your net worth after subtracting liabilities from assets", assumptions: "the assets and liabilities entered across the selected buckets", tags: ["Net worth", "Assets", "Liabilities"] },
      zh: { title: "净资产计算器", shortDescription: "通过简单资产负债表视角计算总资产、总负债和净资产", focus: "扣除负债后的个人净资产", assumptions: "你输入的各项资产和负债金额", tags: ["净资产", "资产", "负债"] },
    },
  },
  {
    slug: "emergency-fund-calculator",
    hasChart: false,
    category: "planning",
    relatedTools: ["net-worth-calculator", "savings-goal-calculator", "passive-income-calculator"],
    locales: {
      en: { title: "Emergency Fund Calculator", shortDescription: "Estimate how much cash reserve you may want based on monthly expenses and coverage months", focus: "the emergency cash reserve size that matches your spending needs", assumptions: "monthly expenses and the number of months of coverage you want", tags: ["Emergency fund", "Cash reserve", "Financial buffer"] },
      zh: { title: "应急资金计算器", shortDescription: "根据月支出和覆盖月数估算应准备多少现金储备", focus: "匹配支出需求的应急现金规模", assumptions: "每月支出和希望覆盖的月数", tags: ["应急资金", "现金储备", "安全垫"] },
    },
  },
  {
    slug: "investment-time-calculator",
    hasChart: true,
    category: "planning",
    relatedTools: ["savings-goal-calculator", "monthly-investment-calculator", "compound-interest-calculator"],
    locales: {
      en: { title: "Investment Time Calculator", shortDescription: "Estimate how long it may take an investment plan to reach a target amount", focus: "the time needed for a portfolio to hit a target value", assumptions: "starting amount, target amount, monthly contribution, and expected return", tags: ["Time to target", "Investment horizon", "Goal planning"] },
      zh: { title: "投资时间计算器", shortDescription: "估算一套投资计划达到目标金额大约需要多久", focus: "组合达到目标价值所需的时间", assumptions: "初始金额、目标金额、每月投入和预期收益率", tags: ["达到目标时间", "投资期限", "目标规划"] },
    },
  },
  {
    slug: "interest-rate-calculator",
    hasChart: false,
    category: "planning",
    relatedTools: ["cagr-calculator", "future-value-calculator", "present-value-calculator"],
    locales: {
      en: { title: "Interest Rate Calculator", shortDescription: "Estimate the implied annual rate needed to grow one amount into another over time", focus: "the annual rate implied by present value, future value, and years", assumptions: "starting amount, ending amount, and the time available", tags: ["Interest rate", "Implied return", "Growth assumptions"] },
      zh: { title: "利率计算器", shortDescription: "根据起始值、终值和年数反推所需年化利率", focus: "由现值、终值和年数隐含出的年化收益率", assumptions: "起始金额、终值和可用年数", tags: ["利率", "隐含收益率", "增长假设"] },
    },
  },
  {
    slug: "investment-horizon-calculator",
    hasChart: false,
    category: "planning",
    relatedTools: ["risk-vs-return-calculator", "portfolio-allocation-calculator", "net-worth-calculator"],
    locales: {
      en: { title: "Investment Horizon Calculator", shortDescription: "Frame a simple investment horizon recommendation based on goal, time frame, and risk preference", focus: "how time horizon and risk preference shape a high-level investment posture", assumptions: "your goal, time horizon, and stated risk preference", tags: ["Investment horizon", "Risk preference", "Planning"] },
      zh: { title: "投资期限计算器", shortDescription: "根据目标、期限和风险偏好给出简单的投资期限建议", focus: "投资期限与风险偏好对应的高层配置思路", assumptions: "你的目标、时间跨度和风险偏好", tags: ["投资期限", "风险偏好", "规划"] },
    },
  },
];

export const toolsConfig: ToolConfig[] = toolSeeds.map((tool) => ({
  slug: tool.slug,
  hasChart: tool.hasChart,
  relatedTools: tool.relatedTools,
  locales: {
    en: buildLocaleContent("en", tool.category, tool.locales.en),
    zh: buildLocaleContent("zh", tool.category, tool.locales.zh),
  },
}));
