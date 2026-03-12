import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StructuredData } from "@/components/seo/StructuredData";
import { ToolPageClient } from "@/components/tools/ToolPageClient";
import { getSiteDictionary } from "@/lib/copy";
import {
  buildFaqSchema,
  buildLocalizedMetadata,
  buildToolSchema,
} from "@/lib/seo";
import { isLocale, locales, type Locale } from "@/lib/i18n";
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
    return buildLocalizedMetadata({
      locale,
      path: `/tools/${slug}`,
      title: dictionary.toolUi.toolNotFoundTitle,
      description: dictionary.toolUi.toolNotFoundDescription,
    });
  }

  return buildLocalizedMetadata({
    locale,
    path: `/tools/${tool.slug}`,
    title: tool.seo.title,
    description: tool.seo.description,
  });
}

export default async function LocalizedToolPage({
  params,
}: LocalizedToolPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const resolvedLocale = locale as Locale;
  const tool = getToolBySlug(slug, resolvedLocale);

  if (!tool) {
    notFound();
  }

  const faqSchema = buildFaqSchema(
    `/${resolvedLocale}/tools/${tool.slug}`,
    tool.faq,
  );

  return (
    <>
      <StructuredData
        data={[
          buildToolSchema({ tool, locale: resolvedLocale }),
          ...(faqSchema ? [faqSchema] : []),
        ]}
      />
      <ToolPageClient slug={slug} locale={resolvedLocale} />
    </>
  );
}

