import type { Locale } from "@/lib/i18n";
import { getIntlLocale } from "@/lib/i18n";

export function clampNumber(
  value: number,
  min = 0,
  max = Number.POSITIVE_INFINITY,
) {
  return Math.min(Math.max(value, min), max);
}

export function parseNumber(value: string, fallback = 0) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}

export function formatCurrency(value: number, locale: Locale = "en") {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactCurrency(value: number, locale: Locale = "en") {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: value >= 1_000_000_000 ? 2 : 1,
  }).format(value);
}

export function formatCompactNumber(value: number, locale: Locale = "en") {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    notation: "compact",
    maximumFractionDigits: value >= 1_000_000_000 ? 2 : 1,
  }).format(value);
}

export function formatNumber(
  value: number,
  locale: Locale = "en",
  digits = 0,
) {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPercent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`;
}
