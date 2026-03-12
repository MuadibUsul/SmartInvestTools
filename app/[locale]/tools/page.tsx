import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StructuredData } from "@/components/seo/StructuredData";
import { ToolCard } from "@/components/tools/ToolCard";
import { getSiteDictionary } from "@/lib/copy";
import {
  buildCollectionPageSchema,
  buildLocalizedMetadata,
} from "@/lib/seo";
import { isLocale, withLocale, type Locale } from "@/lib/i18n";
import { getToolCategoryGroups } from "@/lib/tool-grouping";

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

  return buildLocalizedMetadata({
    locale,
    path: "/tools",
    title: dictionary.toolsPage.metadataTitle,
    description: dictionary.toolsPage.metadataDescription,
  });
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
  const categoryGroups = getToolCategoryGroups(resolvedLocale);

  return (
    <div className="content-shell pb-20 pt-4">
      <StructuredData
        data={buildCollectionPageSchema({
          locale: resolvedLocale,
          path: withLocale(resolvedLocale, "/tools"),
          title: dictionary.toolsPage.metadataTitle,
          description: dictionary.toolsPage.metadataDescription,
        })}
      />

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

      <section className="card-surface space-y-6">
        <div className="space-y-3">
          <p className="eyebrow">{dictionary.home.categoriesEyebrow}</p>
          <p className="section-copy">
            {dictionary.toolsPage.metadataDescription}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {categoryGroups.map((group) => (
            <Link
              key={group.id}
              href={`#${group.id}`}
              className="rounded-full border border-[var(--color-border)] bg-[color:var(--color-surface-strong)] px-4 py-2.5 text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              {group.label} ({group.tools.length})
            </Link>
          ))}
        </div>
      </section>

      <div className="space-y-10">
        {categoryGroups.map((group) => (
          <section
            key={group.id}
            id={group.id}
            className="scroll-mt-28 space-y-6"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <p className="eyebrow">{group.label}</p>
                <h2 className="section-title">{group.label}</h2>
              </div>
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                {resolvedLocale === "zh"
                  ? `${group.tools.length} 个计算器`
                  : `${group.tools.length} calculators`}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {group.tools.map((tool) => (
                <ToolCard key={tool.slug} locale={resolvedLocale} tool={tool} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
