"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

export const turnstileSiteKey =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

/**
 * Cloudflare Turnstile. Renders nothing when no site key is configured, so
 * local development works without Cloudflare credentials — the API route skips
 * verification in the same case.
 */
export function Turnstile({
  onToken,
  resetSignal,
}: {
  onToken: (token: string) => void;
  /** Increment to force the widget to issue a fresh token. */
  resetSignal: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!turnstileSiteKey || !scriptReady) return;
    const container = containerRef.current;
    if (!container || !window.turnstile) return;

    widgetIdRef.current = window.turnstile.render(container, {
      sitekey: turnstileSiteKey,
      theme: "dark",
      callback: onToken,
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
    });

    const widgetId = widgetIdRef.current;
    return () => {
      if (widgetId) window.turnstile?.remove(widgetId);
      widgetIdRef.current = null;
    };
  }, [scriptReady, onToken]);

  useEffect(() => {
    if (resetSignal === 0) return;
    if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
  }, [resetSignal]);

  if (!turnstileSiteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onReady={() => setScriptReady(true)}
      />
      <div ref={containerRef} />
    </>
  );
}
