import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The chatbot's system prompt is read from src/content/firm-knowledge.md at
  // runtime, so it must be traced into the serverless function bundle.
  outputFileTracingIncludes: {
    "/api/chat": ["./src/content/firm-knowledge.md"],
  },
  poweredByHeader: false,
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
