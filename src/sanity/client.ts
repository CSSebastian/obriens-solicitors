import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/env";

/**
 * Values that drive logic (ids, links, icon names, CSS) must never carry the
 * invisible click-to-edit markers the live preview adds to text, or lookups
 * and comparisons would fail. Everything else is left to Sanity's default
 * filter (which already skips URLs, dates and the like).
 */
const NOT_EDITABLE = new Set([
  "slug",
  "id",
  "href",
  "icon",
  "tilePadding",
  "position",
  "src",
  "practiceAreas",
  "category",
  "phone",
  "email",
  "postalCode",
]);

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: {
    studioUrl,
    filter: (props) => {
      const key = props.sourcePath.at(-1);
      if (typeof key === "string" && NOT_EDITABLE.has(key)) return false;
      // Slugs of referenced practice areas sit one level deeper.
      if (props.sourcePath.includes("slug")) return false;
      return props.filterDefault(props);
    },
  },
});
