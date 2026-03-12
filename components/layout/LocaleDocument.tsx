"use client";

import { useEffect } from "react";

import type { Locale } from "@/lib/i18n";

type LocaleDocumentProps = {
  locale: Locale;
};

export function LocaleDocument({ locale }: LocaleDocumentProps) {
  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  return null;
}
