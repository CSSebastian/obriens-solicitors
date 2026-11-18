import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The chatbot's system prompt is read from src/content/firm-knowledge.md at
  // runtime, so it must be traced into the serverless function bundle.
  outputFileTracingIncludes: {
    "/api/chat": ["./src/content/firm-knowledge.md"],
  },
  poweredByHeader: false,
  // Photography is uploaded in Sanity and served through next/image from
  // Sanity's CDN. The optimiser negotiates modern formats per request — AVIF
  // first, then WebP, then the original — and emits responsive widths.
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/p0i7hr40/**" }],
  },
  // 301s for the firm's old indexed URLs — these carry years of ranking, so the
  // paths must not 404 after the restructure.
  async redirects() {
    // Explicit 301s (not Next's default 308) — the old URLs have years of
    // indexing, and 301 is the status the SEO brief calls for.
    return [
      {
        source: "/estate-planning-administration",
        destination: "/estate-planning",
        statusCode: 301,
      },
      { source: "/our-team", destination: "/team", statusCode: 301 },
      { source: "/contact-us", destination: "/contact", statusCode: 301 },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Clickjacking protection: only this site and the Sanity Studio's
          // live preview may show these pages in a frame. (Replaces
          // X-Frame-Options: SAMEORIGIN, which can't allow the Studio.)
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://obriens-solicitors.sanity.studio https://www.sanity.io https://sanity.io",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
