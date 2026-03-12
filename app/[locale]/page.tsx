import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StructuredData } from "@/components/seo/StructuredData";
import { ToolCard } from "@/components/tools/ToolCard";
import { getSiteDictionary } from "@/lib/copy";
import {
  buildLocalizedMetadata,
  buildWebsiteSchema,
} from "@/lib/seo";
import { isLocale, withLocale, type Locale } from "@/lib/i18n";
import { getAllTools, getToolBySlug } from "@/lib/tool-registry";
import { getToolCategoryGroups } from "@/lib/tool-grouping";

type LocalizedHomePageProps = {
  params: Promise<{ locale: string }>;
};

const featuredToolSlugs = [
  "compound-interest-calculator",
  "retirement-fire-calculator",
  "dividend-income-calculator",
  "savings-goal-calculator",
  "investment-return-calculator",
  "portfolio-allocation-calculator",
];

export async function generateMetadata({
  params,
}: LocalizedHomePageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getSiteDictionary(locale);

  return buildLocalizedMetadata({
    locale,
    path: "/",
    title: dictionary.metadata.defaultTitle,
    description: dictionary.metadata.defaultDescription,
  });
}

export default async function LocalizedHomePage({
  params,
}: LocalizedHomePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const resolvedLocale = locale as Locale;
  const dictionary = getSiteDictionary(resolvedLocale);
  const allTools = getAllTools(resolvedLocale);
  const featuredTools = [
    ...featuredToolSlugs
      .map((slug) => getToolBySlug(slug, resolvedLocale))
      .filter((tool) => tool !== undefined),
    ...allTools,
  ].filter(
    (tool, index, collection) =>
      collection.findIndex((item) => item.slug === tool.slug) === index,
  ).slice(0, 6);
  const categoryGroups = getToolCategoryGroups(resolvedLocale);

  return (
    <div className="content-shell pb-20 pt-4">
      <StructuredData data={buildWebsiteSchema(resolvedLocale)} />

      <section className="relative overflow-hidden rounded-[2.25rem] border border-white/60 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(13,148,136,0.9),rgba(245,158,11,0.76))] px-6 py-16 text-white shadow-[var(--shadow-soft)] sm:px-10 sm:py-18 lg:px-14 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.16),transparent_28%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-14">
          <div className="space-y-8">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.24em] text-white/80 uppercase">
              {dictionary.home.eyebrow}
            </span>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
                {dictionary.home.title}
              </h1>
              <p className="max-w-2xl text-xl leading-8 text-white/84 sm:text-2xl sm:leading-9">
                {dictionary.home.subtitle}
              </p>
              <p className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                {dictionary.home.description}
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link
                href={withLocale(resolvedLocale, "/tools")}
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition-transform duration-200 hover:-translate-y-0.5"
              >
                {dictionary.home.exploreAll}
              </Link>
              <Link
                href={withLocale(
                  resolvedLocale,
                  "/tools/compound-interest-calculator",
                )}
                className="inline-flex items-center justify-center rounded-full border border-white/24 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/18"
              >
                {dictionary.home.openCompoundTool}
              </Link>
            </div>
          </div>
          <div className="grid gap-4 rounded-[2rem] border border-white/16 bg-black/20 p-5 backdrop-blur sm:p-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/8 px-5 py-5">
              <p className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
                {dictionary.home.quickSnapshot}
              </p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-white/70">
                    {dictionary.home.toolsAvailable}
                  </p>
                  <strong className="mt-2 block text-4xl font-semibold tracking-[-0.05em]">
                    {allTools.length}
                  </strong>
                </div>
                <div className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-white/72 uppercase">
                  {dictionary.home.readyToUse}
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/8 px-5 py-5">
                <p className="text-xs font-semibold tracking-[0.18em] text-white/58 uppercase">
                  {dictionary.home.whatYouCanDo}
                </p>
                <p className="mt-3 text-xl font-medium">
                  {dictionary.home.planGoalsTitle}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/68">
                  {dictionary.home.planGoalsDescription}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/8 px-5 py-5">
                <p className="text-xs font-semibold tracking-[0.18em] text-white/58 uppercase">
                  {dictionary.home.experience}
                </p>
                <p className="mt-3 text-xl font-medium">
                  {dictionary.home.clearOnEveryScreenTitle}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/68">
                  {dictionary.home.clearOnEveryScreenDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <p className="eyebrow">{dictionary.home.libraryEyebrow}</p>
            <h2 className="section-title max-w-3xl">
              {dictionary.home.libraryTitle}
            </h2>
            <p className="section-copy">{dictionary.home.libraryDescription}</p>
          </div>
          <Link
            href={withLocale(resolvedLocale, "/tools")}
            className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[color:var(--color-surface-strong)] px-5 py-3 text-sm font-semibold text-[var(--color-text)] shadow-[var(--shadow-card)] transition-colors hover:text-[var(--color-accent)]"
          >
            {dictionary.home.viewAllTools}
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.slug} locale={resolvedLocale} tool={tool} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="card-surface">
          <p className="eyebrow">{dictionary.home.whyEyebrow}</p>
          <h2 className="mt-4 section-title max-w-3xl">
            {dictionary.home.whyTitle}
          </h2>
          <p className="mt-5 section-copy">{dictionary.home.whyDescription}</p>
        </article>
        <aside className="card-surface space-y-5">
          <p className="eyebrow">{dictionary.home.categoriesEyebrow}</p>
          <div className="flex flex-wrap gap-3">
            {categoryGroups.map((group) => (
              <Link
                key={group.id}
                href={`${withLocale(resolvedLocale, "/tools")}#${group.id}`}
                className="rounded-full border border-[var(--color-border)] bg-[color:var(--color-surface-strong)] px-4 py-2.5 text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
              >
                {group.label} ({group.tools.length})
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}

