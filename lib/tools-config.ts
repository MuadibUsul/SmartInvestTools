import type { ToolConfig } from "@/lib/types";

export const toolsConfig: ToolConfig[] = [
  {
    slug: "compound-interest-calculator",
    title: "Compound Interest Calculator",
    shortDescription:
      "Estimate long-term investment growth with monthly contributions and annual compounding assumptions.",
    longDescription:
      "Use this compound interest calculator to estimate how your investment portfolio could grow over time with an initial deposit, recurring monthly contributions, and a projected annual return.",
    category: "Growth",
    tags: ["Compound interest", "Long-term investing", "Monthly investing"],
    hasChart: true,
    seo: {
      title: "Compound Interest Calculator – Investment Growth Tool",
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
    relatedTools: [
      "dividend-income-calculator",
      "portfolio-allocation-calculator",
      "retirement-fire-calculator",
    ],
  },
  {
    slug: "dividend-income-calculator",
    title: "Dividend Income Calculator",
    shortDescription:
      "Estimate annual and monthly dividend income from a portfolio based on a simple yield assumption.",
    longDescription:
      "Use this dividend income calculator to estimate how much annual and monthly cash flow your investment amount could generate at a given dividend yield.",
    category: "Income",
    tags: ["Dividends", "Cash flow", "Yield"],
    hasChart: false,
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
    relatedTools: [
      "compound-interest-calculator",
      "portfolio-allocation-calculator",
    ],
  },
  {
    slug: "etf-overlap-tool",
    title: "ETF Overlap Tool",
    shortDescription:
      "Compare two ETFs and estimate how much their underlying holdings overlap using placeholder data.",
    longDescription:
      "Use this ETF overlap tool to compare two ETFs, estimate the percentage of overlapping holdings, and review a placeholder list of top overlapping positions.",
    category: "Portfolio",
    tags: ["ETF research", "Overlap", "Diversification"],
    hasChart: false,
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
    relatedTools: [
      "portfolio-allocation-calculator",
      "compound-interest-calculator",
    ],
  },
  {
    slug: "portfolio-allocation-calculator",
    title: "Portfolio Allocation Calculator",
    shortDescription:
      "Break down your investment amount across a simple target asset allocation.",
    longDescription:
      "Use this portfolio allocation calculator to convert target allocation percentages into actual dollar amounts across core asset classes.",
    category: "Portfolio",
    tags: ["Allocation", "Asset mix", "Portfolio planning"],
    hasChart: true,
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
    relatedTools: [
      "etf-overlap-tool",
      "retirement-fire-calculator",
    ],
  },
  {
    slug: "retirement-fire-calculator",
    title: "Retirement (FIRE) Calculator",
    shortDescription:
      "Project retirement portfolio value and timeline using a simplified FIRE planning model.",
    longDescription:
      "Use this retirement calculator to estimate your future portfolio value and a potential retirement year based on your current savings, annual expenses, and expected return assumptions.",
    category: "Retirement",
    tags: ["FIRE", "Retirement", "Financial independence"],
    hasChart: true,
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
    relatedTools: [
      "compound-interest-calculator",
      "portfolio-allocation-calculator",
      "dividend-income-calculator",
    ],
  },
];
