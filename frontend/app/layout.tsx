import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Credlytic | Credit intelligence for better decisions",
    template: "%s | Credlytic"
  },
  description: "Understand credit-card eligibility, compare personal value, and improve your credit position before applying."
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
