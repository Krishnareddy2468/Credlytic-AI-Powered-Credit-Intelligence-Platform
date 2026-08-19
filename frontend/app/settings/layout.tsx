import type { Metadata } from "next";
import { productMetadata } from "@/lib/seo";

/**
 * Product surface: kept out of search results with a robots directive.
 * robots.txt Disallow alone cannot deindex a page — a disallowed URL can
 * still be indexed from external links, just without its content.
 */
export const metadata: Metadata = productMetadata("Settings", "/settings");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
