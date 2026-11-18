import { stegaClean } from "next-sanity";

import type { SchemaObject } from "@/lib/structured-data";

/**
 * Renders one or more JSON-LD blocks as <script type="application/ld+json">.
 * Server-only — the objects are serialised at render time so the structured
 * data is present in the initial HTML for crawlers. Values are cleaned of the
 * live preview's click-to-edit markers, which must never reach JSON-LD.
 */
export function JsonLd({ schema }: { schema: SchemaObject | SchemaObject[] }) {
  const blocks = Array.isArray(schema) ? schema : [schema];
  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(stegaClean(block)) }}
        />
      ))}
    </>
  );
}
