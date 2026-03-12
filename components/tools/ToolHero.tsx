import Link from "next/link";

import { getSiteDictionary } from "@/lib/copy";
import { withLocale, type Locale } from "@/lib/i18n";
import { getToolBySlug } from "@/lib/tool-registry";
import type { LocalizedTool } from "@/lib/types";

type ToolHeroProps = {
  locale: Locale;
  tool: LocalizedTool;
};

export function ToolHero({ locale, tool }: ToolHeroProps) {
  const dictionary = getSiteDictionary(locale);
  const quickLinks = tool.relatedTools
    .slice(0, 2)
    .map((slug) => getToolBySlug(slug, locale))
    .filter((entry) => entry !== undefined);

  return (
    <header className="card-surface relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(13,148,136,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.1),transparent_28%)]" />
      <div className="relative max-w-5xl space-y-5 sm:space-y-6">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted)]"
        >
          <Link
            href={withLocale(locale, "/")}
            className="hover:text-[var(--color-accent)]"
          >
            {dictionary.header.home}
          </Link>
          <span>/</span>
          <Link
            href={withLocale(locale, "/tools")}
            className="hover:text-[var(--color-accent)]"
          >
            {dictionary.header.tools}
          </Link>
          <span>/</span>
          <span className="text-[var(--color-text)]">{tool.title}</span>
        </nav>
        <p className="eyebrow">{tool.category}</p>
        <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-[var(--color-text)] sm:text-6xl lg:text-7xl">
          {tool.title}
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-[var(--color-muted)] sm:text-xl sm:leading-9">
          {tool.longDescription}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={withLocale(locale, "/tools")}
            className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[color:var(--color-surface-strong)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)]"
          >
            {dictionary.header.browseTools}
          </Link>
          {quickLinks.map((entry) => (
            <Link
              key={entry.slug}
              href={withLocale(locale, `/tools/${entry.slug}`)}
              className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-accent)]"
            >
              {entry.title}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
