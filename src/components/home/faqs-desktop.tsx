"use client";

import { useEffect, useRef, useState } from "react";

import type { Faq } from "@/content/site";
import { useMediaQuery } from "@/lib/use-media-query";

/** Fraction of the viewport height where the trigger band sits. */
const BAND_FRACTION = 0.35;
/** How the index label reads at rest vs. when its section is active. */
const REST_OPACITY = 0.4;

const twoDigit = (n: number) => String(n + 1).padStart(2, "0");
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Desktop (lg+) FAQ: a sticky left index whose rows swap label/number in a
 * scroll-linked, continuous handoff driven by each right-hand section's
 * position. Behaviour only — replicated, not copied.
 *
 * The section renders BOTH this and the mobile accordion via CSS visibility;
 * the scroll machinery here only attaches when the lg media query matches, so
 * it is completely inert on mobile.
 */
export function FaqsDesktop({
  faqs,
  sectionIdPrefix,
}: {
  faqs: Faq[];
  sectionIdPrefix: string;
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const [activeIndex, setActiveIndex] = useState(0);

  // Right-column section header rows (the measurement anchors).
  const headerRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Left-index moving spans + their row container (for width measurement).
  const rowInnerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Slide distances, recomputed on mount + resize so the frame loop only reads
  // header positions (never element widths) — no thrash during scroll.
  const slideRef = useRef<{ label: number; number: number }[]>([]);

  const sectionId = (i: number) => `${sectionIdPrefix}-section-${i}`;

  useEffect(() => {
    if (!isDesktop) return;

    let frame = 0;
    let queued = false;

    const measure = () => {
      slideRef.current = faqs.map((_, i) => {
        const inner = rowInnerRefs.current[i];
        const label = labelRefs.current[i];
        const number = numberRefs.current[i];
        if (!inner || !label || !number) return { label: 0, number: 0 };
        const innerWidth = inner.clientWidth;
        return {
          label: Math.max(0, innerWidth - label.offsetWidth),
          number: Math.max(0, innerWidth - number.offsetWidth),
        };
      });
    };

    const render = () => {
      queued = false;
      const band = window.innerHeight * BAND_FRACTION;
      // Shorter than the section gap so a swap completes within one section's
      // scroll, but wide enough to stay smooth. Tightened alongside the 20vh
      // inter-section gap.
      const ramp = Math.min(150, window.innerHeight * 0.16);

      // READ phase — batch every layout read before any write.
      const arrivals = headerRefs.current.map((el) => {
        if (!el) return 0;
        const top = el.getBoundingClientRect().top;
        // Ramp of width `ramp` centred on the band: 0.5 when the header sits
        // exactly on the band, 1 once it has passed above it.
        return clamp01((band - top) / ramp + 0.5);
      });

      // activeness_i = arrival_i - arrival_{i+1}. The last section has no
      // successor, so it stays active once passed.
      let maxActiveness = -1;
      let maxIndex = 0;
      const activeness = arrivals.map((arrival, i) => {
        const next = i + 1 < arrivals.length ? arrivals[i + 1] : 0;
        const value = clamp01(arrival - next);
        if (value > maxActiveness) {
          maxActiveness = value;
          maxIndex = i;
        }
        return value;
      });

      // WRITE phase.
      for (let i = 0; i < activeness.length; i += 1) {
        const eased = easeOutCubic(activeness[i]);
        const label = labelRefs.current[i];
        const number = numberRefs.current[i];
        const slide = slideRef.current[i] ?? { label: 0, number: 0 };
        const opacity = String(REST_OPACITY + (1 - REST_OPACITY) * eased);

        if (label) {
          label.style.opacity = opacity;
          label.style.transform = reducedMotion
            ? "none"
            : `translateX(${(eased * slide.label).toFixed(2)}px)`;
        }
        if (number) {
          number.style.opacity = opacity;
          number.style.transform = reducedMotion
            ? "none"
            : `translateX(${(-eased * slide.number).toFixed(2)}px)`;
        }
      }

      setActiveIndex((prev) => (prev === maxIndex ? prev : maxIndex));
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(render);
    };

    measure();
    render();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      measure();
      render();
    });
    for (const inner of rowInnerRefs.current) {
      if (inner) resizeObserver.observe(inner);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      resizeObserver.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [isDesktop, reducedMotion, faqs]);

  return (
    <div className="mt-16 hidden gap-12 lg:grid lg:grid-cols-[2fr_3fr]">
      {/* Left — sticky index ------------------------------------------- */}
      <nav
        aria-label="FAQ index"
        className="self-start lg:sticky lg:top-24"
      >
        <ul className="border-t border-line-on-light">
          {faqs.map((faq, i) => (
            <li key={faq.question} className="border-b border-line-on-light">
              <a
                href={`#${sectionId(i)}`}
                aria-current={activeIndex === i ? "true" : undefined}
                className="block py-5 focus-visible:outline-2"
              >
                <span
                  ref={(node) => {
                    rowInnerRefs.current[i] = node;
                  }}
                  className="relative block overflow-hidden"
                >
                  <span
                    ref={(node) => {
                      labelRefs.current[i] = node;
                    }}
                    className="inline-block font-sans text-xs font-medium tracking-[0.14em] uppercase whitespace-nowrap [will-change:transform]"
                    style={{ opacity: REST_OPACITY }}
                  >
                    {faq.question}
                  </span>
                  <span
                    ref={(node) => {
                      numberRefs.current[i] = node;
                    }}
                    aria-hidden="true"
                    className="absolute top-0 right-0 font-sans text-xs font-medium tracking-[0.14em] tabular-nums [will-change:transform]"
                    style={{ opacity: REST_OPACITY }}
                  >
                    {twoDigit(i)}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Right — content sections -------------------------------------- */}
      <div>
        {faqs.map((faq, i) => (
          <section
            key={faq.question}
            id={sectionId(i)}
            aria-labelledby={`${sectionId(i)}-label`}
            className="scroll-mt-24 [&:not(:first-child)]:mt-[20vh]"
          >
            <div
              ref={(node) => {
                headerRefs.current[i] = node;
              }}
              className="flex items-baseline justify-between gap-6 border-b border-line-on-light pb-4"
            >
              <h3
                id={`${sectionId(i)}-label`}
                className="font-sans text-sm font-medium tracking-[0.14em] uppercase"
              >
                {faq.question}
              </h3>
              <span className="font-sans text-sm font-medium tracking-[0.14em] tabular-nums text-text-muted-on-light">
                {twoDigit(i)}
              </span>
            </div>
            <div className="mt-6 flex max-w-2xl flex-col gap-5">
              {faq.answer.map((paragraph, pIndex) => (
                <p
                  key={pIndex}
                  className="font-serif text-lg leading-[1.7] text-text-muted-on-light xl:text-xl"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
