import type { Metadata } from "next";

/**
 * Canonical origin for every public URL.
 *
 * Must match the host Vercel serves as Production. `www.credlytic.in` is the
 * production domain; the apex 308-redirects to it. Declaring the apex here made
 * every sitemap URL resolve as a redirect and every canonical point at a
 * redirecting URL, which Search Console reported as "Page with redirect".
 *
 * Also deliberately does NOT fall back to `VERCEL_PROJECT_PRODUCTION_URL` — that
 * resolves to the *.vercel.app deployment host and hands the site's equity to a
 * domain nobody links to.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.credlytic.in").replace(/\/+$/, "");

export const SITE_NAME = "Credlytic";
export const SITE_LOCALE = "en_IN";

/** Preview and local builds must never be indexed. Anything else is treated as production. */
export const isIndexableEnv =
  process.env.VERCEL_ENV !== "preview" && process.env.VERCEL_ENV !== "development";

/** Join a route onto the canonical origin. Accepts "/" and "/cards" alike. */
export function absoluteUrl(path = "/") {
  if (!path.startsWith("/")) return `${SITE_URL}/${path}`;
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

interface SeoInput {
  /** Page title without the site suffix — the layout template appends it. */
  title: string;
  description: string;
  /** Route path used for the canonical and og:url. */
  path: string;
  /**
   * Product surfaces and utility routes set this false. Note that noindex is
   * the control that actually keeps a page out of the index; robots.txt only
   * controls crawling and is not a substitute.
   */
  index?: boolean;
  /** Overrides the shared social card when a page has its own artwork. */
  ogImage?: string;
  type?: "website" | "article";
}

/**
 * Single source of per-page metadata, so canonical/OG/Twitter can never drift
 * apart across routes.
 */
export function buildMetadata({
  title,
  description,
  path,
  index = true,
  ogImage,
  type = "website"
}: SeoInput): Metadata {
  const url = absoluteUrl(path);
  const shouldIndex = index && isIndexableEnv;

  return {
    // `absolute` rather than a templated string: a layout that sets a plain
    // string title breaks the parent template for its children, which produced
    // "About Credlytic | Credlytic" on one route and a missing suffix on another.
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: shouldIndex
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
      : { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      title,
      description,
      url,
      ...(ogImage ? { images: [{ url: ogImage }] } : {})
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {})
    }
  };
}

/** Applied to product surfaces that must stay out of search results entirely. */
export const noindexRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false }
};


/**
 * Metadata for product surfaces: out of the index, but still self-canonical.
 *
 * A route with no `alternates.canonical` inherits its parent layout's, so every
 * such page was declaring the homepage as its canonical. A self-referencing
 * canonical is never wrong; an inherited one usually is.
 */
export function productMetadata(title: string, path: string): Metadata {
  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    alternates: { canonical: absoluteUrl(path) },
    robots: noindexRobots
  };
}
