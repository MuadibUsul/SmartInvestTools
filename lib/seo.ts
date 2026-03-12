import type { Metadata } from "next";

import { defaultLocale, withLocale, type Locale } from "@/lib/i18n";
import { getAbsoluteUrl, siteName } from "@/lib/site";
import type { LocalizedTool, ToolFaqItem } from "@/lib/types";

function normalizePath(path: string) {
  if (!path) {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

export function buildLocaleAlternates(path: string) {
  const normalizedPath = normalizePath(path);

  return {
    canonical: normalizedPath,
    languages: {
      en: withLocale("en", normalizedPath),
      zh: withLocale("zh", normalizedPath),
      "x-default": withLocale(defaultLocale, normalizedPath),
    },
  };
}

export function buildLocalizedMetadata({
  locale,
  path,
  title,
  description,
  type = "website",
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
}): Metadata {
  const normalizedPath = normalizePath(path);

  return {
    title,
    description,
    alternates: buildLocaleAlternates(normalizedPath),
    openGraph: {
      title,
      description,
      type,
      url: normalizedPath,
      siteName,
      locale: locale === "zh" ? "zh_CN" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildWebsiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: getAbsoluteUrl(withLocale(locale, "/")),
    inLanguage: locale === "zh" ? "zh-CN" : "en-US",
  };
}

export function buildCollectionPageSchema({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: getAbsoluteUrl(path),
    inLanguage: locale === "zh" ? "zh-CN" : "en-US",
  };
}

export function buildInformationalPageSchema({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: getAbsoluteUrl(path),
    inLanguage: locale === "zh" ? "zh-CN" : "en-US",
  };
}

export function buildFaqSchema(path: string, faq: ToolFaqItem[]) {
  if (faq.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: getAbsoluteUrl(path),
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildToolSchema({
  tool,
  locale,
}: {
  tool: LocalizedTool;
  locale: Locale;
}) {
  const path = withLocale(locale, `/tools/${tool.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: tool.longDescription,
    url: getAbsoluteUrl(path),
    inLanguage: locale === "zh" ? "zh-CN" : "en-US",
    keywords: tool.tags.join(", "),
  };
}

