import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/**
 * Canonical, public, indexable pages only.
 *
 * Product surfaces, the sign-in and onboarding flows, and the comparison tool
 * are excluded — all carry `noindex`, and listing a noindexed URL in a sitemap
 * sends Google contradictory signals.
 *
 * `lastModified` is intentionally a fixed content date rather than build time.
 * `new Date()` marks every URL as changed on every deploy, which trains Google
 * to distrust the signal.
 *
 * Card and guide routes get appended here as they ship.
 */
const routes: Array<{
  path: string;
  lastModified: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", lastModified: "2026-08-19", changeFrequency: "weekly", priority: 1 },
  { path: "/cards", lastModified: "2026-08-19", changeFrequency: "weekly", priority: 0.8 },
  { path: "/credit-card-eligibility", lastModified: "2026-08-24", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", lastModified: "2026-08-19", changeFrequency: "monthly", priority: 0.6 },
  { path: "/methodology", lastModified: "2026-08-24", changeFrequency: "monthly", priority: 0.6 },
  { path: "/editorial-policy", lastModified: "2026-08-24", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", lastModified: "2026-08-24", changeFrequency: "yearly", priority: 0.4 }
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }));
}
