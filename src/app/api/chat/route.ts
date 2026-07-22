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
import { checkChatLimits, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

/** Google AI Studio free tier — a small, cheap model with a generous quota. */
const MODEL_ID = "gemini-2.5-flash-lite";

/** Conversation history sent upstream, to keep tokens-per-minute low. */
const MAX_HISTORY = 6;
const MAX_USER_CHARS = 1_000;

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

function jsonError(error: string, status: number) {
  return Response.json({ error }, { status });
}

function textOf(parts: { type: string; text?: string }[]): string {
  return parts
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => part.text)
    .join("");
}

export async function POST(request: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return jsonError("unavailable", 503);
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
    return jsonError(
      limit.reason === "daily-budget" ? "daily-budget" : "rate-limit",
      429,
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
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        onError: (error) => {
          console.error("[chat] stream error", error);
          return "unavailable";
        },
      }),
    });
  } catch (error) {
    console.error("[chat] request failed", error);
    return jsonError("unavailable", 502);
  }
}
