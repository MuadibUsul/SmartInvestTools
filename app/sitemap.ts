import type { MetadataRoute } from "next";

import { locales, withLocale } from "@/lib/i18n";
import { getAbsoluteUrl } from "@/lib/site";
import { getAllToolSlugs } from "@/lib/tool-registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolSlugs = getAllToolSlugs();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push(
      {
        url: getAbsoluteUrl(withLocale(locale, "/")),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: getAbsoluteUrl(withLocale(locale, "/tools")),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: getAbsoluteUrl(withLocale(locale, "/about")),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.4,
      },
      {
        url: getAbsoluteUrl(withLocale(locale, "/privacy")),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.3,
      },
    );

    for (const slug of toolSlugs) {
      entries.push({
        url: getAbsoluteUrl(withLocale(locale, `/tools/${slug}`)),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return entries;
}

