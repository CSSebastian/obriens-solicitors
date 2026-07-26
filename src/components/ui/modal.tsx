"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { CloseIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { useMediaQuery } from "@/lib/use-media-query";

const EXIT_MS = 160;

const sizeClass = {
  form: "md:max-w-[34rem]",
  profile: "md:max-w-[42rem]",
} as const;

/**
 * The site's one modal shell — square-cornered, navy, refined.
 *
 * Structure is the signature: a tonal navy-deep header AND footer band frame a
 * navy body, so the primary action (in `footer`) stays pinned and reachable on
 * mobile while only the middle scrolls. Full-screen sheet on mobile, centred
 * card on desktop.
 *
 * Handles the mount/exit transition, focus trap + Esc + focus-return, backdrop
 * click, body-scroll-lock (shift-free via `scrollbar-gutter: stable`), and
 * reduced motion. Used by the contact modal and the team-profile modal.
 */
export function Modal({
  open,
  onClose,
  eyebrow,
  title,
  size = "form",
  footer,
  children,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow: string;
  title: ReactNode;
  size?: keyof typeof sizeClass;
  /** Pinned footer band (e.g. the submit button or a CTA). */
  footer?: ReactNode;
  children: ReactNode;
}) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  // `rendered` keeps the node mounted through the exit animation; `visible`
  // drives the CSS transition.
  const [rendered, setRendered] = useState(false);
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Mount immediately on open (adjust state during render, not in an effect).
  if (open && !rendered) setRendered(true);

  useEffect(() => {
    if (open) {
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
  }, [open, rendered, reduced]);

  // Focus trap + Esc + focus-return, active only while fully open.
  useFocusTrap(dialogRef, open && visible, onClose);

  // Lock body scroll while mounted.
  useEffect(() => {
    if (!rendered) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [rendered]);

  if (!rendered) return null;

  const shown = visible && open;

  return (
    <div className="fixed inset-0 z-[300] flex items-stretch justify-center md:items-center md:p-6">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className={cn(
          "absolute inset-0 cursor-default bg-navy-deep/80 transition-opacity duration-200 ease-out",
          shown ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative flex h-dvh w-full flex-col overflow-hidden bg-navy text-text-on-dark shadow-[0_30px_80px_rgba(3,3,3,0.55)] transition duration-200 ease-out md:h-auto md:max-h-[90dvh] md:w-full md:border md:border-line-on-dark",
          sizeClass[size],
          reduced
            ? ""
            : shown
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-0",
        )}
      >
        {/* Pinned header band (tonal step — the structural signature). */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line-on-dark bg-navy-deep px-6 py-5">
          <div>
            <p className="type-eyebrow text-text-muted-on-dark">{eyebrow}</p>
            <h2 id={titleId} className="type-h3 mt-1.5">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mt-1 -mr-2 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center border border-transparent transition-colors hover:border-line-on-dark/60 hover:bg-navy"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

        {/* Pinned footer band */}
        {footer ? (
          <div className="shrink-0 border-t border-line-on-dark bg-navy-deep px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
