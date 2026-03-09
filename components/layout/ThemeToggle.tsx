"use client";

import { useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("smart-invest-tools-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") {
      return "light";
    }

    return (document.documentElement.dataset.theme as Theme | undefined) ?? "light";
  });

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextTheme} mode`}
      suppressHydrationWarning
      onClick={() => {
        const updated = theme === "dark" ? "light" : "dark";
        setTheme(updated);
        applyTheme(updated);
      }}
      className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[color:var(--color-surface-strong)] px-4 text-sm font-medium text-[var(--color-text)] hover:-translate-y-0.5"
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
