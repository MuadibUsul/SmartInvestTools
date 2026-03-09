import Link from "next/link";

import { getToolBySlug } from "@/lib/tool-registry";

type RelatedToolsProps = {
  slugs: string[];
};

export function RelatedTools({ slugs }: RelatedToolsProps) {
  const tools = slugs
    .map((slug) => getToolBySlug(slug))
    .filter((tool) => tool !== undefined);

  if (tools.length === 0) {
    return null;
  }

  return (
    <section className="card-surface space-y-7">
      <div className="space-y-3">
        <h2 className="section-title">Explore more tools</h2>
        <p className="text-sm leading-7 text-[var(--color-muted)]">
          Continue into related calculators and portfolio planning workflows.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
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
