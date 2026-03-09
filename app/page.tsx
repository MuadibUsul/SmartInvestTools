import type { Metadata } from "next";
import Link from "next/link";

import { ToolCard } from "@/components/tools/ToolCard";
import { getAllTools } from "@/lib/tool-registry";

export const metadata: Metadata = {
  title: "Smart Invest Tools | Free Investing Calculators and Portfolio Tools",
  description:
    "Explore free investing calculators and portfolio tools for compound growth, dividends, ETF overlap, asset allocation, and FIRE planning.",
};

export default function HomePage() {
  const tools = getAllTools();

  return (
    <div className="content-shell pb-20 pt-4">
      <section className="relative overflow-hidden rounded-[2.25rem] border border-white/60 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(13,148,136,0.9),rgba(245,158,11,0.76))] px-6 py-16 text-white shadow-[var(--shadow-soft)] sm:px-10 sm:py-18 lg:px-14 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.16),transparent_28%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-14">
          <div className="space-y-8">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.24em] text-white/80 uppercase">
              Smart Invest Tools
            </span>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
                Smart Invest Tools
              </h1>
              <p className="max-w-2xl text-xl leading-8 text-white/84 sm:text-2xl sm:leading-9">
                Free Investing Calculators and Portfolio Tools
              </p>
              <p className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                Model long-term wealth, compare portfolio choices, and explore
                retirement scenarios with practical calculators designed for
                everyday investing decisions.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition-transform duration-200 hover:-translate-y-0.5"
              >
                Explore all tools
              </Link>
              <Link
                href="/tools/compound-interest-calculator"
                className="inline-flex items-center justify-center rounded-full border border-white/24 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/18"
              >
                Open compound calculator
              </Link>
            </div>
          </div>
          <div className="grid gap-4 rounded-[2rem] border border-white/16 bg-black/20 p-5 backdrop-blur sm:p-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/8 px-5 py-5">
              <p className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
                Quick snapshot
              </p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-white/70">Tools available</p>
                  <strong className="mt-2 block text-4xl font-semibold tracking-[-0.05em]">
                    {tools.length}
                  </strong>
                </div>
                <div className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-white/72 uppercase">
                  Ready to use
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/8 px-5 py-5">
                <p className="text-xs font-semibold tracking-[0.18em] text-white/58 uppercase">
                  What you can do
                </p>
                <p className="mt-3 text-xl font-medium">Plan goals with clarity</p>
                <p className="mt-2 text-sm leading-6 text-white/68">
                  Estimate growth, income, and allocation outcomes in seconds.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/8 px-5 py-5">
                <p className="text-xs font-semibold tracking-[0.18em] text-white/58 uppercase">
                  Experience
                </p>
                <p className="mt-3 text-xl font-medium">
                  Clear on every screen
                </p>
                <p className="mt-2 text-sm leading-6 text-white/68">
                  Fast, readable tools built for desktop and mobile use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <p className="eyebrow">
              Tool library
            </p>
            <h2 className="section-title max-w-3xl">
              Build better investing decisions with focused calculators
            </h2>
            <p className="section-copy">
              Explore calculators built to make complex investing questions feel
              simpler, more visual, and easier to act on.
            </p>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[color:var(--color-surface-strong)] px-5 py-3 text-sm font-semibold text-[var(--color-text)] shadow-[var(--shadow-card)] transition-colors hover:text-[var(--color-accent)]"
          >
            View all tools
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <article className="card-surface">
          <p className="eyebrow">
            Why investors use it
          </p>
          <h2 className="mt-4 section-title max-w-3xl">
            Practical tools for long-term planning
          </h2>
          <p className="mt-5 section-copy">
            Smart Invest Tools helps you compare scenarios, understand tradeoffs,
            and make more confident investing decisions with clean, easy-to-read
            calculators.
          </p>
        </article>
        <aside className="card-surface space-y-5">
          <p className="eyebrow">
            Categories
          </p>
          <div className="flex flex-wrap gap-3">
            {["Growth", "Income", "Portfolio", "Retirement"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[var(--color-border)] bg-[color:var(--color-surface-strong)] px-4 py-2.5 text-sm font-medium text-[var(--color-muted)]"
              >
                {item}
              </span>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
