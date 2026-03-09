import type { ToolFaqItem } from "@/lib/types";

type ToolFaqProps = {
  faq: ToolFaqItem[];
};

export function ToolFaq({ faq }: ToolFaqProps) {
  return (
    <section className="card-surface space-y-5">
      <div className="space-y-2">
        <h2 className="section-title">Frequently asked questions</h2>
        <p className="text-sm leading-7 text-[var(--color-muted)]">
          Quick answers to common questions about this tool.
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
