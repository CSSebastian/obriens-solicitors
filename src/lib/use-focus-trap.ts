"use client";

import { useEffect, useRef, type RefObject } from "react";

// Candidate focusable elements; the filtering below does the real work.
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "[tabindex]",
].join(",");

function isFocusable(el: HTMLElement): boolean {
  if (el.tabIndex < 0) return false;
  if (el.hasAttribute("disabled")) return false;
  if (el.closest('[aria-hidden="true"]')) return false;
  if (
    el.offsetWidth <= 0 &&
    el.offsetHeight <= 0 &&
    el.getClientRects().length === 0
  )
    return false;
  return true;
}

/**
 * Trap focus inside an open dialog.
 *
 * - Moves focus into the dialog when it opens.
 * - Cycles Tab / Shift+Tab within it.
 * - Restores focus to the trigger on close.
 * - Closes on Escape via `onEscape`.
 *
 * Ported from the Riverglen `useFocusTrap`. Call it unconditionally, above any
 * `if (!open) return null` — `active` gates the behaviour.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  onEscape?: () => void,
) {
  // Held in a ref so an inline `() => onClose()` doesn't re-run the effect and
  // yank focus back to the first element mid-Tab.
  const escapeRef = useRef(onEscape);
  useEffect(() => {
    escapeRef.current = onEscape;
  });

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter(isFocusable);

    const first = focusables()[0];
    if (first) {
      first.focus();
    } else {
      container.setAttribute("tabindex", "-1");
      container.focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && escapeRef.current) {
        escapeRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;
      const outside = !activeEl || !container.contains(activeEl);

      if (event.shiftKey) {
        if (outside || activeEl === firstEl) {
          event.preventDefault();
          lastEl.focus();
        }
      } else if (outside || activeEl === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [active, containerRef]);
}
