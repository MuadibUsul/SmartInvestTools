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
      defaultTitle: "Smart Invest Tools | Free Investing Calculators and Portfolio Tools",
      defaultDescription:
        "Smart Invest Tools offers modern calculators for compound growth, dividends, ETF overlap, portfolio allocation, and retirement planning.",
      openGraphDescription:
        "Free investing calculators and portfolio tools with a scalable architecture.",
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
        "A modular fintech website for investment calculators, portfolio planning, and educational financial tools.",
      navigation: "Navigation",
      popularTools: "Popular tools",
      home: "Home",
      allTools: "All Tools",
    },
    home: {
      eyebrow: "Smart Invest Tools",
      title: "Smart Invest Tools",
      subtitle: "Free Investing Calculators and Portfolio Tools",
      description:
        "Model long-term wealth, compare portfolio choices, and explore retirement scenarios with practical calculators designed for everyday investing decisions.",
      exploreAll: "Explore all tools",
      openCompoundTool: "Open compound calculator",
      quickSnapshot: "Quick snapshot",
      toolsAvailable: "Tools available",
      readyToUse: "Ready to use",
      whatYouCanDo: "What you can do",
      planGoalsTitle: "Plan goals with clarity",
      planGoalsDescription:
        "Estimate growth, income, and allocation outcomes in seconds.",
      experience: "Experience",
      clearOnEveryScreenTitle: "Clear on every screen",
      clearOnEveryScreenDescription:
        "Fast, readable tools built for desktop and mobile use.",
      libraryEyebrow: "Tool library",
      libraryTitle:
        "Build better investing decisions with focused calculators",
      libraryDescription:
        "Explore calculators built to make complex investing questions feel simpler, more visual, and easier to act on.",
      viewAllTools: "View all tools",
      whyEyebrow: "Why investors use it",
      whyTitle: "Practical tools for long-term planning",
      whyDescription:
        "Smart Invest Tools helps you compare scenarios, understand tradeoffs, and make more confident investing decisions with clean, easy-to-read calculators.",
      categoriesEyebrow: "Categories",
      categories: ["Growth", "Income", "Portfolio", "Retirement"],
    },
    toolsPage: {
      title: "Financial calculators for smarter investing decisions",
      description:
        "Explore the full Smart Invest Tools library, from portfolio growth projections to dividend income estimates and retirement planning.",
      eyebrow: "Tool directory",
      metadataTitle:
        "Investment Calculators and Portfolio Tools | Smart Invest Tools",
      metadataDescription:
        "Browse all Smart Invest Tools calculators, including compound interest, dividends, ETF overlap, portfolio allocation, and FIRE planning.",
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
        "Continue into related calculators and portfolio planning workflows.",
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
      defaultTitle: "智投工具 | 免费投资计算器与资产配置工具",
      defaultDescription:
        "智投工具提供复利、股息、ETF 重叠、资产配置与退休规划等现代投资计算器。",
      openGraphDescription: "免费投资计算器与投资组合工具，结构清晰，使用直接。",
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
        "一个模块化的金融工具站点，提供投资计算、资产配置规划与金融教育内容。",
      navigation: "导航",
      popularTools: "热门工具",
      home: "首页",
      allTools: "全部工具",
    },
    home: {
      eyebrow: "智投工具",
      title: "智投工具",
      subtitle: "免费投资计算器与资产配置工具",
      description:
        "用实用计算器建模长期财富增长、比较不同投资组合，并推演退休情景，让日常投资决策更有依据。",
      exploreAll: "查看全部工具",
      openCompoundTool: "打开复利计算器",
      quickSnapshot: "快速概览",
      toolsAvailable: "工具数量",
      readyToUse: "即开即用",
      whatYouCanDo: "你可以做什么",
      planGoalsTitle: "更清晰地规划目标",
      planGoalsDescription:
        "几秒钟内估算增长、现金流和资产配置结果。",
      experience: "使用体验",
      clearOnEveryScreenTitle: "大小屏幕都清晰",
      clearOnEveryScreenDescription:
        "工具响应迅速、信息易读，兼顾桌面端与移动端。",
      libraryEyebrow: "工具库",
      libraryTitle: "用更聚焦的计算器做出更好的投资决策",
      libraryDescription:
        "浏览一组把复杂投资问题做得更直观、更易理解、更容易执行的工具。",
      viewAllTools: "查看全部工具",
      whyEyebrow: "为什么投资者会使用它",
      whyTitle: "面向长期规划的实用工具",
      whyDescription:
        "智投工具帮助你比较方案、看清取舍，并通过清晰易读的计算器更有把握地做出投资决策。",
      categoriesEyebrow: "分类",
      categories: ["增长", "收入", "组合", "退休"],
    },
    toolsPage: {
      title: "帮助你做出更聪明投资决策的金融计算器",
      description:
        "查看智投工具的完整工具库，涵盖资产增长预测、股息收入估算与退休规划。",
      eyebrow: "工具目录",
      metadataTitle: "投资计算器与资产配置工具 | 智投工具",
      metadataDescription:
        "浏览智投工具的全部计算器，包括复利、股息、ETF 重叠、资产配置与 FIRE 规划。",
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
      relatedDescription: "查看相关计算器与投资组合规划流程，继续深入。",
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
