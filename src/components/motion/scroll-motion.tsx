"use client";

import { useEffect } from "react";

/**
 * GSAP-driven scroll choreography for the home page: subtle image parallax.
 *
 * GSAP + ScrollTrigger are dynamically imported so they stay in their own chunk
 * (never in the initial bundle) and only load where this is mounted — the home
 * page.
 *
 * The whole thing is gated on `lg` AND `prefers-reduced-motion: no-preference`,
 * so parallax is disabled on touch/small screens and under reduced
 * motion. Rather than rely on `gsap.matchMedia` (its media-query `change`
 * listener can be unreliable), we build/teardown explicitly on `resize` and on
 * reduced-motion changes via a `gsap.context`, so every ScrollTrigger, pin
 * spacer and inline style is reverted cleanly when the breakpoint is crossed or
 * the component unmounts.
 */
export function ScrollMotion() {
  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const desktop = window.matchMedia("(min-width: 1024px)");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const shouldRun = () => desktop.matches && !reduced.matches;

      let ctx: { revert: () => void } | null = null;

      const build = () => {
        if (ctx) return;
        ctx = gsap.context(() => {
          // Subtle image parallax — the image drifts ~12% slower than scroll.
          // The wrapper clips (overflow-hidden); the inner is scaled up so the
          // drift never exposes an edge.
          const wraps = gsap.utils.toArray<HTMLElement>("[data-parallax]");
          for (const wrap of wraps) {
            const inner = wrap.firstElementChild as HTMLElement | null;
            if (!inner) continue;
            gsap.set(inner, { scale: 1.14, transformOrigin: "center center" });
            gsap.fromTo(
              inner,
              { yPercent: -6 },
              {
                yPercent: 6,
                ease: "none",
                scrollTrigger: {
                  trigger: wrap,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          }
        });
      };

      const teardown = () => {
        ctx?.revert();
        ctx = null;
      };

      const sync = () => {
        if (shouldRun()) build();
        else teardown();
        ScrollTrigger.refresh();
      };

      let resizeTimer = 0;
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(sync, 180);
      };

      sync();
      window.addEventListener("resize", onResize);
      reduced.addEventListener("change", sync);

      cleanup = () => {
        window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);
        reduced.removeEventListener("change", sync);
        teardown();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}
