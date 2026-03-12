import Link from "next/link";

import { getSiteDictionary } from "@/lib/copy";
import { withLocale, type Locale } from "@/lib/i18n";
import { getAllTools } from "@/lib/tool-registry";

type FooterProps = {
  locale: Locale;
};

export function Footer({ locale }: FooterProps) {
  const tools = getAllTools(locale);
  const dictionary = getSiteDictionary(locale);

  return (
    <footer className="relative border-t border-[var(--color-border)] bg-[color:var(--color-surface)]/80 backdrop-blur">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="space-y-4">
          <p className="font-[var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            {dictionary.siteName}
          </p>
          <p className="max-w-xl text-sm leading-7 text-[var(--color-muted)]">
            {dictionary.footer.description}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-[var(--color-muted)] uppercase">
              {dictionary.footer.navigation}
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link
                href={withLocale(locale, "/")}
                className="text-[var(--color-text)] hover:text-[var(--color-accent)]"
              >
                {dictionary.footer.home}
              </Link>
              <Link
                href={withLocale(locale, "/tools")}
                className="text-[var(--color-text)] hover:text-[var(--color-accent)]"
              >
                {dictionary.footer.allTools}
              </Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-[var(--color-muted)] uppercase">
              {dictionary.footer.popularTools}
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              {tools.slice(0, 4).map((tool) => (
                <Link
                  key={tool.slug}
                  href={withLocale(locale, `/tools/${tool.slug}`)}
                  className="text-[var(--color-text)] hover:text-[var(--color-accent)]"
                >
                  {tool.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
