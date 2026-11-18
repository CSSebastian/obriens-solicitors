import { vercelProtectionBypassTool } from "@sanity/vercel-protection-bypass";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { canEditLocked, isFixedList, isLocked, withLocks } from "./lock";
import { resolve } from "./presentation";
import { SINGLETONS, schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

const singletons = new Set<string>(SINGLETONS);

export default defineConfig({
  name: "default",
  title: "O'Briens Solicitors",
  projectId: "p0i7hr40",
  dataset: "production",

  plugins: [
    presentationTool({
      title: "Live preview",
      resolve,
      previewUrl: {
        // The live site. Switch to https://www.obriens-solicitors.com once that
        // domain is connected to the Vercel project.
        origin:
          process.env.SANITY_STUDIO_PREVIEW_ORIGIN ||
          "https://obriens-solicitors.vercel.app",
        previewMode: { enable: "/api/draft-mode/enable" },
      },
    }),
    structureTool({ title: "Content", structure }),
    visionTool(),
    // Lets the live preview through Vercel's login wall while the site is
    // private. Set up once from the Studio's "Vercel Protection Bypass" tool.
    vercelProtectionBypassTool(),
  ],

  schema: {
    types: withLocks(schemaTypes),
    // Singletons can't be created from the "new document" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.has(schemaType)),
  },

  document: {
    actions: (actions, { schemaType, currentUser }) => {
      // Locked sections: no publish, delete or duplicate for the client.
      if (isLocked(schemaType) && !canEditLocked(currentUser)) return [];
      // Fixed lists: the client can edit and publish, not delete or duplicate.
      if (isFixedList(schemaType) && !canEditLocked(currentUser)) {
        return actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action));
      }
      // Singletons can't be duplicated or deleted.
      return singletons.has(schemaType)
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : actions;
    },
    // The client can't create new documents in locked sections.
    newDocumentOptions: (options, { currentUser }) =>
      canEditLocked(currentUser) ? options : options.filter((item) => !isLocked(item.templateId) && !isFixedList(item.templateId)),
  },
});
