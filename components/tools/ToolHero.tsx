import type { LocalizedTool } from "@/lib/types";

type ToolHeroProps = {
  tool: LocalizedTool;
};

export function ToolHero({ tool }: ToolHeroProps) {
  return (
    <section className="card-surface relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(13,148,136,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.1),transparent_28%)]" />
      <div className="relative max-w-5xl space-y-5 sm:space-y-6">
        <p className="eyebrow">
          {tool.category}
        </p>
        <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-[var(--color-text)] sm:text-6xl lg:text-7xl">
          {tool.title}
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-[var(--color-muted)] sm:text-xl sm:leading-9">
          {tool.longDescription}
        </p>
      </div>
    </section>
  );
}
