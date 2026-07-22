"use client";

import { useEffect, useId, useRef, useState } from "react";

import { ContactForm } from "@/components/contact/contact-form";
import { CloseIcon } from "@/components/icons";
import { useContactModal } from "@/components/overlay/overlay-context";
import { site } from "@/content/site";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { useMediaQuery } from "@/lib/use-media-query";

const EXIT_MS = 160;

/**
 * Global contact modal. Mounted once in the root layout; opened from any
 * "get in touch" trigger via `useContactModal().openContact()`.
 *
 * The form itself is the shared <ContactForm> — identical to the /contact page.
 * Rectangle panel, navy tokens, focus trap + Esc + backdrop close, body scroll
 * lock (shift-free via `scrollbar-gutter: stable`), fade+rise entrance.
 */
export function ContactModal() {
  const { isOpen, closeContact } = useContactModal();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  // `rendered` keeps the node mounted through the exit animation; `visible`
  // drives the CSS transition.
  const [rendered, setRendered] = useState(false);
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Mount immediately on open (adjust state during render, not in an effect).
  if (isOpen && !rendered) setRendered(true);

  useEffect(() => {
    if (isOpen) {
      // Next frame so the entrance transition runs from the initial state.
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    if (!rendered) return;
    const raf = requestAnimationFrame(() => setVisible(false));
    // Unmount after the exit animation (instant under reduced motion).
    const timer = setTimeout(() => setRendered(false), reduced ? 0 : EXIT_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [isOpen, rendered, reduced]);

  // Focus trap + Esc + focus-return, active only while fully open.
  useFocusTrap(dialogRef, isOpen && visible, closeContact);

  // Lock body scroll while open. `scrollbar-gutter: stable` (globals.css) keeps
  // this shift-free.
  useEffect(() => {
    if (!rendered) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [rendered]);

  if (!rendered) return null;

  const shown = visible && isOpen;

  return (
    <div className="fixed inset-0 z-[300] flex items-stretch justify-center md:items-center md:p-6">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close contact form"
        tabIndex={-1}
        onClick={closeContact}
        className={`absolute inset-0 cursor-default bg-navy-deep/70 transition-opacity duration-200 ease-out ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative flex h-dvh w-full flex-col border-line-on-dark bg-navy text-text-on-dark shadow-[0_24px_70px_rgba(3,3,3,0.5)] transition duration-200 ease-out md:h-auto md:max-h-[90dvh] md:w-full md:max-w-[34rem] md:border ${
          reduced
            ? ""
            : shown
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-0"
        }`}
      >
        {/* Pinned header row */}
        <div className="flex items-start justify-between gap-4 border-b border-line-on-dark px-6 py-5">
          <div>
            <p className="type-eyebrow">Write</p>
            <h2 id={titleId} className="type-h3 mt-1">
              Send your message
            </h2>
          </div>
          <button
            type="button"
            onClick={closeContact}
            aria-label="Close"
            className="-mt-1 -mr-2 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center transition-opacity hover:opacity-70"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        {/* Scrollable form area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <p className="type-small mb-6 text-text-muted-on-dark">
            Send us more information and we&rsquo;ll be in touch.
          </p>

          <ContactForm />

          {/* Compact alternative so nobody is trapped in the form. */}
          <div className="mt-8 border-t border-line-on-dark pt-5">
            <p className="type-xs text-text-muted-on-dark">
              Prefer to reach us directly?
            </p>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 type-small">
              <a
                href={site.phoneHref}
                className="underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {site.phone}
              </a>
              <a
                href={site.emailHref}
                className="break-all underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {site.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
