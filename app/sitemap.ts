import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";

const SITE_URL = "https://casadepastofernanda.pt";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: new Date("2026-07-25"),
    changeFrequency: "monthly",
    priority: locale === "pt" ? 1 : 0.8,
    alternates: {
      languages: {
        pt: `${SITE_URL}/pt`,
        en: `${SITE_URL}/en`,
        es: `${SITE_URL}/es`,
        fr: `${SITE_URL}/fr`,
        it: `${SITE_URL}/it`,
        de: `${SITE_URL}/de`,
      },
    },
  }));
}
