import Link from "next/link";

import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { getSiteDictionary } from "@/lib/copy";
import { withLocale, type Locale } from "@/lib/i18n";

type HeaderProps = {
  locale: Locale;
};

export function Header({ locale }: HeaderProps) {
  const dictionary = getSiteDictionary(locale);
  const navItems = [
    { href: withLocale(locale, "/"), label: dictionary.header.home },
    { href: withLocale(locale, "/tools"), label: dictionary.header.tools },
    {
      href: withLocale(locale, "/tools/compound-interest-calculator"),
      label: dictionary.header.featuredTool,
    },
  ];

  return (
    <header className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between rounded-full border border-[var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur sm:px-5">
        <Link href={withLocale(locale, "/")} className="flex items-center">
          <div className="hidden sm:block">
            <p className="font-[var(--font-display)] text-sm font-semibold tracking-[0.16em] text-[var(--color-muted)] uppercase">
              {dictionary.header.brandTop}
            </p>
            <p className="text-sm text-[var(--color-text)]">
              {dictionary.header.brandBottom}
            </p>
          </div>
          <div className="sm:hidden">
            <p className="font-[var(--font-display)] text-base font-semibold tracking-[-0.04em] text-[var(--color-text)]">
              {dictionary.header.mobileBrand}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher locale={locale} />
          <ThemeToggle locale={locale} />
          <Link
            href={withLocale(locale, "/tools")}
            className="hidden rounded-full bg-[var(--color-text)] px-4 py-2 text-sm font-semibold text-[var(--color-bg)] sm:inline-flex"
          >
            {dictionary.header.browseTools}
          </Link>
        </div>
      </div>
    </header>
  );
}
