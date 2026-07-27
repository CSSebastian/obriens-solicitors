"use client";

import { useEffect, useState } from "react";

import { ChevronUpIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { slowScrollTo } from "@/lib/smooth-scroll";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * Unobtrusive back-to-top control, fixed bottom-LEFT. The chat launcher owns the
 * bottom-right corner, so the two sit on opposite sides and never meet at any
 * width. Hidden by default; fades in once the visitor has scrolled past roughly
 * one viewport, fades out near the top. Clicking eases to the top with the
 * site's `slowScrollTo` (an instant jump under reduced motion).
 *
 * The scroll listener is passive and read-only, so it does not interfere with
 * the GSAP pin or the FAQ scroll interaction.
 */
export function BackToTop() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const next = window.scrollY > window.innerHeight;
        setVisible((prev) => (prev === next ? prev : next));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-5 z-40 transition-opacity duration-200 ease-out md:bottom-[max(2rem,env(safe-area-inset-bottom))] md:left-8",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <Button
        variant="primary"
        size="icon"
        aria-label="Back to top"
        aria-hidden={visible ? undefined : true}
        tabIndex={visible ? undefined : -1}
        onClick={() => slowScrollTo(document.body, reduced, 0)}
        className="border border-white/25 shadow-[0_12px_32px_rgba(3,3,3,0.32)]"
      >
        <ChevronUpIcon className="size-5" aria-hidden />
      </Button>
    </div>
  );
}
