import { anthropic } from "@ai-sdk/anthropic";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { z } from "zod";

import { site } from "@/content/site";
import { buildSystemPrompt } from "@/lib/firm-knowledge";
import { checkChatLimits, clientIp, recordChatUsage } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

/** Anthropic's small, fast model — ample for answering from a fixed prompt. */
const MODEL_ID = "claude-haiku-4-5";

/** Conversation history sent upstream, to keep tokens-per-minute low. */
const MAX_HISTORY = 6;
const MAX_USER_CHARS = 1_000;

/**
 * Development only: surface the real failure to the caller and log it verbosely.
 * Production stays a silent, friendly fallback — no internals leak to users.
 */
const isDev = process.env.NODE_ENV !== "production";

type ErrorKind =
  | "auth"
  | "model-not-found"
  | "upstream-rate-limit"
  | "network"
  | "unknown";

/** Sort an upstream failure into a distinct, greppable category. */
function classifyError(error: unknown): { kind: ErrorKind; detail: string } {
  const detail = error instanceof Error ? error.message : String(error);
  const status =
    (error as { statusCode?: number; status?: number })?.statusCode ??
    (error as { status?: number })?.status;
  const text = detail.toLowerCase();

  if (
    status === 401 ||
    status === 403 ||
    /\bapi[ _]?key\b|unauthenticated|permission denied|invalid authentication|invalid api|credit balance|insufficient (credit|funds)/.test(
      text,
    )
  ) {
    return { kind: "auth", detail };
  }
  if (
    status === 404 ||
    /not found|no such model|unsupported model|is not supported|models\//.test(
      text,
    )
  ) {
    return { kind: "model-not-found", detail };
  }
  if (
    status === 429 ||
    status === 529 ||
    /quota|rate limit|resource[ _]exhausted|too many requests|overloaded/.test(
      text,
    )
  ) {
    return { kind: "upstream-rate-limit", detail };
  }
  if (
    /fetch failed|network|enotfound|econnrefused|econnreset|etimedout|timed out|socket hang/.test(
      text,
    )
  ) {
    return { kind: "network", detail };
  }
  return { kind: "unknown", detail };
}

/** Log a distinct line per failure mode; keep the full object in dev. */
function logUpstreamError(
  where: string,
  error: unknown,
): { kind: ErrorKind; detail: string } {
  const info = classifyError(error);
  console.error(
    `[chat] ${where} failed [${info.kind}]`,
    isDev ? error : info.detail,
  );
  return info;
}

const partSchema = z
  .object({ type: z.string(), text: z.string().optional() })
  .loose();

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        id: z.string().optional(),
        // Deliberately no "system": a browser has no business sending an
        // operator turn, and convertToModelMessages would pass one upstream
        // verbatim. Anything claiming to be a system message is visitor text.
        role: z.enum(["user", "assistant"]),
        parts: z.array(partSchema).max(20),
      }),
    )
    .min(1)
    .max(60),
});

function jsonError(error: string, status: number, detail?: string) {
  // Production callers only ever see the friendly code; dev callers also get
  // the underlying reason so a failure is diagnosable without server access.
  const body = isDev && detail ? { error, detail } : { error };
  return Response.json(body, { status });
}

/**
 * Origins allowed to POST here: the canonical site, the Vercel deployment URL,
 * and localhost in development. A same-origin browser fetch sends `Origin`; a
 * request without one (curl, a server-side caller) is let through to the rate
 * limiter rather than blocked, since the header is trivially omitted anyway.
 */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const allowed = new Set<string>([new URL(site.url).origin]);
  if (process.env.VERCEL_URL) {
    allowed.add(`https://${process.env.VERCEL_URL}`);
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    allowed.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }
  if (isDev) {
    const host = request.headers.get("host");
    if (host) {
      allowed.add(`http://${host}`);
      allowed.add(`https://${host}`);
    }
  }

  return allowed.has(origin);
}

function textOf(parts: { type: string; text?: string }[]): string {
  return parts
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => part.text)
    .join("");
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    // Not a browser on this site. Keeps the endpoint from being embedded
    // elsewhere as a free model proxy; the per-IP limits cover the rest.
    console.warn("[chat] blocked [origin]");
    return jsonError("forbidden", 403);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[chat] misconfigured [auth]: ANTHROPIC_API_KEY is not set");
    return jsonError(
      "unavailable",
      503,
      "ANTHROPIC_API_KEY is not set in this environment",
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError("invalid", 400);
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) return jsonError("invalid", 400);

  // Server-side cap, applied to every role. Capping only the user turns would
  // leave a forged assistant turn as an unbounded channel into the prompt.
  const tooLong = parsed.data.messages.some(
    (message) => textOf(message.parts).length > MAX_USER_CHARS,
  );
  if (tooLong) return jsonError("too-long", 413);

  const limit = await checkChatLimits(clientIp(request));
  if (!limit.ok) {
    // Our own guard tripped — distinct from an upstream Anthropic rejection.
    console.warn(`[chat] blocked by local limiter [${limit.reason}]`);
    return jsonError(
      limit.reason === "daily-budget" ? "daily-budget" : "rate-limit",
      429,
      `local limiter: ${limit.reason}`,
    );
  }

  // Rebuild each turn from its text alone. The client's own parts are dropped,
  // so nothing but plain text from the visitor can reach the model — no files,
  // no tool calls, no provider-specific metadata smuggled through a loose part.
  const history = parsed.data.messages
    .slice(-MAX_HISTORY)
    .map((message, index) => ({
      id: message.id ?? `m${index}`,
      role: message.role,
      parts: [{ type: "text" as const, text: textOf(message.parts) }],
    }))
    .filter((message) => message.parts[0]!.text.length > 0) as UIMessage[];

  if (history.length === 0) return jsonError("invalid", 400);

  try {
    const result = streamText({
      model: anthropic(MODEL_ID),
      system: buildSystemPrompt(),
      messages: await convertToModelMessages(history),
      maxOutputTokens: 500,
      temperature: 0.3,
      // Retry once on an upstream 429 before degrading.
      maxRetries: 1,
      // Count against the daily budget only once Anthropic has actually
      // produced a response — a failed call must never eat into the quota.
      onFinish: () => {
        void recordChatUsage();
      },
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        onError: (error) => {
          const { kind, detail } = logUpstreamError("stream", error);
          return isDev ? `[${kind}] ${detail}` : "unavailable";
        },
      }),
    });
  } catch (error) {
    const { kind, detail } = logUpstreamError("request", error);
    return jsonError("unavailable", 502, `[${kind}] ${detail}`);
  }
}
