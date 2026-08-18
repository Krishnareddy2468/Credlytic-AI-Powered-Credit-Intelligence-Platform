/**
 * Security headers. A strict Content-Security-Policy is deliberately not set
 * here: Next injects inline bootstrap scripts, so CSP needs nonce plumbing via
 * proxy/middleware to avoid breaking hydration. Adding a broken policy would be
 * worse than none — see docs/DEPLOYMENT.md for the follow-up.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // No `preload`/`includeSubDomains`: both are hard to walk back once submitted.
  { key: "Strict-Transport-Security", value: "max-age=31536000" }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  }
};

export default nextConfig;
