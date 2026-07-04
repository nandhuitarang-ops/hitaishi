import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Connect-src includes Upstash REST endpoints, which the client never hits directly
// (Redis calls happen server-side) but we keep the wildcard for safety.
const CSP = [
  "default-src 'self'",
  // Next.js dev needs 'unsafe-eval'; prod does not. framer-motion + Tailwind v4 use inline styles.
  isProd
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://images.unsplash.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.upstash.io",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const ADMIN_HEADERS = [
  ...SECURITY_HEADERS,
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
  { key: "Cache-Control", value: "no-store" },
  { key: "Referrer-Policy", value: "no-referrer" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      { source: "/admin/:path*", headers: ADMIN_HEADERS },
      { source: "/api/leads", headers: [
        { key: "Cache-Control", value: "no-store" },
        { key: "X-Robots-Tag", value: "noindex" },
      ]},
    ];
  },
};

export default nextConfig;
