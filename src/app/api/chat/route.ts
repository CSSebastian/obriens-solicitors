import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { z } from "zod";

import { buildSystemPrompt } from "@/lib/firm-knowledge";
import { checkChatLimits, clientIp, recordChatUsage } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

/** Google AI Studio free tier — a small, cheap model with a generous quota. */
const MODEL_ID = "gemini-2.5-flash-lite";

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
    /\bapi[ _]?key\b|unauthenticated|permission denied|invalid authentication|invalid api/.test(
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
    /quota|rate limit|resource[ _]exhausted|too many requests/.test(text)
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
        role: z.enum(["system", "user", "assistant"]),
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

function textOf(parts: { type: string; text?: string }[]): string {
  return parts
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => part.text)
    .join("");
}

export async function POST(request: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error(
      "[chat] misconfigured [auth]: GOOGLE_GENERATIVE_AI_API_KEY is not set",
    );
    return jsonError(
      "unavailable",
      503,
      "GOOGLE_GENERATIVE_AI_API_KEY is not set in this environment",
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

  // Server-side cap: a client cannot send an oversized prompt.
  const tooLong = parsed.data.messages.some(
    (message) =>
      message.role === "user" && textOf(message.parts).length > MAX_USER_CHARS,
  );
  if (tooLong) return jsonError("too-long", 413);

  const limit = await checkChatLimits(clientIp(request));
  if (!limit.ok) {
    // Our own guard tripped — distinct from an upstream Google rejection.
    console.warn(`[chat] blocked by local limiter [${limit.reason}]`);
    return jsonError(
      limit.reason === "daily-budget" ? "daily-budget" : "rate-limit",
      429,
      `local limiter: ${limit.reason}`,
    );
  }

  const history = parsed.data.messages.slice(-MAX_HISTORY) as UIMessage[];

  try {
    const result = streamText({
      model: google(MODEL_ID),
      system: buildSystemPrompt(),
      messages: await convertToModelMessages(history),
      maxOutputTokens: 500,
      temperature: 0.3,
      // Retry once on an upstream 429 before degrading.
      maxRetries: 1,
      // Count against the daily budget only once Google has actually produced
      // a response — a failed upstream call must never eat into the quota.
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
