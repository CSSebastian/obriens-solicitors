/**
 * Eased in-page scrolling, ported from the Riverglen prototype.
 *
 * The easing curve and duration behaviour match it exactly: a quartic
 * ease-in-out over a distance-proportional duration clamped to 1.1–2.4s.
 * Under `prefers-reduced-motion` it jumps instantly with no animation.
 */

/** Header offset for scroll targets — matches the sections' `scroll-mt-24`. */
export const HEADER_OFFSET = 96;

/** Quartic ease-in-out (Riverglen's curve). */
const easeInOutQuart = (t: number): number =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

/**
 * Eased scroll to an element, offset for the sticky header. Instant when
 * `reduced` is true. Each frame recomputes from the live position, so it stays
 * correct even if layout shifts mid-scroll.
 */
export function slowScrollTo(
  el: Element,
  reduced: boolean,
  offset = HEADER_OFFSET,
): void {
  const startY = window.scrollY;
  const targetY = Math.max(
    0,
    el.getBoundingClientRect().top + startY - offset,
  );

  if (reduced) {
    window.scrollTo(0, targetY);
    return;
  }

  const dist = targetY - startY;
  if (dist === 0) return;
  const dur = Math.min(2400, Math.max(1100, Math.abs(dist) * 1.15));
  const t0 = performance.now();

  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / dur);
    window.scrollTo({ top: startY + dist * easeInOutQuart(p), behavior: "auto" });
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/**
 * Resolve a link `href` to an in-page target element on the CURRENT page.
 * Accepts `#id` anywhere, and `/#id` only when we're already on the home page
 * (from a deep page, `/#id` is a real navigation, handled on load instead).
 *
 * Uses getElementById (not querySelector) so ids containing React's useId
 * colons — e.g. the FAQ section ids — never throw an invalid-selector error.
 */
export function inPageTarget(href: string): HTMLElement | null {
  let rawId: string | null = null;
  if (href.startsWith("#")) rawId = href.slice(1);
  else if (href.startsWith("/#") && window.location.pathname === "/")
    rawId = href.slice(2);
  if (!rawId) return null;
  try {
    return document.getElementById(decodeURIComponent(rawId));
  } catch {
    return null;
  }
}

/** True while body scroll is locked (mobile menu / modal open). */
export function isScrollLocked(): boolean {
  return getComputedStyle(document.body).overflow === "hidden";
}
