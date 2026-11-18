import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

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
        origin:
          process.env.SANITY_STUDIO_PREVIEW_ORIGIN ||
          "https://www.obriens-solicitors.com",
        previewMode: { enable: "/api/draft-mode/enable" },
      },
    }),
    structureTool({ title: "Content", structure }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "new document" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.has(schemaType)),
  },

  document: {
    // Singletons can't be duplicated or deleted.
    actions: (actions, { schemaType }) =>
      singletons.has(schemaType)
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : actions,
  },
});
