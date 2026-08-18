/**
 * Canonical site origin, used for metadataBase, robots and the sitemap.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL     — set this once a custom domain is attached
 *   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel's stable production domain
 *   3. localhost                — local development
 *
 * VERCEL_URL is deliberately not used: it changes on every deployment, which
 * would put preview hostnames into canonical tags and the sitemap.
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

/**
 * Non-production deployments are kept out of search results.
 *
 * This is deliberately an opt-OUT rather than an opt-in: if VERCEL_ENV were ever
 * missing on a production build, an opt-in check would silently emit
 * `Disallow: /` and de-index the live site. Vercel also sets `x-robots-tag:
 * noindex` on preview deployments, so this is the second layer, not the only one.
 */
export const isIndexable = process.env.VERCEL_ENV !== "preview" && process.env.VERCEL_ENV !== "development";
