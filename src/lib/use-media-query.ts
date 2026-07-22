"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Media query as a React value.
 *
 * useSyncExternalStore rather than useState + useEffect: it avoids a
 * setState-in-effect cascade, and gives a defined server snapshot so the
 * markup is stable through hydration.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  // The server can't know the viewport; visibility is driven by CSS, and the
  // scroll behaviour only ever attaches on the client.
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
