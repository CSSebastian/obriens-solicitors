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
      {/* The preview adds ~1,000 invisible edit-marker characters after each
          piece of text. Firefox applies letter-spacing to them, so headings
          with negative tracking get pushed sideways. Preview only. */}
      <style>{`.type-display,.type-h2,.type-h3{letter-spacing:normal!important}`}</style>
      <VisualEditing />
      <DisableDraftMode />
    </>
  );
}
