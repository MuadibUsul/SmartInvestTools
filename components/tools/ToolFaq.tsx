import { getSiteDictionary } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import type { ToolFaqItem } from "@/lib/types";

type ToolFaqProps = {
  faq: ToolFaqItem[];
  locale: Locale;
};

export function ToolFaq({ faq, locale }: ToolFaqProps) {
  const dictionary = getSiteDictionary(locale);

  return (
    <section className="card-surface space-y-5">
      <div className="space-y-2">
        <h2 className="section-title">{dictionary.toolUi.faqTitle}</h2>
        <p className="text-sm leading-7 text-[var(--color-muted)]">
          {dictionary.toolUi.faqDescription}
        </p>
      </div>
      <div className="space-y-3">
        {faq.map((item) => (
          <details
            key={item.question}
            className="rounded-[1.25rem] border border-[var(--color-border)] bg-[color:var(--color-surface-strong)] px-5 py-4"
          >
            <summary className="cursor-pointer list-none text-lg font-medium text-[var(--color-text)]">
              {item.question}
            </summary>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
