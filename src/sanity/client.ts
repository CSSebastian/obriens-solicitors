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

/**
 * Text the client can't change in the Studio (see studio/lock.ts) gets no
 * click-to-edit outline in the live preview, so it doesn't look editable.
 */
const LOCKED_EVERYWHERE = new Set(["eyebrow", "coverLabel"]);
const LOCKED_BY_TYPE: Record<string, string[]> = {
  practiceArea: ["navLabel"],
  teamMember: ["name", "role"],
};
function isLockedForClient(type: string | undefined, key: unknown): boolean {
  if (type === "pageIntros") return true;
  if (typeof key !== "string") return false;
  return LOCKED_EVERYWHERE.has(key) || Boolean(type && LOCKED_BY_TYPE[type]?.includes(key));
}

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
      if (isLockedForClient(props.sourceDocument?._type, key)) return false;
      // Slugs of referenced practice areas sit one level deeper.
      if (props.sourcePath.includes("slug")) return false;
      return props.filterDefault(props);
    },
  },
});
