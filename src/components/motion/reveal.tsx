"use client";

import {
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * Fade + rise reveal, driven by IntersectionObserver + a CSS transition
 * (see globals.css `[data-reveal]`). Reveals once, then stops observing.
 *
 * Cheap and no-JS-safe: the hidden baseline lives in CSS behind a
 * `prefers-reduced-motion: no-preference` query with a <noscript> override, so
 * content is always visible when motion is reduced or JS is off. Under reduced
 * motion this reveals immediately without observing.
 *
 * `delay` (ms) staggers items within a group via `transition-delay`.
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
}: {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-revealed");
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
