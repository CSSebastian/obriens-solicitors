"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  HEADER_OFFSET,
  inPageTarget,
  isScrollLocked,
  slowScrollTo,
} from "@/lib/smooth-scroll";

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scroll to an element once any body-scroll lock (mobile menu / modal) has been
 * released — the menu closes via React state a tick after the click, so we wait
 * a few frames for `overflow:hidden` to clear before animating.
 */
function scrollWhenUnlocked(el: HTMLElement, reduced: boolean) {
  if (!isScrollLocked()) {
    slowScrollTo(el, reduced);
    return;
  }
  let tries = 0;
  const wait = () => {
    if (!isScrollLocked() || tries++ > 30) {
      slowScrollTo(el, reduced);
      return;
    }
    requestAnimationFrame(wait);
  };
  requestAnimationFrame(wait);
}

/**
 * Site-wide smooth in-page scrolling. Mounted once in the root layout.
 *
 * A single delegated click interceptor (capture phase, so Next's <Link> sees
 * `defaultPrevented` and skips its own navigation) eases to any in-page anchor
 * target and updates the URL hash without a jump. A separate effect resolves an
 * incoming hash on the home page — e.g. arriving at `/#family-law` from a deep
 * page — after paint, so the header offset lands correctly.
 *
 * Everything is instant under `prefers-reduced-motion`.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Ignore modified clicks (new tab, etc.) and already-handled events.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank") return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const target = inPageTarget(href);
      if (!target) return;

      event.preventDefault();
      scrollWhenUnlocked(target, prefersReduced());

      const hash = `#${target.id}`;
      if (window.location.hash !== hash) {
        window.history.pushState(null, "", hash);
      }
    };

    // Capture phase: run before <Link>'s own handler so it bails out.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Resolve an incoming hash on the home page (deep-page link or a fresh load
  // of /#section) — after paint, applying the header offset.
  useEffect(() => {
    if (pathname !== "/") return;
    const { hash } = window.location;
    if (!hash || hash.length < 2) return;

    let target: HTMLElement | null = null;
    try {
      target = document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch {
      target = null;
    }
    if (!target) return;

    const frame = requestAnimationFrame(() =>
      slowScrollTo(target, prefersReduced(), HEADER_OFFSET),
    );
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
