import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ToolPageClient } from "@/components/tools/ToolPageClient";
import { getSiteDictionary } from "@/lib/copy";
import { isLocale, locales, withLocale, type Locale } from "@/lib/i18n";
import { getAllToolSlugs, getToolBySlug } from "@/lib/tool-registry";

type LocalizedToolPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllToolSlugs().map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: LocalizedToolPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getSiteDictionary(locale);
  const tool = getToolBySlug(slug, locale);

  if (!tool) {
    return {
      title: dictionary.toolUi.toolNotFoundTitle,
      description: dictionary.toolUi.toolNotFoundDescription,
    };
  }

  const localizedPath = `/tools/${tool.slug}`;

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    alternates: {
      canonical: withLocale(locale, localizedPath),
      languages: {
        en: withLocale("en", localizedPath),
        zh: withLocale("zh", localizedPath),
      },
    },
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      type: "website",
      url: withLocale(locale, localizedPath),
    },
    twitter: {
      card: "summary_large_image",
      title: tool.seo.title,
      description: tool.seo.description,
    },
  };
}

export default async function LocalizedToolPage({
  params,
}: LocalizedToolPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const tool = getToolBySlug(slug, locale);

  if (!tool) {
    notFound();
  }

  return <ToolPageClient slug={slug} locale={locale as Locale} />;
}
