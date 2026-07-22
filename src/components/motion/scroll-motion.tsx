"use client";

import { useEffect } from "react";

/**
 * GSAP-driven scroll choreography for the home page: subtle image parallax and
 * the single pinned "What sets us apart" moment.
 *
 * GSAP + ScrollTrigger are dynamically imported so they stay in their own chunk
 * (never in the initial bundle) and only load where this is mounted — the home
 * page.
 *
 * The whole thing is gated on `lg` AND `prefers-reduced-motion: no-preference`,
 * so parallax and pinning are disabled on touch/small screens and under reduced
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

          // The one pinned moment: "What sets us apart" holds briefly while its
          // two points advance in, then releases.
          //
          // We pin the inner [data-why-pin] band, NOT the #why <section> React
          // owns. GSAP wraps whatever it pins in a `.pin-spacer` div (it always
          // re-parents the pinned node — `pinSpacing: false` doesn't avoid it),
          // so pinning the section moves it out from under <main>; React's
          // unmount then throws `removeChild` because the section is no longer a
          // child of the parent it recorded. Pinning the inner band keeps that
          // re-parenting *inside* #why, so #why never moves and React can always
          // remove it cleanly on navigation. `ctx.revert()` below is still the
          // tidy teardown, but correctness no longer depends on it winning the
          // race against React's synchronous unmount.
          const why = document.getElementById("why");
          const band = why?.querySelector<HTMLElement>("[data-why-pin]") ?? null;
          const cards = gsap.utils.toArray<HTMLElement>("[data-why-card]");
          if (band && cards.length) {
            gsap.set(cards, { opacity: 0, y: 56 });
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: band,
                start: "top top",
                end: "+=70%",
                pin: band,
                pinSpacing: true,
                scrub: 0.6,
                anticipatePin: 1,
              },
            });
            cards.forEach((card, index) => {
              tl.to(
                card,
                { opacity: 1, y: 0, ease: "power2.out", duration: 1 },
                index * 0.5,
              );
            });
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
