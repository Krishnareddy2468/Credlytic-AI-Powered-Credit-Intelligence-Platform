import type { Metadata, Viewport } from "next";
import { SITE_LOCALE, SITE_NAME, SITE_URL, absoluteUrl, isIndexableEnv } from "@/lib/seo";
import "./globals.css";

/**
 * Homepage title. Establishes the entity ("Credlytic"), the category
 * ("credit card eligibility / credit intelligence") and the market ("India"),
 * which is what the homepage needs to rank for as a brand+category page.
 */
const homeTitle = "Credlytic — Credit Card Eligibility & Credit Intelligence India";
const homeDescription =
  "Check credit card eligibility before you apply — no hard inquiry. Compare cards by personal value, understand issuer policy, and see what to improve first.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: homeTitle,
    template: `%s | ${SITE_NAME}`
  },
  description: homeDescription,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    title: homeTitle,
    description: homeDescription,
    url: absoluteUrl("/")
  },
  twitter: { card: "summary_large_image", title: homeTitle, description: homeDescription },
  // Preview deployments must not be indexed; the *.vercel.app host would
  // otherwise compete with credlytic.in for the same content.
  robots: isIndexableEnv
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
    : { index: false, follow: false }
};

export const viewport: Viewport = {
  themeColor: "#03070d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
