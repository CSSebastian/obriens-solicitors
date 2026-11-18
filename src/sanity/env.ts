/**
 * Sanity project settings. The project ID and dataset are public (the dataset
 * is publicly readable), so they default to the live project and the site
 * needs no environment variables to show published content.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p0i7hr40";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2026-11-01";

/** The hosted Studio, used for click-to-edit links in the live preview. */
export const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "https://obriens-solicitors.sanity.studio";
