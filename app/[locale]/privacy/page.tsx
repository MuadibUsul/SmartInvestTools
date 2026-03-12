import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InformationalPage } from "@/components/content/InformationalPage";
import { StructuredData } from "@/components/seo/StructuredData";
import { buildInformationalPageSchema, buildLocalizedMetadata } from "@/lib/seo";
import { isLocale, withLocale, type Locale } from "@/lib/i18n";
import { getInformationalPage } from "@/lib/site-pages";

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const content = getInformationalPage(locale, "privacy");

  return buildLocalizedMetadata({
    locale,
    path: "/privacy",
    title: content.seoTitle,
    description: content.seoDescription,
    type: "article",
  });
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const resolvedLocale = locale as Locale;
  const content = getInformationalPage(resolvedLocale, "privacy");

  return (
    <>
      <StructuredData
        data={buildInformationalPageSchema({
          locale: resolvedLocale,
          path: withLocale(resolvedLocale, "/privacy"),
          title: content.seoTitle,
          description: content.seoDescription,
        })}
      />
      <InformationalPage {...content} />
    </>
  );
}

