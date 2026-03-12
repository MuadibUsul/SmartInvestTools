import Link from "next/link";

import { getSiteDictionary } from "@/lib/copy";
import { withLocale, type Locale } from "@/lib/i18n";
import type { LocalizedTool } from "@/lib/types";

type ToolCardProps = {
  locale: Locale;
  tool: LocalizedTool;
};

export function ToolCard({ locale, tool }: ToolCardProps) {
  const dictionary = getSiteDictionary(locale);

  return (
    <article className="card-surface subtle-grid group relative overflow-hidden">
      <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-accent),transparent)]" />
      <div className="relative flex h-full flex-col gap-7">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-[color:var(--color-surface-strong)] px-3.5 py-2 text-[11px] font-semibold tracking-[0.18em] text-[var(--color-muted)] uppercase">
              {tool.category}
            </span>
            {tool.hasChart ? (
              <span className="rounded-full border border-[var(--color-border)] bg-[color:var(--color-surface-muted)] px-3.5 py-2 text-[11px] font-medium text-[var(--color-muted)]">
                {dictionary.toolUi.interactiveChart}
              </span>
            ) : null}
          </div>
          <div className="space-y-3">
            <h3 className="max-w-[16ch] text-[1.9rem] font-semibold leading-[1.02] tracking-[-0.05em] text-[var(--color-text)]">
              {tool.title}
            </h3>
            <p className="text-[0.96rem] leading-8 text-[var(--color-muted)]">
              {tool.shortDescription}
            </p>
          </div>
        </div>
        <div className="mt-auto space-y-5">
          <div className="flex flex-wrap gap-2.5">
            {tool.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--color-border)] bg-[color:var(--color-surface-strong)] px-3.5 py-2 text-[11px] font-medium text-[var(--color-muted-soft)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-5">
            <p className="text-sm text-[var(--color-muted-soft)]">
              {dictionary.toolUi.exploreCalculatorDetails}
            </p>
            <Link
              href={withLocale(locale, `/tools/${tool.slug}`)}
              className="inline-flex items-center rounded-full bg-[var(--color-text)] px-5 py-2.5 text-sm font-semibold text-[var(--color-bg)] shadow-[var(--shadow-card)] transition-transform group-hover:-translate-y-0.5"
            >
              {dictionary.toolUi.openTool}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
