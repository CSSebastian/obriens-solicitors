import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The chatbot's system prompt is read from src/content/firm-knowledge.md at
  // runtime, so it must be traced into the serverless function bundle.
  outputFileTracingIncludes: {
    "/api/chat": ["./src/content/firm-knowledge.md"],
  },
  poweredByHeader: false,
  // Photography is served through next/image from public/images (optimised
  // JPEG sources). The optimiser negotiates modern formats per request — AVIF
  // first, then WebP, then the JPEG fallback — and emits responsive widths.
  images: {
    formats: ["image/avif", "image/webp"],
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
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
