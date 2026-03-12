import type { ToolConfig } from "@/lib/types";

export const toolsConfig: ToolConfig[] = [
  {
    slug: "compound-interest-calculator",
    hasChart: true,
    relatedTools: [
      "dividend-income-calculator",
      "portfolio-allocation-calculator",
      "retirement-fire-calculator",
    ],
    locales: {
      en: {
        title: "Compound Interest Calculator",
        shortDescription:
          "Estimate long-term investment growth with monthly contributions and annual compounding assumptions.",
        longDescription:
          "Use this compound interest calculator to estimate how your investment portfolio could grow over time with an initial deposit, recurring monthly contributions, and a projected annual return.",
        category: "Growth",
        tags: ["Compound interest", "Long-term investing", "Monthly investing"],
        seo: {
          title: "Compound Interest Calculator | Investment Growth Tool",
          description:
            "Free compound interest calculator. Estimate how your investments grow with monthly contributions and visualize long-term returns.",
        },
        faq: [
          {
            question: "What is compound interest?",
            answer:
              "Compound interest is the process of earning returns on both your original investment and the growth already generated in earlier periods.",
          },
          {
            question: "Why compound interest matters for investing?",
            answer:
              "It matters because time and reinvested returns can significantly increase total portfolio growth, especially when you add regular contributions.",
          },
        ],
        educationContent: [
          {
            heading: "What is compound interest?",
            paragraphs: [
              "Compound interest is growth earned on your principal plus any gains that have already accumulated. Instead of returns only applying to your original deposit, each new period builds on a larger balance.",
              "This effect becomes more powerful across long investment timelines because gains from earlier years continue to generate gains in later years.",
            ],
          },
          {
            heading: "How compound interest works",
            paragraphs: [
              "In this calculator, your initial investment is combined with monthly contributions and a projected annual return. The tool applies the monthly rate repeatedly across the full investment period and tracks the balance at the end of each year.",
              "The result helps show how disciplined contributions and time in the market can matter more than trying to time short-term price movements.",
            ],
          },
        ],
      },
      zh: {
        title: "复利计算器",
        shortDescription:
          "根据初始资金、每月追加和年化收益假设，估算长期投资的增长结果。",
        longDescription:
          "使用这款复利计算器，结合初始投入、每月定投和预期年化收益，估算你的投资组合在未来可能增长到什么规模。",
        category: "增长",
        tags: ["复利", "长期投资", "每月定投"],
        seo: {
          title: "复利计算器 | 投资增长工具",
          description:
            "免费复利计算器。估算每月追加投入下的投资增长，并直观看到长期收益变化。",
        },
        faq: [
          {
            question: "什么是复利？",
            answer:
              "复利是指收益不仅来自原始本金，也来自之前已经累积出来的收益本身。",
          },
          {
            question: "为什么复利对投资很重要？",
            answer:
              "因为时间和收益再投资会显著放大总资产增长，尤其是在持续追加投入的情况下。",
          },
        ],
        educationContent: [
          {
            heading: "复利到底在放大什么",
            paragraphs: [
              "复利意味着收益建立在本金和历史收益之上，而不是只对最初投入生效。随着时间推进，每一期的计算基础都会变大。",
              "投资周期越长，这种效应越明显，因为早期积累的收益会在后续年份继续产生新的收益。",
            ],
          },
          {
            heading: "这款工具如何模拟复利",
            paragraphs: [
              "在这个计算器中，初始投入、每月追加金额和预期年化收益会一起参与计算。工具会将月收益率持续应用到整个投资周期，并记录每年末的资产余额。",
              "结果能帮助你看到，稳定投入和长期持有往往比短期择时更影响最终财富规模。",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "dividend-income-calculator",
    hasChart: false,
    relatedTools: [
      "compound-interest-calculator",
      "portfolio-allocation-calculator",
    ],
    locales: {
      en: {
        title: "Dividend Income Calculator",
        shortDescription:
          "Estimate annual and monthly dividend income from a portfolio based on a simple yield assumption.",
        longDescription:
          "Use this dividend income calculator to estimate how much annual and monthly cash flow your investment amount could generate at a given dividend yield.",
        category: "Income",
        tags: ["Dividends", "Cash flow", "Yield"],
        seo: {
          title: "Dividend Income Calculator",
          description:
            "Estimate annual and monthly dividend income from your portfolio using a simple dividend yield calculator.",
        },
        faq: [
          {
            question: "What is dividend yield?",
            answer:
              "Dividend yield is the annual dividend income paid by an investment relative to its price or invested amount.",
          },
          {
            question: "Does higher yield always mean better income investing?",
            answer:
              "Not always. Very high yields can signal elevated risk or unsustainable payouts, so income should be reviewed alongside business quality and dividend coverage.",
          },
        ],
        educationContent: [
          {
            heading: "Using dividend yield to estimate income",
            paragraphs: [
              "Dividend investing often focuses on balancing current income with long-term capital preservation. A dividend income calculator gives a quick first-pass estimate of expected cash flow from a target portfolio size.",
            ],
          },
        ],
      },
      zh: {
        title: "股息收入计算器",
        shortDescription:
          "基于简单的股息率假设，估算投资组合每年和每月可能带来的股息收入。",
        longDescription:
          "使用这款股息收入计算器，输入投资金额和股息率，快速估算年度与月度现金流。",
        category: "收入",
        tags: ["股息", "现金流", "收益率"],
        seo: {
          title: "股息收入计算器",
          description:
            "通过简单的股息率假设，估算你的投资组合每年和每月可以产生多少股息收入。",
        },
        faq: [
          {
            question: "什么是股息率？",
            answer:
              "股息率是投资标的每年派发的股息收入，相对于其价格或投入金额的比例。",
          },
          {
            question: "股息率越高就一定越好吗？",
            answer:
              "不一定。过高的股息率可能意味着风险上升或分红不可持续，收入投资还要结合企业质量和分红覆盖率一起看。",
          },
        ],
        educationContent: [
          {
            heading: "用股息率快速估算现金流",
            paragraphs: [
              "股息投资通常需要在当前收入和长期资本保值之间取得平衡。股息收入计算器可以帮助你先快速估算目标投资规模可能带来的现金流。",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "etf-overlap-tool",
    hasChart: false,
    relatedTools: [
      "portfolio-allocation-calculator",
      "compound-interest-calculator",
    ],
    locales: {
      en: {
        title: "ETF Overlap Tool",
        shortDescription:
          "Compare two ETFs and estimate how much their underlying holdings overlap using placeholder data.",
        longDescription:
          "Use this ETF overlap tool to compare two ETFs, estimate the percentage of overlapping holdings, and review a placeholder list of top overlapping positions.",
        category: "Portfolio",
        tags: ["ETF research", "Overlap", "Diversification"],
        seo: {
          title: "ETF Overlap Tool",
          description:
            "Compare two ETFs, estimate overlap, and inspect placeholder overlapping holdings data.",
        },
        faq: [
          {
            question: "Why does ETF overlap matter?",
            answer:
              "If two ETFs hold many of the same companies, your diversification may be lower than expected even if the fund names look different.",
          },
          {
            question: "Is the overlap data live?",
            answer:
              "No. This MVP uses local placeholder data to prove the page architecture and can be upgraded later with a live holdings data source.",
          },
        ],
        educationContent: [
          {
            heading: "How ETF overlap affects diversification",
            paragraphs: [
              "Owning multiple ETFs does not automatically mean your portfolio is broadly diversified. If the underlying holdings repeat across funds, your exposure may be more concentrated than you expect.",
            ],
          },
        ],
      },
      zh: {
        title: "ETF 重叠工具",
        shortDescription:
          "比较两只 ETF，并基于占位数据估算它们底层持仓的重叠程度。",
        longDescription:
          "使用这款 ETF 重叠工具，对比两只 ETF 的持仓重叠比例，并查看占位示例中的主要重叠仓位。",
        category: "组合",
        tags: ["ETF 研究", "重叠度", "分散化"],
        seo: {
          title: "ETF 重叠工具",
          description:
            "比较两只 ETF 的重叠程度，并查看占位示例中的重叠持仓数据。",
        },
        faq: [
          {
            question: "为什么 ETF 重叠度很重要？",
            answer:
              "如果两只 ETF 持有大量相同公司，即使基金名称不同，你的组合分散度也可能低于预期。",
          },
          {
            question: "这里的重叠数据是实时的吗？",
            answer:
              "不是。当前 MVP 使用本地占位数据来验证页面结构，后续可以接入实时持仓数据源。",
          },
        ],
        educationContent: [
          {
            heading: "ETF 重叠如何影响分散化",
            paragraphs: [
              "持有多只 ETF 并不自动代表组合足够分散。如果不同基金底层持仓重复，你的风险暴露可能比想象中更集中。",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "portfolio-allocation-calculator",
    hasChart: true,
    relatedTools: [
      "etf-overlap-tool",
      "retirement-fire-calculator",
    ],
    locales: {
      en: {
        title: "Portfolio Allocation Calculator",
        shortDescription:
          "Break down your investment amount across a simple target asset allocation.",
        longDescription:
          "Use this portfolio allocation calculator to convert target allocation percentages into actual dollar amounts across core asset classes.",
        category: "Portfolio",
        tags: ["Allocation", "Asset mix", "Portfolio planning"],
        seo: {
          title: "Portfolio Allocation Calculator",
          description:
            "Calculate a portfolio allocation breakdown by asset class and visualize how your capital is distributed.",
        },
        faq: [
          {
            question: "Why is asset allocation important?",
            answer:
              "Asset allocation helps determine the balance between expected return, volatility, and liquidity in your portfolio.",
          },
          {
            question: "Should the percentages total 100%?",
            answer:
              "In most cases yes. If the total is above or below 100%, the calculator will still show the implied breakdown so you can adjust your assumptions.",
          },
        ],
        educationContent: [
          {
            heading: "Turning target percentages into portfolio actions",
            paragraphs: [
              "A target allocation is easier to execute when you can translate percentages into real dollar amounts. This tool shows that breakdown directly, which can help with contributions or rebalancing decisions.",
            ],
          },
        ],
      },
      zh: {
        title: "资产配置计算器",
        shortDescription:
          "把投资金额按目标资产配置比例拆分成更直观的金额结构。",
        longDescription:
          "使用这款资产配置计算器，将目标配置比例换算为股票、债券、房地产和现金等核心资产类别上的实际金额。",
        category: "组合",
        tags: ["配置", "资产组合", "组合规划"],
        seo: {
          title: "资产配置计算器",
          description:
            "按资产类别计算投资组合的配置结果，并直观看到资金如何分布。",
        },
        faq: [
          {
            question: "为什么资产配置很重要？",
            answer:
              "资产配置决定了组合在预期收益、波动性和流动性之间的大致平衡。",
          },
          {
            question: "配置比例一定要加总到 100% 吗？",
            answer:
              "多数情况下是这样。如果总和高于或低于 100%，工具仍会展示对应结果，帮助你检查和修正假设。",
          },
        ],
        educationContent: [
          {
            heading: "把目标比例变成可执行金额",
            paragraphs: [
              "当你能把百分比直接换算成真实金额时，目标配置更容易落地。这款工具会直接展示金额拆分结果，方便你做追加投入或再平衡决策。",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "retirement-fire-calculator",
    hasChart: true,
    relatedTools: [
      "compound-interest-calculator",
      "portfolio-allocation-calculator",
      "dividend-income-calculator",
    ],
    locales: {
      en: {
        title: "Retirement (FIRE) Calculator",
        shortDescription:
          "Project retirement portfolio value and timeline using a simplified FIRE planning model.",
        longDescription:
          "Use this retirement calculator to estimate your future portfolio value and a potential retirement year based on your current savings, annual expenses, and expected return assumptions.",
        category: "Retirement",
        tags: ["FIRE", "Retirement", "Financial independence"],
        seo: {
          title: "Retirement FIRE Calculator",
          description:
            "Estimate retirement portfolio value and retirement year with a simplified FIRE calculator.",
        },
        faq: [
          {
            question: "What does FIRE mean?",
            answer:
              "FIRE stands for Financial Independence, Retire Early. It describes a strategy of saving and investing enough capital to cover future living costs earlier than a traditional retirement timeline.",
          },
          {
            question: "Is this a full retirement planning model?",
            answer:
              "No. This MVP intentionally uses a simplified growth model without taxes, inflation, or dynamic spending assumptions.",
          },
        ],
        educationContent: [
          {
            heading: "Using a simplified FIRE model",
            paragraphs: [
              "A FIRE calculator can help frame the relationship between current assets, future returns, and the time available before retirement. Even a simple version can reveal whether your current savings trajectory is directionally on track.",
            ],
          },
        ],
      },
      zh: {
        title: "退休 FIRE 计算器",
        shortDescription:
          "基于简化版 FIRE 模型，推算退休时的资产规模和可能的退休时间。",
        longDescription:
          "使用这款退休计算器，根据当前储蓄、年度支出和预期收益，估算未来资产规模以及可能实现退休的年份。",
        category: "退休",
        tags: ["FIRE", "退休", "财务自由"],
        seo: {
          title: "退休 FIRE 计算器",
          description:
            "通过简化版 FIRE 模型，估算退休资产规模和可能的退休年份。",
        },
        faq: [
          {
            question: "FIRE 是什么意思？",
            answer:
              "FIRE 是 Financial Independence, Retire Early 的缩写，表示通过储蓄和投资尽早实现财务独立、覆盖未来生活成本的策略。",
          },
          {
            question: "这是不是完整的退休规划模型？",
            answer:
              "不是。当前 MVP 采用的是简化增长模型，没有纳入税收、通胀或动态支出等复杂因素。",
          },
        ],
        educationContent: [
          {
            heading: "如何看待简化版 FIRE 模型",
            paragraphs: [
              "FIRE 计算器能帮助你把当前资产、未来收益和可用时间联系起来。即使是简化模型，也能让你判断当前储蓄路径大致是否朝着目标前进。",
            ],
          },
        ],
      },
    },
  },
];
