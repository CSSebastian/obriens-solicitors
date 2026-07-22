"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";

import { useChatUi } from "@/components/overlay/overlay-context";
import { ChatIcon, CloseIcon, SendIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

const MAX_INPUT_CHARS = 1_000;

const PRIVACY_NOTICE =
  "This assistant answers general questions only. Please don't share confidential or personal details about your matter — for anything specific, book a consultation.";

const GREETING = `Hello. I can answer general questions about ${site.name} — our practice areas, office hours and how to get in touch.`;

export function ChatWidget() {
  const { isOpen, openChat, closeChat } = useChatUi();
  const [input, setInput] = useState("");
  const [degraded, setDegraded] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
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
  }, [messages, degraded, isBusy]);

  function submit() {
    const text = input.trim();
    if (!text || isBusy || degraded) return;
    setInput("");
    void sendMessage({ text: text.slice(0, MAX_INPUT_CHARS) });
  }

  if (!isOpen) {
    return (
      <Button
        variant="primary"
        onClick={openChat}
        aria-label="Open the assistant"
        className="fixed right-5 bottom-5 z-40 shadow-[0_10px_30px_rgba(3,3,3,0.35)] md:right-8 md:bottom-8"
      >
        <ChatIcon className="size-5" />
        Ask a question
      </Button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Website assistant"
      aria-modal="false"
      className="fixed inset-x-0 bottom-0 z-40 flex max-h-[85dvh] flex-col border-t border-white/20 bg-navy text-text-on-dark shadow-[0_-10px_40px_rgba(3,3,3,0.45)] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:max-h-[min(36rem,85dvh)] sm:w-[26rem] sm:border md:right-8 md:bottom-8"
    >
      <header className="flex items-center justify-between border-b border-white/20 px-5 py-4">
        <div>
          <p className="type-h4">Ask {site.shortName}</p>
          <p className="type-xs text-text-muted-on-dark">
            General questions, answered quickly
          </p>
        </div>
        <button
          type="button"
          onClick={closeChat}
          aria-label="Close the assistant"
          className="-mr-2 inline-flex size-10 cursor-pointer items-center justify-center transition-opacity hover:opacity-70"
        >
          <CloseIcon className="size-5" />
        </button>
      </header>

      {/* Persistent privacy notice — required for a law firm. */}
      <p className="border-b border-white/20 bg-navy-deep px-5 py-3 type-xs text-text-muted-on-dark">
        {PRIVACY_NOTICE}
      </p>

      <div
        ref={logRef}
        className="flex-1 overflow-y-auto px-5 py-4"
        aria-live="polite"
        aria-atomic="false"
      >
        <ul className="flex flex-col gap-4">
          <li>
            <ChatBubble role="assistant">{GREETING}</ChatBubble>
          </li>

          {messages.map((message) => {
            const text = message.parts
              .filter((part) => part.type === "text")
              .map((part) => ("text" in part ? part.text : ""))
              .join("");
            if (!text) return null;
            return (
              <li key={message.id}>
                <ChatBubble
                  role={message.role === "user" ? "user" : "assistant"}
                >
                  {text}
                </ChatBubble>
              </li>
            );
          })}

          {isBusy && !degraded ? (
            <li>
              <ChatBubble role="assistant">
                <span className="sr-only">The assistant is replying</span>
                <span aria-hidden className="inline-flex gap-1">
                  <Dot delay="0ms" />
                  <Dot delay="150ms" />
                  <Dot delay="300ms" />
                </span>
              </ChatBubble>
            </li>
          ) : null}

          {degraded ? (
            <li>
              <div className="border border-white/20 bg-navy-deep p-4">
                <p className="type-small">
                  Our assistant is taking a break — you can reach us directly:
                </p>
                <div className="mt-3 flex flex-col items-start gap-4">
                  <a
                    href={site.phoneHref}
                    className="type-h4 underline underline-offset-4"
                  >
                    {site.phone}
                  </a>
                  <Button
                    href="/contact"
                    variant="primary-inverse"
                    onClick={closeChat}
                  >
                    Send a message
                  </Button>
                </div>
              </div>
            </li>
          ) : null}
        </ul>
      </div>

      <form
        className="border-t border-white/20 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="flex items-end gap-2">
          <label htmlFor="chat-input" className="sr-only">
            Your question
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            rows={2}
            value={input}
            maxLength={MAX_INPUT_CHARS}
            disabled={degraded}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            placeholder={
              degraded ? "Chat unavailable" : "Ask a general question…"
            }
            className="min-h-11 flex-1 resize-none border border-white/20 bg-transparent px-3 py-2 type-small text-text-on-dark placeholder:text-text-muted-on-dark focus:border-text-on-dark focus:outline-none disabled:opacity-50"
          />
          <Button
            type="submit"
            variant="primary-inverse"
            disabled={isBusy || degraded || input.trim().length === 0}
            aria-label="Send message"
            className="size-11 shrink-0 px-0"
          >
            <SendIcon className="size-5" />
          </Button>
        </div>
        <p className="mt-2 type-xs text-text-muted-on-dark">
          {input.length}/{MAX_INPUT_CHARS}
        </p>
      </form>
    </div>
  );
}

function ChatBubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  const isUser = role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={`max-w-[85%] px-3.5 py-2.5 type-small whitespace-pre-wrap ${
          isUser
            ? "bg-button-light text-text-on-light"
            : "border border-white/20 bg-navy-deep text-text-on-dark"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block size-1.5 animate-pulse bg-text-muted-on-dark"
      style={{ animationDelay: delay }}
    />
  );
}
