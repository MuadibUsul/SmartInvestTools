import { getSiteDictionary } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import type { ResultCard } from "@/lib/types";

type ToolResultProps = {
  items: ResultCard[];
  locale: Locale;
};

export function ToolResult({ items, locale }: ToolResultProps) {
  const dictionary = getSiteDictionary(locale);

  return (
    <section className="card-surface space-y-7">
      <div className="space-y-3">
        <h2 className="section-title">{dictionary.toolUi.resultsTitle}</h2>
        <p className="text-sm leading-7 text-[var(--color-muted)]">
          {dictionary.toolUi.resultsDescription}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.label}
            className="card-panel min-w-0 rounded-[1.5rem] p-5 sm:p-6"
          >
            <p className="max-w-[20ch] text-sm font-medium leading-6 text-[var(--color-muted)]">
              {item.label}
            </p>
            <p
              className="metric-value mt-5 max-w-full"
              style={{ color: item.tone ? `var(${item.tone})` : "var(--color-text)" }}
            >
              {item.value}
            </p>
            {item.detailValue ? (
              <p className="mt-2 text-xs font-medium tracking-[0.02em] text-[var(--color-muted-soft)]">
                {item.detailValue}
              </p>
            ) : null}
            {item.helperText ? (
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted-soft)]">
                {item.helperText}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
