import type { Locale } from "@/lib/i18n";

export type SiteDictionary = {
  siteName: string;
  metadata: {
    defaultTitle: string;
    defaultDescription: string;
    openGraphDescription: string;
  };
  header: {
    brandTop: string;
    brandBottom: string;
    mobileBrand: string;
    home: string;
    tools: string;
    featuredTool: string;
    browseTools: string;
  };
  footer: {
    description: string;
    navigation: string;
    popularTools: string;
    home: string;
    allTools: string;
    about: string;
    privacy: string;
  };
  home: {
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    exploreAll: string;
    openCompoundTool: string;
    quickSnapshot: string;
    toolsAvailable: string;
    readyToUse: string;
    whatYouCanDo: string;
    planGoalsTitle: string;
    planGoalsDescription: string;
    experience: string;
    clearOnEveryScreenTitle: string;
    clearOnEveryScreenDescription: string;
    libraryEyebrow: string;
    libraryTitle: string;
    libraryDescription: string;
    viewAllTools: string;
    whyEyebrow: string;
    whyTitle: string;
    whyDescription: string;
    categoriesEyebrow: string;
    categories: string[];
  };
  toolsPage: {
    title: string;
    description: string;
    eyebrow: string;
    metadataTitle: string;
    metadataDescription: string;
  };
  toolUi: {
    inputsTitle: string;
    inputsDescription: string;
    resultsTitle: string;
    resultsDescription: string;
    faqTitle: string;
    faqDescription: string;
    educationTitle: string;
    educationDescription: string;
    relatedTitle: string;
    relatedDescription: string;
    interactiveChart: string;
    exploreCalculatorDetails: string;
    openTool: string;
    toolNotFoundTitle: string;
    toolNotFoundDescription: string;
  };
  themeToggle: {
    lightMode: string;
    darkMode: string;
    switchTo: string;
  };
  localeSwitcher: {
    ariaLabel: string;
  };
};

export const siteCopy: Record<Locale, SiteDictionary> = {
  en: {
    siteName: "Smart Invest Tools",
    metadata: {
      defaultTitle:
        "Smart Invest Tools | Free Investing Calculators and Financial Planning Tools",
      defaultDescription:
        "Smart Invest Tools offers practical calculators for growth, dividends, portfolio planning, debt, retirement, and financial independence.",
      openGraphDescription:
        "Free financial calculators for investing, retirement, portfolio planning, and long-term wealth decisions.",
    },
    header: {
      brandTop: "Smart Invest",
      brandBottom: "Investment tools",
      mobileBrand: "Smart Invest Tools",
      home: "Home",
      tools: "Tools",
      featuredTool: "Featured Tool",
      browseTools: "Browse tools",
    },
    footer: {
      description:
        "A modular fintech website for investment calculators, planning workflows, and clear educational finance content.",
      navigation: "Navigation",
      popularTools: "Popular tools",
      home: "Home",
      allTools: "All tools",
      about: "About",
      privacy: "Privacy",
    },
    home: {
      eyebrow: "Smart Invest Tools",
      title: "Smart Invest Tools",
      subtitle: "Free Investing Calculators and Financial Planning Tools",
      description:
        "Model growth, compare strategies, estimate retirement scenarios, and plan cash flow with practical calculators built for everyday financial decisions.",
      exploreAll: "Explore all tools",
      openCompoundTool: "Open compound calculator",
      quickSnapshot: "Quick snapshot",
      toolsAvailable: "Tools available",
      readyToUse: "Ready to use",
      whatYouCanDo: "What you can do",
      planGoalsTitle: "Plan goals with clarity",
      planGoalsDescription:
        "Estimate growth, income, debt costs, and portfolio outcomes in seconds.",
      experience: "Experience",
      clearOnEveryScreenTitle: "Clear on every screen",
      clearOnEveryScreenDescription:
        "Fast, readable tools built for desktop and mobile use.",
      libraryEyebrow: "Featured calculators",
      libraryTitle: "Start with the calculators investors use most often",
      libraryDescription:
        "Explore a curated set of high-utility tools, then move into the full calculator library when you want to compare more scenarios.",
      viewAllTools: "View all tools",
      whyEyebrow: "Why investors use it",
      whyTitle: "Practical tools for long-term planning",
      whyDescription:
        "Smart Invest Tools helps you compare scenarios, understand tradeoffs, and make more confident investing decisions with clear, modular calculators.",
      categoriesEyebrow: "Categories",
      categories: [
        "Growth",
        "Income",
        "Portfolio",
        "Retirement",
        "Debt",
        "Planning",
      ],
    },
    toolsPage: {
      title: "Financial calculators for smarter investing decisions",
      description:
        "Explore the full Smart Invest Tools library, from compound growth and passive income to debt payoff, valuation, and retirement planning.",
      eyebrow: "Tool directory",
      metadataTitle:
        "Investment Calculators and Financial Planning Tools | Smart Invest Tools",
      metadataDescription:
        "Browse financial calculators for compounding, dividends, ETF costs, rebalancing, debt, retirement, financial independence, and more.",
    },
    toolUi: {
      inputsTitle: "Inputs",
      inputsDescription:
        "Adjust the assumptions to update the results instantly.",
      resultsTitle: "Results",
      resultsDescription:
        "These metrics update as your assumptions change.",
      faqTitle: "Frequently asked questions",
      faqDescription: "Quick answers to common questions about this tool.",
      educationTitle: "How this tool helps",
      educationDescription:
        "Educational context to support clearer financial decisions.",
      relatedTitle: "Explore more tools",
      relatedDescription:
        "Continue into related calculators and financial planning workflows.",
      interactiveChart: "Interactive chart",
      exploreCalculatorDetails: "Explore calculator details",
      openTool: "Open tool",
      toolNotFoundTitle: "Tool Not Found | Smart Invest Tools",
      toolNotFoundDescription:
        "The requested financial tool could not be found.",
    },
    themeToggle: {
      lightMode: "Light mode",
      darkMode: "Dark mode",
      switchTo: "Switch to",
    },
    localeSwitcher: {
      ariaLabel: "Switch language",
    },
  },
  zh: {
    siteName: "智投工具",
    metadata: {
      defaultTitle: "智投工具 | 免费投资计算器与理财规划工具",
      defaultDescription:
        "智投工具提供增长、股息、资产配置、负债、退休与财务自由等实用金融计算器。",
      openGraphDescription:
        "免费金融计算器，覆盖投资增长、退休规划、资产配置、收益测算与长期理财决策。",
    },
    header: {
      brandTop: "智投",
      brandBottom: "投资工具",
      mobileBrand: "智投工具",
      home: "首页",
      tools: "工具",
      featuredTool: "精选工具",
      browseTools: "浏览工具",
    },
    footer: {
      description:
        "一个模块化的金融工具站点，提供投资计算、理财规划流程与清晰易读的金融教育内容。",
      navigation: "导航",
      popularTools: "热门工具",
      home: "首页",
      allTools: "全部工具",
      about: "关于我们",
      privacy: "隐私政策",
    },
    home: {
      eyebrow: "智投工具",
      title: "智投工具",
      subtitle: "免费投资计算器与理财规划工具",
      description:
        "用实用计算器估算增长、比较策略、规划退休与现金流，让日常投资和理财决策更有依据。",
      exploreAll: "查看全部工具",
      openCompoundTool: "打开复利计算器",
      quickSnapshot: "快速概览",
      toolsAvailable: "工具数量",
      readyToUse: "即开即用",
      whatYouCanDo: "你可以做什么",
      planGoalsTitle: "更清晰地规划财务目标",
      planGoalsDescription:
        "几秒内估算增长、收入、负债成本与资产配置结果。",
      experience: "使用体验",
      clearOnEveryScreenTitle: "大小屏幕都清晰",
      clearOnEveryScreenDescription:
        "界面响应迅速、信息易读，兼顾桌面端与移动端。",
      libraryEyebrow: "精选计算器",
      libraryTitle: "先从最常用的投资计算器开始",
      libraryDescription:
        "先浏览一组高频工具，再进入完整工具库继续比较更多情景与决策方案。",
      viewAllTools: "查看全部工具",
      whyEyebrow: "为什么投资者会使用它",
      whyTitle: "服务长期规划的实用工具",
      whyDescription:
        "智投工具帮助你比较方案、看清取舍，并通过清晰的模块化计算器更有把握地做出理财决策。",
      categoriesEyebrow: "分类",
      categories: ["增长", "收入", "组合", "退休", "负债", "规划"],
    },
    toolsPage: {
      title: "帮助你做出更聪明理财决策的金融计算器",
      description:
        "浏览智投工具的完整工具库，覆盖复利增长、被动收入、债务成本、估值测算、退休规划与财务自由。",
      eyebrow: "工具目录",
      metadataTitle: "投资计算器与理财规划工具 | 智投工具",
      metadataDescription:
        "浏览复利、股息、ETF 成本、资产再平衡、贷款、退休、财务自由等多种金融计算器。",
    },
    toolUi: {
      inputsTitle: "输入项",
      inputsDescription: "调整参数后，结果会立即更新。",
      resultsTitle: "结果",
      resultsDescription: "这些指标会随着你的参数变化实时更新。",
      faqTitle: "常见问题",
      faqDescription: "快速了解这款工具最常见的问题与答案。",
      educationTitle: "这款工具如何帮助你",
      educationDescription: "补充必要的背景知识，帮助你做出更清晰的金融判断。",
      relatedTitle: "继续探索更多工具",
      relatedDescription: "查看相关计算器与理财规划流程，继续深入。",
      interactiveChart: "交互图表",
      exploreCalculatorDetails: "查看计算器详情",
      openTool: "打开工具",
      toolNotFoundTitle: "未找到工具 | 智投工具",
      toolNotFoundDescription: "未能找到你请求的金融工具页面。",
    },
    themeToggle: {
      lightMode: "浅色模式",
      darkMode: "深色模式",
      switchTo: "切换到",
    },
    localeSwitcher: {
      ariaLabel: "切换语言",
    },
  },
};

export function getSiteDictionary(locale: Locale) {
  return siteCopy[locale];
}

