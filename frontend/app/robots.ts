import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/lib/site";

/**
 * Product surfaces render illustrative sample data, so they are kept out of
 * search results. Preview and local builds are excluded from indexing entirely.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/profile", "/eligibility", "/reports", "/settings", "/cards/compare"]
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}
