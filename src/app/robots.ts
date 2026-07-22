import type { MetadataRoute } from "next";

import { site } from "@/content/site";

/**
 * robots.txt.
 *
 * Business decision: this firm wants MAXIMUM discoverability, including being
 * cited inside AI answers (ChatGPT, Claude, Perplexity, Google AI Overviews,
 * etc.). So the major AI crawlers are ALLOWED explicitly below, alongside
 * normal search crawlers. This trades content-protection for visibility, which
 * is the right call for a law firm competing on local search.
 *
 * To REVERSE this later (e.g. stop AI training/answer use), change the relevant
 * bot's rule from `allow: "/"` to `disallow: "/"` — this file is the single
 * lever. See also /public/llms.txt, which feeds the same systems a clean
 * summary of the firm.
 *
 * Non-public paths (the API routes) are disallowed for every crawler.
 */

// AI answer-engine and training crawlers we deliberately welcome.
const AI_CRAWLERS = [
  "GPTBot", // OpenAI (ChatGPT) — training + browsing
  "OAI-SearchBot", // OpenAI — ChatGPT search results
  "ChatGPT-User", // OpenAI — live user-triggered fetches
  "ClaudeBot", // Anthropic — training
  "Claude-User", // Anthropic — Claude user-triggered fetches
  "Claude-SearchBot", // Anthropic — Claude search
  "PerplexityBot", // Perplexity — index
  "Perplexity-User", // Perplexity — user-triggered fetches
  "Google-Extended", // Google — Gemini / AI Overviews eligibility
  "Applebot-Extended", // Apple — Apple Intelligence eligibility
  "CCBot", // Common Crawl — feeds many AI datasets
] as const;

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/"];

  return {
    rules: [
      // Normal search + everything else.
      { userAgent: "*", allow: "/", disallow },
      // Bing (also powers Copilot / DuckDuckGo and several AI search products).
      { userAgent: ["Bingbot", "BingPreview"], allow: "/", disallow },
      // Explicitly welcome the AI answer engines (see note above).
      { userAgent: [...AI_CRAWLERS], allow: "/", disallow },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
