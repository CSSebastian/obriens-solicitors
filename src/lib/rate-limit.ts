import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Quota protection for the Gemini free tier and the contact form.
 *
 * Google AI Studio's free tier allows roughly 15 requests/minute and 1,000
 * requests/day for the whole site, so limits here are deliberately set below
 * those ceilings. Upstash is used when configured; otherwise an in-memory
 * fallback keeps local development working (single process only).
 */

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const hasUpstash = Boolean(url && token);

const redis = hasUpstash ? new Redis({ url: url!, token: token! }) : null;

/* ------------------------------------------------------------------ */
/* In-memory fallback                                                  */
/* ------------------------------------------------------------------ */

const memoryHits = new Map<string, number[]>();
const memoryCounters = new Map<string, { value: number; expiresAt: number }>();

function memorySlidingWindow(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const hits = (memoryHits.get(key) ?? []).filter(
    (stamp) => now - stamp < windowMs,
  );
  if (hits.length >= limit) {
    memoryHits.set(key, hits);
    return false;
  }
  hits.push(now);
  memoryHits.set(key, hits);

  // Opportunistic pruning so the map cannot grow unbounded.
  if (memoryHits.size > 5_000) {
    for (const [entryKey, stamps] of memoryHits) {
      if (stamps.every((stamp) => now - stamp >= windowMs)) {
        memoryHits.delete(entryKey);
      }
    }
  }
  return true;
}

function memoryIncrement(key: string, ttlMs: number): number {
  const now = Date.now();
  const existing = memoryCounters.get(key);
  if (!existing || existing.expiresAt <= now) {
    memoryCounters.set(key, { value: 1, expiresAt: now + ttlMs });
    return 1;
  }
  existing.value += 1;
  return existing.value;
}

/* ------------------------------------------------------------------ */
/* Sliding windows                                                     */
/* ------------------------------------------------------------------ */

type WindowSpec = {
  id: string;
  limit: number;
  windowMs: number;
  /** Duration string understood by @upstash/ratelimit. */
  window: `${number} ${"s" | "m" | "h"}`;
};

const windows = {
  /** Site-wide ceiling, held below Google's ~15 requests/minute. */
  chatSite: { id: "chat:site", limit: 10, windowMs: 60_000, window: "60 s" },
  /** One visitor cannot burn the shared quota. */
  chatIpMinute: { id: "chat:ip:m", limit: 6, windowMs: 60_000, window: "60 s" },
  chatIpHour: {
    id: "chat:ip:h",
    limit: 30,
    windowMs: 3_600_000,
    window: "60 m",
  },
  /** Contact form: 3 submissions per hour per IP. */
  contactIpHour: {
    id: "contact:ip:h",
    limit: 3,
    windowMs: 3_600_000,
    window: "60 m",
  },
} satisfies Record<string, WindowSpec>;

type WindowName = keyof typeof windows;

const limiters = new Map<WindowName, Ratelimit>();

function getLimiter(name: WindowName): Ratelimit | null {
  if (!redis) return null;
  const cached = limiters.get(name);
  if (cached) return cached;

  const spec = windows[name];
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(spec.limit, spec.window),
    prefix: `obriens:${spec.id}`,
    analytics: false,
  });
  limiters.set(name, limiter);
  return limiter;
}

async function consume(name: WindowName, identifier: string): Promise<boolean> {
  const spec = windows[name];
  const limiter = getLimiter(name);
  if (!limiter) {
    return memorySlidingWindow(
      `${spec.id}:${identifier}`,
      spec.limit,
      spec.windowMs,
    );
  }
  try {
    const { success } = await limiter.limit(identifier);
    return success;
  } catch {
    // Never let a rate-limiter outage take the site down — fail open on the
    // shared store but keep the in-memory guard.
    return memorySlidingWindow(
      `${spec.id}:${identifier}`,
      spec.limit,
      spec.windowMs,
    );
  }
}

/* ------------------------------------------------------------------ */
/* Daily budget                                                        */
/* ------------------------------------------------------------------ */

export const DAILY_BUDGET = (() => {
  const parsed = Number.parseInt(process.env.CHATBOT_DAILY_BUDGET ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 600;
})();

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

const DAY_MS = 24 * 60 * 60 * 1000;

async function incrementDailyUsage(): Promise<number> {
  const key = `obriens:chat:daily:${todayKey()}`;
  if (!redis) return memoryIncrement(key, DAY_MS);
  try {
    const value = await redis.incr(key);
    if (value === 1) await redis.expire(key, 2 * 24 * 60 * 60);
    return value;
  } catch {
    return memoryIncrement(key, DAY_MS);
  }
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export type ChatLimitReason = "daily-budget" | "site-rate" | "ip-rate";

export type ChatLimitResult =
  | { ok: true }
  | { ok: false; reason: ChatLimitReason };

/**
 * Runs every chat guard in order: cheapest and most protective first.
 * The daily counter is only incremented once the rate windows have passed,
 * so blocked requests never eat into the budget.
 */
export async function checkChatLimits(ip: string): Promise<ChatLimitResult> {
  if (!(await consume("chatIpMinute", ip))) {
    return { ok: false, reason: "ip-rate" };
  }
  if (!(await consume("chatIpHour", ip))) {
    return { ok: false, reason: "ip-rate" };
  }
  if (!(await consume("chatSite", "global"))) {
    return { ok: false, reason: "site-rate" };
  }

  const used = await incrementDailyUsage();
  if (used > DAILY_BUDGET) {
    return { ok: false, reason: "daily-budget" };
  }

  return { ok: true };
}

export async function checkContactLimit(ip: string): Promise<boolean> {
  return consume("contactIpHour", ip);
}

/** Best-effort client IP from the platform's proxy headers. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
