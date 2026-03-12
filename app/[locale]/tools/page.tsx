import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ToolCard } from "@/components/tools/ToolCard";
import { getSiteDictionary } from "@/lib/copy";
import { isLocale, withLocale, type Locale } from "@/lib/i18n";
import { getAllTools } from "@/lib/tool-registry";

type LocalizedToolsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: LocalizedToolsPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getSiteDictionary(locale);

  return {
    title: dictionary.toolsPage.metadataTitle,
    description: dictionary.toolsPage.metadataDescription,
    alternates: {
      canonical: withLocale(locale, "/tools"),
      languages: {
        en: withLocale("en", "/tools"),
        zh: withLocale("zh", "/tools"),
      },
    },
    openGraph: {
      title: dictionary.toolsPage.metadataTitle,
      description: dictionary.toolsPage.metadataDescription,
      type: "website",
      url: withLocale(locale, "/tools"),
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.toolsPage.metadataTitle,
      description: dictionary.toolsPage.metadataDescription,
    },
  };
}

export default async function LocalizedToolsPage({
  params,
}: LocalizedToolsPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const resolvedLocale = locale as Locale;
  const dictionary = getSiteDictionary(resolvedLocale);
  const tools = getAllTools(resolvedLocale);

  return (
    <div className="content-shell pb-20 pt-4">
      <section className="card-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,148,136,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_40%)]" />
        <div className="relative max-w-4xl space-y-5">
          <p className="eyebrow">{dictionary.toolsPage.eyebrow}</p>
          <h1 className="text-5xl font-semibold tracking-[-0.055em] text-[var(--color-text)] sm:text-6xl">
            {dictionary.toolsPage.title}
          </h1>
          <p className="section-copy">{dictionary.toolsPage.description}</p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} locale={resolvedLocale} tool={tool} />
        ))}
      </section>
    </div>
  );
}
