"use client";

import { useState } from "react";

import { getSiteDictionary } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";

type Theme = "light" | "dark";

type ThemeToggleProps = {
  locale: Locale;
};

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("smart-invest-tools-theme", theme);
}

export function ThemeToggle({ locale }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") {
      return "light";
    }

    return (document.documentElement.dataset.theme as Theme | undefined) ?? "light";
  });

  const nextTheme = theme === "dark" ? "light" : "dark";
  const dictionary = getSiteDictionary(locale);
  const nextThemeLabel =
    nextTheme === "dark"
      ? dictionary.themeToggle.darkMode
      : dictionary.themeToggle.lightMode;
  const currentLabel =
    theme === "dark"
      ? dictionary.themeToggle.lightMode
      : dictionary.themeToggle.darkMode;

  return (
    <button
      type="button"
      aria-label={`${dictionary.themeToggle.switchTo} ${nextThemeLabel}`}
      suppressHydrationWarning
      onClick={() => {
        const updated = theme === "dark" ? "light" : "dark";
        setTheme(updated);
        applyTheme(updated);
      }}
      className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[color:var(--color-surface-strong)] px-4 text-sm font-medium text-[var(--color-text)] hover:-translate-y-0.5"
    >
      {currentLabel}
    </button>
  );
}
