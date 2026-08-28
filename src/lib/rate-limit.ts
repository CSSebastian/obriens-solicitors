import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Abuse and cost protection for the chatbot and the contact form.
 *
 * The chat limits below are no longer working around a provider quota — the
 * Anthropic API is pay-as-you-go, so the only ceiling is the bill. They exist
 * to stop one visitor (or one script) running up cost, and the daily budget
 * caps the site's total spend. Upstash is used when configured; otherwise an
 * in-memory fallback keeps local development working (single process only).
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
  /** Site-wide burst ceiling — a script hitting the endpoint costs money. */
  chatSite: { id: "chat:site", limit: 20, windowMs: 60_000, window: "60 s" },
  /** One visitor cannot burn the shared budget. Generous for real typing. */
  chatIpMinute: { id: "chat:ip:m", limit: 8, windowMs: 60_000, window: "60 s" },
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

function dailyKey(): string {
  return `obriens:chat:daily:${todayKey()}`;
}

async function incrementDailyUsage(): Promise<number> {
  const key = dailyKey();
  if (!redis) return memoryIncrement(key, DAY_MS);
  try {
    const value = await redis.incr(key);
    if (value === 1) await redis.expire(key, 2 * 24 * 60 * 60);
    return value;
  } catch {
    return memoryIncrement(key, DAY_MS);
  }
}

/** Read today's usage without touching it, so a check never spends budget. */
async function readDailyUsage(): Promise<number> {
  const key = dailyKey();
  if (!redis) {
    const existing = memoryCounters.get(key);
    return existing && existing.expiresAt > Date.now() ? existing.value : 0;
  }
  try {
    const value = await redis.get<number>(key);
    return typeof value === "number" ? value : Number(value ?? 0);
  } catch {
    const existing = memoryCounters.get(key);
    return existing && existing.expiresAt > Date.now() ? existing.value : 0;
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
 *
 * The daily budget is only *checked* here (a read, never an increment), so a
 * request that later fails upstream — a bad key, a missing model — cannot burn
 * the budget. The counter is advanced by {@link recordChatUsage}, which the
 * route calls only after Anthropic has actually served the response.
 *
 * The sliding windows are deliberately different: they throttle *attempts*, so
 * a retry storm against a broken upstream can't hammer the shared quota. They
 * self-heal within their window, so counting attempts there is intended.
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

  const used = await readDailyUsage();
  if (used >= DAILY_BUDGET) {
    return { ok: false, reason: "daily-budget" };
  }

  return { ok: true };
}

/**
 * Advance the daily budget counter. Call this only once a request has actually
 * been sent to and accepted by Anthropic, so failed calls never spend budget.
 */
export async function recordChatUsage(): Promise<void> {
  await incrementDailyUsage();
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
