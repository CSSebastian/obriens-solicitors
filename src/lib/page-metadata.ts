import type { Metadata } from "next";

import { site } from "@/content/site";

/**
 * Builds a complete, unique Metadata object for a page.
 *
 * Why this exists: Next merges `metadata.openGraph` by REPLACEMENT, not deep
 * merge. A page that sets its own `openGraph` (for a page-specific title) drops
 * the file-convention `og:image`, `og:site_name`, etc. inherited from the root.
 * Routing every page through this helper guarantees each one ships a unique
 * title/description AND the shared social image — no page silently loses it.
 *
 * The image is the generated card at /opengraph-image (see
 * src/app/opengraph-image.tsx); `metadataBase` makes the relative path absolute.
 */

const OG_IMAGE = "/opengraph-image";

export function createMetadata({
  title,
  description,
  path,
  ogTitle,
}: {
  /** Page <title> — the root layout adds the "| O'Briens Solicitors" suffix. */
  title: string;
  description: string;
  /** Absolute-from-root path, e.g. "/about". Used for canonical + og:url. */
  path: string;
  /** Optional fuller title for social cards (defaults to `title`). */
  ogTitle?: string;
}): Metadata {
  const social = ogTitle ?? title;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_AU",
      title: social,
      description,
      url: path,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: social,
      description,
      images: [OG_IMAGE],
    },
  };
}
