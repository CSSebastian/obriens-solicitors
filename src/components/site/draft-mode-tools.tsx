import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";

import { DisableDraftMode } from "@/components/site/disable-draft-mode";

/**
 * Click-to-edit overlays for the Studio's live preview. Renders nothing for
 * normal visitors — only when the Studio has switched on draft mode.
 */
export async function DraftModeTools() {
  if (!(await draftMode()).isEnabled) return null;
  return (
    <>
      <VisualEditing />
      <DisableDraftMode />
    </>
  );
}
