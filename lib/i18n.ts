export const locales = ["en", "zh"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

const intlLocaleMap: Record<Locale, string> = {
  en: "en-US",
  zh: "zh-CN",
};

export const localeLabels: Record<
  Locale,
  { shortLabel: string; nativeLabel: string }
> = {
  en: {
    shortLabel: "EN",
    nativeLabel: "English",
  },
  zh: {
    shortLabel: "中文",
    nativeLabel: "中文",
  },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function resolveLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function getIntlLocale(locale: Locale) {
  return intlLocaleMap[locale];
}

export function withLocale(locale: Locale, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (normalized === "/") {
    return `/${locale}`;
  }

  return `/${locale}${normalized}`;
}

export function swapLocaleInPathname(pathname: string, locale: Locale) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return `/${locale}`;
  }

  if (isLocale(segments[0])) {
    segments[0] = locale;
  } else {
    segments.unshift(locale);
  }

  return `/${segments.join("/")}`;
}
