import type { MetadataRoute } from "next";
import { SITE_URL, absoluteUrl, isIndexableEnv } from "@/lib/seo";

/**
 * Crawl directives.
 *
 * Deliberately NOT disallowing the product routes (/dashboard, /profile,
 * /login, …). Those pages carry `noindex` via their route layouts, and a
 * crawler that is blocked by robots.txt can never fetch the page to see that
 * directive — so a Disallow would actively prevent deindexing and can leave a
 * URL-only listing in search results. Allow the crawl; let noindex do the work.
 *
 * Disallow is reserved for query permutations, which have no HTML of their own
 * to carry a robots tag and would otherwise create near-duplicates of /cards.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexableEnv) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/*?sort=", "/*?bank=", "/*?filter=", "/*?state=", "/*?card="]
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: absoluteUrl("/").replace(/\/$/, "")
  };
}
