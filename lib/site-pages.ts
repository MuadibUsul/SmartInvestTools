import type { Locale } from "@/lib/i18n";

export type InformationalPageKey = "about" | "privacy";

type InformationalSection = {
  heading: string;
  paragraphs: string[];
};

type InformationalPageContent = {
  eyebrow: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  sections: InformationalSection[];
};

const informationalPages: Record<
  Locale,
  Record<InformationalPageKey, InformationalPageContent>
> = {
  en: {
    about: {
      eyebrow: "About Smart Invest Tools",
      title: "Practical calculators for clearer financial decisions",
      description:
        "Smart Invest Tools is built to make everyday investing and planning questions easier to model, compare, and act on.",
      seoTitle: "About Smart Invest Tools",
      seoDescription:
        "Learn what Smart Invest Tools is, how the calculators are designed, and what this website currently does and does not provide.",
      sections: [
        {
          heading: "What this site is built for",
          paragraphs: [
            "Smart Invest Tools focuses on practical financial calculators that help retail investors estimate growth, compare tradeoffs, and think more clearly about long-term planning.",
            "The product is intentionally lightweight. Each tool is built to answer a real planning question quickly, without forcing you into a signup flow or a complicated dashboard.",
          ],
        },
        {
          heading: "How the calculators work",
          paragraphs: [
            "The current calculators run in the browser using local TypeScript logic. There is no account system, no database, and no backend portfolio syncing in the current version.",
            "That means the site is useful for scenario analysis and rough planning, but it should not be treated as personalized financial advice or a substitute for tax, legal, or fiduciary guidance.",
          ],
        },
        {
          heading: "How to use the results responsibly",
          paragraphs: [
            "Every output on this site depends on the assumptions you enter. Return rates, inflation, taxes, fees, and market behavior can all materially change real-world outcomes.",
            "Use the calculators as a decision-support layer: compare scenarios, pressure-test assumptions, and identify what inputs matter most before making capital allocation decisions.",
          ],
        },
      ],
    },
    privacy: {
      eyebrow: "Privacy",
      title: "A simple privacy approach for a calculator-first product",
      description:
        "Smart Invest Tools is currently designed as a lightweight front-end calculator site with minimal data handling.",
      seoTitle: "Privacy Policy | Smart Invest Tools",
      seoDescription:
        "Read the current privacy policy for Smart Invest Tools, including how the site handles local preferences and what data is not collected in the current version.",
      sections: [
        {
          heading: "What we store locally",
          paragraphs: [
            "The current site stores a small amount of local preference data in your browser, such as the selected light or dark theme.",
            "Calculator inputs are not tied to a user account because the current product does not provide account registration, saved dashboards, or synced portfolios.",
          ],
        },
        {
          heading: "What the current site does not do",
          paragraphs: [
            "Smart Invest Tools does not currently provide user profiles, portfolio imports, brokerage connections, or a customer database for calculator usage.",
            "The calculators run client-side, which means your scenario inputs stay in your browser session unless you choose to share them another way.",
          ],
        },
        {
          heading: "Operational analytics and future changes",
          paragraphs: [
            "If hosting, analytics, or product features change in the future, this policy should be updated to reflect any new forms of logging, monitoring, or stored data.",
            "If you deploy this project under your own domain or organization, review this page and adapt it to your actual hosting, analytics, and compliance requirements.",
          ],
        },
      ],
    },
  },
  zh: {
    about: {
      eyebrow: "关于智投工具",
      title: "帮助你更清晰做出理财判断的实用计算器",
      description:
        "智投工具的目标，是把常见的投资与理财问题变得更容易估算、比较和落地。",
      seoTitle: "关于智投工具",
      seoDescription:
        "了解智投工具的定位、这些计算器的使用方式，以及当前版本能做什么、不能做什么。",
      sections: [
        {
          heading: "这个站点解决什么问题",
          paragraphs: [
            "智投工具专注于实用型金融计算器，帮助普通投资者快速估算增长、比较取舍，并更清楚地理解长期规划中的关键变量。",
            "产品刻意保持轻量化。每个工具都围绕一个真实的理财问题展开，目标是让你在不登录、不搭建复杂面板的前提下迅速得到可参考的结果。",
          ],
        },
        {
          heading: "这些计算器是如何运行的",
          paragraphs: [
            "当前版本的计算逻辑主要在浏览器中通过本地 TypeScript 完成。站点没有账户系统、没有数据库，也没有后端同步投资组合的能力。",
            "这意味着它适合做情景推演和粗略规划，但不应被视为个性化投资建议，也不能替代税务、法律或受托顾问意见。",
          ],
        },
        {
          heading: "如何更稳妥地使用这些结果",
          paragraphs: [
            "站点中的每一项输出都依赖于你的输入假设。收益率、通胀、税费、费用和市场波动都可能显著改变真实结果。",
            "更合适的使用方式，是把这些计算器当作决策辅助层：比较情景、检验假设、找出最关键的变量，再结合你自己的资产情况做判断。",
          ],
        },
      ],
    },
    privacy: {
      eyebrow: "隐私政策",
      title: "面向计算器产品的简洁隐私说明",
      description:
        "智投工具当前是一个轻量级前端计算器站点，数据处理范围相对有限。",
      seoTitle: "隐私政策 | 智投工具",
      seoDescription:
        "查看智投工具当前的隐私说明，包括本地偏好设置的处理方式，以及当前版本未收集的数据范围。",
      sections: [
        {
          heading: "当前会在本地保存什么",
          paragraphs: [
            "当前站点会在浏览器本地保存少量偏好设置，例如浅色或深色主题选择。",
            "由于当前产品没有账户系统，也没有云端保存面板，所以计算器输入不会绑定到用户档案中。",
          ],
        },
        {
          heading: "当前版本不会做什么",
          paragraphs: [
            "智投工具目前没有用户注册、券商连接、投资组合导入，也没有用于保存计算历史的用户数据库。",
            "多数计算逻辑都在客户端执行，因此你的测算输入通常只存在于当前浏览器环境中，除非你主动以其他方式分享。",
          ],
        },
        {
          heading: "关于运行监控与未来更新",
          paragraphs: [
            "如果未来增加了分析统计、监控服务或新的产品功能，这份说明应当同步更新，以反映新的日志、存储或合规要求。",
            "如果你将本项目部署到自己的域名或组织环境中，也应根据实际的托管、分析与合规情况对本页内容进行调整。",
          ],
        },
      ],
    },
  },
};

export function getInformationalPage(
  locale: Locale,
  key: InformationalPageKey,
) {
  return informationalPages[locale][key];
}

