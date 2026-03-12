import { getSiteDictionary } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import type { EducationSection } from "@/lib/types";

type ToolEducationProps = {
  sections: EducationSection[];
  locale: Locale;
};

export function ToolEducation({ sections, locale }: ToolEducationProps) {
  const dictionary = getSiteDictionary(locale);

  return (
    <section className="card-surface space-y-7">
      <div className="space-y-3">
        <h2 className="section-title">{dictionary.toolUi.educationTitle}</h2>
        <p className="text-sm leading-7 text-[var(--color-muted)]">
          {dictionary.toolUi.educationDescription}
        </p>
      </div>
      <div className="space-y-8">
        {sections.map((section) => (
          <article key={section.heading} className="space-y-4">
            <h3 className="text-[1.8rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--color-text)]">
              {section.heading}
            </h3>
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
      </div>
    </section>
  );
}
