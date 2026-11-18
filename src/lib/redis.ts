import { Redis } from "@upstash/redis";

// Vercel's Upstash Marketplace integration injects KV_REST_API_URL/TOKEN by
// default; a database created in the Upstash console gives UPSTASH_REDIS_REST_*.
// Accept either so the integration works without renaming variables.
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

export const hasUpstash = Boolean(url && token);

/** The shared Upstash client, or null when it isn't configured (local dev). */
export const redis = hasUpstash ? new Redis({ url: url!, token: token! }) : null;
