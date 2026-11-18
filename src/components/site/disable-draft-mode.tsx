"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

/**
 * Shown when someone opens the site in preview mode outside the Studio (for
 * example from a shared preview link), so they can get back to the live site.
 */
export function DisableDraftMode() {
  // null while detecting; true inside the Studio, which has its own controls.
  if (useIsPresentationTool() !== false) return null;

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 left-4 z-50 bg-button-light px-4 py-2 type-small font-bold text-text-on-light shadow-lg"
    >
      Exit preview
    </a>
  );
}
