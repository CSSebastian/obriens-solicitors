"use client";

import { useEffect, useState } from "react";

/**
 * Track which of the given section ids is currently centred in the viewport,
 * for the nav active-section indicator. Uses a thin IntersectionObserver band
 * across the viewport middle (no scroll-position reads), so it stays cheap.
 * Returns null until a section is active, and while `enabled` is false.
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

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // A ~12%-tall detection band across the viewport middle.
      { rootMargin: "-44% 0px -44% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  // Gate at the return so we never set state synchronously when disabled.
  return enabled ? active : null;
}
