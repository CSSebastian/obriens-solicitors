"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { homeSectionIds } from "@/content/home-sections";
import {
  HEADER_OFFSET,
  inPageTarget,
  isScrollLocked,
  slowScrollTo,
} from "@/lib/smooth-scroll";
import { useActiveSection } from "@/lib/use-active-section";

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scroll to an element once any body-scroll lock (mobile menu / modal) has been
 * released — the menu closes via React state a tick after the click, so we wait
 * a few frames for `overflow:hidden` to clear before animating. Resolves when
 * the scroll has settled.
 */
function scrollWhenUnlocked(el: HTMLElement, reduced: boolean): Promise<void> {
  return new Promise((resolve) => {
    let tries = 0;
    const attempt = () => {
      if (!isScrollLocked()) {
        // One more frame so the menu's focus-return / layout settles first —
        // otherwise it can yank the scroll back before ours starts.
        requestAnimationFrame(() => {
          slowScrollTo(el, reduced).then(resolve);
        });
        return;
      }
      // Generous cap (~2.5s) so a slow menu close never makes us scroll while
      // the body is still locked (which the browser would block). Real closes
      // take a frame or two; this only matters under heavy main-thread load.
      if (tries++ > 150) {
        slowScrollTo(el, reduced).then(resolve);
        return;
      }
      requestAnimationFrame(attempt);
    };
    attempt();
  });
}

/** Write a hash (or clear it) without adding a history entry or jumping. */
function replaceHash(hash: string) {
  const { pathname, search } = window.location;
  window.history.replaceState(null, "", `${pathname}${search}${hash}`);
}

/**
 * Site-wide smooth in-page scrolling and URL-hash bookkeeping. Mounted once in
 * the root layout.
 *
 * A single delegated click interceptor (capture phase, so Next's <Link> sees
 * `defaultPrevented` and skips its own navigation) eases to any in-page anchor
 * target. A separate effect resolves an incoming hash on the home page — e.g.
 * arriving at `/#family-law` from a deep page — after paint, so the header
 * offset lands correctly.
 *
 * The hash is owned by what is on screen, not by what was clicked:
 *
 *  • On the home page a scroll-spy over every section (in page order, from
 *    home-sections.ts) keeps the hash naming the section actually in view, and
 *    clears it above the first section. Previously the hash was only ever
 *    written on click, so scrolling away left the URL stuck on the last thing
 *    clicked.
 *  • A click writes its target hash only once the eased scroll has ARRIVED, and
 *    the spy is held off in the meantime. Writing it up front is what left the
 *    URL reading `#family-law` for two seconds while Conveyancing and Estate
 *    planning slid past.
 *
 * Everything is instant under `prefers-reduced-motion`.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // True while one of our own scrolls is in flight — the spy must not rewrite
  // the hash to each section we pass through on the way.
  const [scrolling, setScrolling] = useState(false);
  // Identifies the current scroll so a superseded one can't clear the flag or
  // write its hash after a newer click has taken over.
  const scrollId = useRef(0);

  const activeSection = useActiveSection(homeSectionIds, isHome);

  /** Run an eased scroll, suppressing hash sync until it lands. */
  const runScroll = useCallback(
    (scroll: (reduced: boolean) => Promise<void>, onArrive?: () => void) => {
      const id = ++scrollId.current;
      setScrolling(true);
      scroll(prefersReduced()).then(() => {
        if (scrollId.current !== id) return;
        onArrive?.();
        setScrolling(false);
      });
    },
    [],
  );

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

      const hash = `#${target.id}`;
      runScroll(
        (reduced) => scrollWhenUnlocked(target, reduced),
        () => {
          // A history entry, so Back undoes the jump — but only now that the
          // section is actually on screen.
          if (window.location.hash !== hash) {
            window.history.pushState(null, "", hash);
          }
        },
      );
    };

    // Capture phase: run before <Link>'s own handler so it bails out.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [runScroll]);

  // Resolve an incoming hash on the home page (deep-page link or a fresh load
  // of /#section) — after paint, applying the header offset.
  useEffect(() => {
    if (!isHome) return;
    const { hash } = window.location;
    if (!hash || hash.length < 2) return;

    let target: HTMLElement | null = null;
    try {
      target = document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch {
      target = null;
    }
    if (!target) return;

    const element = target;
    const frame = requestAnimationFrame(() =>
      // Suppressed the same way as a click: we start at the top of the page, so
      // without this the spy would strip the incoming hash before we arrive.
      runScroll((reduced) => slowScrollTo(element, reduced, HEADER_OFFSET)),
    );
    return () => cancelAnimationFrame(frame);
  }, [isHome, runScroll]);

  // Keep the hash on the section actually in view. `scrolling` is a dependency
  // so this re-runs the moment a scroll of ours lands, syncing to wherever we
  // ended up (including back-to-top, which clears the hash).
  useEffect(() => {
    if (!isHome || scrolling) return;
    const hash = activeSection ? `#${activeSection}` : "";
    if (window.location.hash === hash) return;
    replaceHash(hash);
  }, [isHome, scrolling, activeSection]);

  return null;
}
