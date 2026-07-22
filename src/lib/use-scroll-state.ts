"use client";

import { useEffect, useState } from "react";

/** Scroll offset past which the header collapses into its floating box. */
const SCROLLED_THRESHOLD = 24;

/**
 * rAF-throttled scroll state driving the header morph.
 * Ported from the Riverglen `useScrollState` (the `scrolled` half — O'Briens
 * has no StickyBar, so the `pastHero` flag is not needed).
 */
export function useScrollState(): { scrolled: boolean } {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const next = window.scrollY > SCROLLED_THRESHOLD;
        setScrolled((prev) => (prev === next ? prev : next));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return { scrolled };
}
