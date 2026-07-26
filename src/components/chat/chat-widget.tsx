"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { useChatUi } from "@/components/overlay/overlay-context";
import { ChatIcon, CloseIcon, SendIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/use-media-query";

const MAX_INPUT_CHARS = 1_000;
/** The counter stays hidden until the limit is actually in play. */
const COUNTER_FROM = 800;
/** Matches the exit transition below, so the panel unmounts after it plays. */
const EXIT_MS = 200;
/** Auto-grow ceiling for the composer (≈5 lines) before it scrolls. */
const INPUT_MAX_PX = 132;

const PRIVACY_NOTICE =
  "This assistant answers general questions only. Please don't share confidential or personal details about your matter — for anything specific, book a consultation.";

const GREETING = `Hello. I can answer general questions about ${site.name} — our practice areas, office hours and how to get in touch.`;

/** Shown once, on first open — they name what the assistant can actually answer. */
const SUGGESTIONS = [
  "What areas of law do you handle?",
  "Where are you located?",
  "How do I book a consultation?",
];

/**
 * The website assistant.
 *
 * Presentation notes: the panel is one light "document" surface rather than a
 * stack of boxes — the privacy note and the composer are quiet Athens Gray
 * insets, the conversation sits on paper between them, and there are no
 * full-width divider rules. Assistant replies are set as prose against a navy
 * hairline; the visitor's own words are solid navy blocks on the right. Square
 * corners and 1px lines throughout, per the style guide.
 */
export function ChatWidget() {
  const { isOpen, openChat, closeChat } = useChatUi();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [input, setInput] = useState("");
  const [degraded, setDegraded] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // `rendered` keeps the panel mounted through its exit transition; `visible`
  // drives the transition itself. Same pattern as the contact modal.
  const [rendered, setRendered] = useState(false);
  const [visible, setVisible] = useState(false);
  if (isOpen && !rendered) setRendered(true);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );

  const { messages, sendMessage, status } = useChat({
    transport,
    // Any failure — exhausted budget, rate limit, upstream error — degrades to
    // the "reach us directly" panel rather than showing a broken state.
    onError: () => setDegraded(true),
  });

  const isBusy = status === "submitted" || status === "streaming";

  const conversation = useMemo(
    () =>
      messages
        .map((message) => ({
          id: message.id,
          role: message.role === "user" ? ("user" as const) : ("assistant" as const),
          text: message.parts
            .filter((part) => part.type === "text")
            .map((part) => ("text" in part ? part.text : ""))
            .join(""),
        }))
        .filter((message) => message.text.length > 0),
    [messages],
  );

  const last = conversation.at(-1);
  // The cue covers the gap between sending and the first streamed token; once
  // text is arriving, the text itself is the indicator.
  const isThinking = isBusy && !degraded && last?.role !== "assistant";
  const showSuggestions = conversation.length === 0 && !isBusy && !degraded;

  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    if (!rendered) return;
    const raf = requestAnimationFrame(() => setVisible(false));
    const timer = setTimeout(() => setRendered(false), reduced ? 0 : EXIT_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [isOpen, rendered, reduced]);

  // Focus moves into the composer on open and back to the launcher on close.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (isOpen) {
      wasOpen.current = true;
      inputRef.current?.focus();
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    launcherRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeChat();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeChat]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [conversation, degraded, isThinking, showSuggestions]);

  // Grow the composer with its content, up to five lines.
  useEffect(() => {
    const field = inputRef.current;
    if (!field) return;
    field.style.height = "auto";
    field.style.height = `${Math.min(field.scrollHeight, INPUT_MAX_PX)}px`;
  }, [input, rendered]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isBusy || degraded) return;
    setInput("");
    void sendMessage({ text: trimmed.slice(0, MAX_INPUT_CHARS) });
    inputRef.current?.focus();
  }

  const shown = isOpen && visible;

  return (
    <>
      {/* The launcher stays mounted while the panel is open so focus has
          somewhere to return to on close. */}
      <div
        className={cn(
          "fixed right-5 bottom-5 z-40 transition-opacity duration-200 ease-out md:right-8 md:bottom-8",
          isOpen ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <Button
          ref={launcherRef}
          variant="primary"
          onClick={openChat}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-hidden={isOpen || undefined}
          tabIndex={isOpen ? -1 : undefined}
          className="border border-white/25 shadow-[0_12px_32px_rgba(3,3,3,0.32)]"
        >
          <ChatIcon className="size-5" aria-hidden />
          Ask a question
        </Button>
      </div>

      {rendered ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          className={cn(
            // Above the fixed site header (z-100) so the full-height mobile
            // panel isn't cut off by it; below the mobile menu (z-200).
            "fixed inset-0 z-150 flex h-dvh flex-col bg-paper text-text-on-light shadow-[0_24px_70px_rgba(3,3,3,0.28)] transition duration-200 ease-out",
            "sm:inset-auto sm:right-5 sm:bottom-5 sm:h-auto sm:max-h-[min(38rem,82dvh)] sm:w-[25rem] sm:border sm:border-line-on-light md:right-8 md:bottom-8",
            reduced
              ? ""
              : shown
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0",
          )}
        >
          {/* pt clears the status bar when the panel is full-screen on mobile;
              env() resolves to 0 elsewhere, leaving the 20px rhythm. */}
          <div className="flex items-start justify-between gap-4 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-4">
            <div>
              <h2 id={titleId} className="type-h4">
                Ask {site.shortName}
              </h2>
              <p className="mt-0.5 type-xs text-text-muted-on-light">
                General questions, answered quickly
              </p>
            </div>
            <button
              type="button"
              onClick={closeChat}
              aria-label="Close the assistant"
              className="-mt-1.5 -mr-2.5 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center text-text-on-light transition-colors duration-150 hover:bg-surface active:bg-neutral-100"
            >
              <CloseIcon className="size-4.5" />
            </button>
          </div>

          {/* Persistent privacy notice — required for a law firm. Quiet inset
              rather than a bordered band, so it never competes with the
              conversation. */}
          <p className="bg-surface px-5 py-3 type-micro text-neutral-600">
            {PRIVACY_NOTICE}
          </p>

          <div
            ref={logRef}
            className="flex-1 overflow-y-auto overscroll-contain px-5 py-5"
          >
            <ul className="flex flex-col gap-6" aria-live="polite" aria-atomic="false">
              <li>
                <AssistantMessage text={GREETING} />
              </li>

              {conversation.map((message) => (
                <li key={message.id}>
                  {message.role === "user" ? (
                    <UserMessage text={message.text} />
                  ) : (
                    <AssistantMessage text={message.text} />
                  )}
                </li>
              ))}

              {isThinking ? (
                <li>
                  <TypingCue reduced={reduced} />
                </li>
              ) : null}

              {degraded ? (
                <li>
                  <div className="border border-line-on-light bg-surface p-4">
                    <p className="type-small text-text-muted-on-light">
                      Our assistant is taking a break — you can reach us
                      directly:
                    </p>
                    <div className="mt-4 flex flex-col items-start gap-4">
                      <a
                        href={site.phoneHref}
                        className="type-h4 underline underline-offset-4 transition-opacity hover:opacity-70"
                      >
                        {site.phone}
                      </a>
                      <Button
                        href="/contact"
                        variant="primary"
                        onClick={closeChat}
                      >
                        Send a message
                      </Button>
                    </div>
                  </div>
                </li>
              ) : null}
            </ul>

            {showSuggestions ? (
              <div
                role="group"
                aria-label="Suggested questions"
                className="mt-6 flex flex-col gap-2"
              >
                {SUGGESTIONS.map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    size="chip"
                    className="w-full"
                    onClick={() => send(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            ) : null}
          </div>

          <form
            className="bg-surface px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
          >
            <div className="flex items-end gap-2">
              <label htmlFor="chat-input" className="sr-only">
                Your question
              </label>
              <textarea
                id="chat-input"
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={MAX_INPUT_CHARS}
                disabled={degraded}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send(input);
                  }
                }}
                placeholder={
                  degraded ? "Chat unavailable" : "Ask a general question…"
                }
                // text-base (16px) keeps iOS from zooming on focus.
                className="min-h-11 flex-1 resize-none border border-line-on-light bg-paper px-3.5 py-2.5 font-serif text-base leading-6 text-text-on-light transition-colors duration-150 placeholder:text-neutral-600 hover:border-neutral-400 focus:border-navy disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:opacity-70"
              />
              <Button
                type="submit"
                variant="primary"
                size="icon"
                disabled={isBusy || degraded || input.trim().length === 0}
                aria-label={isBusy ? "Sending" : "Send message"}
                // A flat neutral square, not a ghosted navy one: "not yet"
                // should look deliberate rather than half-painted.
                className="focus-visible:outline-navy disabled:bg-neutral-200 disabled:text-neutral-600 disabled:opacity-100"
              >
                {isBusy ? (
                  <TypingCue reduced={reduced} tone="current" compact />
                ) : (
                  <SendIcon className="size-5" />
                )}
              </Button>
            </div>
            {input.length >= COUNTER_FROM ? (
              <p aria-hidden className="mt-2 text-right type-micro text-neutral-600">
                {input.length}/{MAX_INPUT_CHARS}
              </p>
            ) : null}
          </form>
        </div>
      ) : null}
    </>
  );
}

/** Assistant replies read as prose, marked by a navy hairline. */
function AssistantMessage({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/);
  return (
    <div className="max-w-[46ch] border-l border-navy/30 pl-4">
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={cn(
            "font-serif text-base whitespace-pre-wrap text-text-muted-on-light",
            "leading-[1.65]",
            index > 0 && "mt-3",
          )}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

/** The visitor's own words: solid navy, right-aligned. */
function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[85%] bg-navy px-4 py-3 font-serif text-base leading-[1.55] whitespace-pre-wrap text-text-on-dark">
        {text}
      </p>
    </div>
  );
}

function TypingCue({
  reduced,
  tone = "navy",
  compact = false,
}: {
  reduced: boolean;
  /** `current` inherits the button's text colour through its disabled state. */
  tone?: "navy" | "current";
  compact?: boolean;
}) {
  const squares = (
    <span aria-hidden className="inline-flex items-center gap-1.5">
      <Square delay="0ms" tone={tone} reduced={reduced} />
      <Square delay="180ms" tone={tone} reduced={reduced} />
      <Square delay="360ms" tone={tone} reduced={reduced} />
    </span>
  );

  if (compact) return squares;

  return (
    <div className="border-l border-navy/30 pl-4">
      <span className="sr-only">The assistant is replying</span>
      {reduced ? (
        <span aria-hidden className="type-xs text-neutral-600">
          Replying…
        </span>
      ) : (
        squares
      )}
    </div>
  );
}

function Square({
  delay,
  tone,
  reduced,
}: {
  delay: string;
  tone: "navy" | "current";
  reduced: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-block size-1.5",
        tone === "current" ? "bg-current" : "bg-navy",
        reduced ? "opacity-60" : "animate-typing",
      )}
      style={reduced ? undefined : { animationDelay: delay }}
    />
  );
}
