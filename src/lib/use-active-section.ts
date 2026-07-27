"use client";

import { useEffect, useState } from "react";

/**
 * Track which section the viewport is currently on, for the nav active-section
 * indicator and the URL hash.
 *
 * `ids` MUST be in page order (pass `homeSectionIds` from
 * src/content/home-sections.ts) — the resolver walks the list top to bottom.
 *
 * The section is resolved geometrically: the one containing a horizontal line
 * across the viewport middle. Two earlier approaches failed here and are worth
 * not repeating:
 *
 *  • Taking `entry.target.id` from whichever IntersectionObserver entry arrived
 *    last is non-deterministic — a fast scroll batches several entries into one
 *    callback, in no particular order.
 *  • Resolving geometry, but only when an IntersectionObserver fires, is off by
 *    one. IO fires when a section STARTS intersecting its band, not while it
 *    keeps intersecting, so a scroll that settles inside the band leaves the
 *    answer frozen at the moment of crossing — one section behind.
 *
 * So the trigger is a rAF-throttled scroll listener (matching `useScrollState`):
 * one layout read of N section rects per animation frame while scrolling, which
 * is cheap and, unlike IO, cannot miss a change.
 *
 * Between bands (the gaps in the page's vertical rhythm) the last section above
 * the line stays active, so the indicator doesn't flicker off. Above the first
 * section — the hero — the result is null. The GSAP-pinned "why" section is
 * handled correctly for free: its pin spacer keeps the element's rect spanning
 * the whole pinned range.
 *
 * Returns null while `enabled` is false.
 */
export function useActiveSection(
  ids: string[],
  enabled: boolean,
): string | null {
  const key = ids.join(",");
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!elements.length) return;

    if (
      process.env.NODE_ENV !== "production" &&
      elements.length !== ids.length
    ) {
      const missing = ids.filter((id) => !document.getElementById(id));
      console.warn(
        `[use-active-section] no element for section id(s): ${missing.join(", ")}`,
      );
    }

    const resolve = () => {
      const line = window.innerHeight / 2;
      let current: string | null = null;
      for (const el of elements) {
        const { top, bottom } = el.getBoundingClientRect();
        // The line sits inside this section — done, it's the active one.
        if (top <= line && bottom > line) {
          current = el.id;
          break;
        }
        // Otherwise remember the last section entirely above the line, so the
        // gaps between bands hold the previous section rather than going blank.
        if (bottom <= line) current = el.id;
      }
      setActive((previous) => (previous === current ? previous : current));
    };

    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        resolve();
      });
    };

    window.addEventListener("scroll", schedule, { passive: true });
    // Layout can also move under a still viewport — a resize, a font swap, the
    // GSAP pin spacer being built.
    window.addEventListener("resize", schedule);
    resolve();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  // Gate at the return so we never set state synchronously when disabled.
  return enabled ? active : null;
}
