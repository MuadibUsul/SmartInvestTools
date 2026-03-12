"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { getSiteDictionary } from "@/lib/copy";
import { localeLabels, locales, swapLocaleInPathname, type Locale } from "@/lib/i18n";

type LocaleSwitcherProps = {
  locale: Locale;
};

export function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dictionary = getSiteDictionary(locale);
  const currentLabel = localeLabels[locale].shortLabel;

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={dictionary.localeSwitcher.ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex h-9 items-center justify-center rounded-full border px-3.5 text-xs font-medium ${
          open
            ? "border-[color:color-mix(in_srgb,var(--color-accent)_35%,var(--color-border))] bg-[color:color-mix(in_srgb,var(--color-accent)_10%,var(--color-surface-strong))] text-[var(--color-text)]"
            : "border-[var(--color-border)] bg-[color:var(--color-surface-muted)] text-[var(--color-muted)]"
        }`}
      >
        <span>{currentLabel}</span>
      </button>
      {open ? (
        <div className="absolute right-0 z-20 mt-2 min-w-[8.5rem] overflow-hidden rounded-[1.1rem] border border-[var(--color-border)] bg-[color:var(--color-surface)] p-1.5 shadow-[var(--shadow-soft)] backdrop-blur">
          {locales.map((entry) => {
            const href = swapLocaleInPathname(pathname, entry);
            const isActive = entry === locale;

            return (
              <Link
                key={entry}
                href={href}
                className={`flex items-center justify-between rounded-[0.85rem] px-3 py-2.5 text-sm font-medium ${
                  isActive
                    ? "bg-[color:color-mix(in_srgb,var(--color-accent)_12%,transparent)] text-[var(--color-text)]"
                    : "text-[var(--color-muted)] hover:bg-[color:var(--color-surface-strong)] hover:text-[var(--color-text)]"
                }`}
              >
                <span>{localeLabels[entry].shortLabel}</span>
                <span
                  className={`text-sm ${
                    isActive ? "text-[var(--color-highlight)]" : "opacity-0"
                  }`}
                >
                  v
                </span>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
