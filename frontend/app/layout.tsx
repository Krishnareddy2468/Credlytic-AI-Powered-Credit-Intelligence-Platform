import type { Metadata, Viewport } from "next";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const title = "Credlytic | Credit intelligence for better decisions";
const description =
  "Understand credit-card eligibility, compare personal value, and improve your credit position before you apply — with no hard inquiry.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Credlytic"
  },
  description,
  applicationName: "Credlytic",
  keywords: ["credit card eligibility", "credit intelligence", "credit score", "India", "card comparison"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Credlytic",
    title,
    description,
    url: "/",
    locale: "en_IN"
  },
  twitter: {
    card: "summary_large_image",
    title,
    description
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" }
  }
};

export const viewport: Viewport = {
  themeColor: "#03070d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
