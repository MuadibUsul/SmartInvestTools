type InformationalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
};

export function InformationalPage({
  eyebrow,
  title,
  description,
  sections,
}: InformationalPageProps) {
  return (
    <div className="content-shell pb-20 pt-4">
      <section className="card-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(13,148,136,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.1),transparent_28%)]" />
        <div className="relative max-w-4xl space-y-5">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="text-5xl font-semibold tracking-[-0.055em] text-[var(--color-text)] sm:text-6xl">
            {title}
          </h1>
          <p className="section-copy">{description}</p>
        </div>
      </section>

      <section className="card-surface space-y-8">
        {sections.map((section) => (
          <article key={section.heading} className="space-y-4">
            <h2 className="text-[1.8rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--color-text)]">
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="max-w-4xl text-base leading-8 text-[var(--color-muted)]"
              >
                {paragraph}
              </p>
            ))}
          </article>
        ))}
      </section>
    </div>
  );
}

