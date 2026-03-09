import type { Metadata } from "next";

import { ToolCard } from "@/components/tools/ToolCard";
import { getAllTools } from "@/lib/tool-registry";

export const metadata: Metadata = {
  title: "Investment Calculators and Portfolio Tools | Smart Invest Tools",
  description:
    "Browse all Smart Invest Tools calculators, including compound interest, dividends, ETF overlap, portfolio allocation, and FIRE planning.",
};

export default function ToolsPage() {
  const tools = getAllTools();

  return (
    <div className="content-shell pb-20 pt-4">
      <section className="card-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,148,136,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_40%)]" />
        <div className="relative max-w-4xl space-y-5">
          <p className="eyebrow">
            Tool directory
          </p>
          <h1 className="text-5xl font-semibold tracking-[-0.055em] text-[var(--color-text)] sm:text-6xl">
            Financial calculators for smarter investing decisions
          </h1>
          <p className="section-copy">
            Explore the full Smart Invest Tools library, from portfolio growth
            projections to dividend income estimates and retirement planning.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </section>
    </div>
  );
}
