import type { MetadataRoute } from "next";

const SITE_URL = "https://casa-de-pasto-fernanda.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
