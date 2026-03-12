import Link from "next/link";

import { getSiteDictionary } from "@/lib/copy";
import { withLocale, type Locale } from "@/lib/i18n";
import { getToolBySlug } from "@/lib/tool-registry";

type RelatedToolsProps = {
  locale: Locale;
  slugs: string[];
};

export function RelatedTools({ locale, slugs }: RelatedToolsProps) {
  const dictionary = getSiteDictionary(locale);
  const tools = slugs
    .map((slug) => getToolBySlug(slug, locale))
    .filter((tool) => tool !== undefined);

  if (tools.length === 0) {
    return null;
  }

  return (
    <section className="card-surface space-y-7">
      <div className="space-y-3">
        <h2 className="section-title">{dictionary.toolUi.relatedTitle}</h2>
        <p className="text-sm leading-7 text-[var(--color-muted)]">
          {dictionary.toolUi.relatedDescription}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={withLocale(locale, `/tools/${tool.slug}`)}
            className="card-panel rounded-[1.5rem] p-5 sm:p-6 hover:-translate-y-0.5"
          >
            <p className="text-xl font-semibold tracking-[-0.04em] text-[var(--color-text)]">
              {tool.title}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              {tool.shortDescription}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
