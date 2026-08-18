import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const routes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/cards", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/onboarding", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/login", priority: 0.4, changeFrequency: "monthly" as const }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }));
}
