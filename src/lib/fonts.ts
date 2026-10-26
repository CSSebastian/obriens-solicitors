import localFont from "next/font/local";

/**
 * The firm's two-font system, per the official style guide.
 *
 * Headings use Rethink Sans (a clean contemporary grotesque); body copy,
 * labels and button text use Roboto Serif.
 *
 * Both are open-source (SIL OFL 1.1) and the latin-subset WOFF2 files are
 * committed in `src/fonts/` rather than fetched from Google Fonts at build
 * time, so a production build never depends on the network. (A transient
 * Google Fonts failure once failed a Vercel production build.) next/font still
 * handles preloading, `font-display: swap` and the CSS variables, so there's
 * no layout shift. Licences sit beside the font files.
 *
 * Weights are trimmed to what the type scale actually uses:
 *   Rethink Sans — 400 (rare), 500 (headings + nav/medium), 700 (bold labels)
 *   Roboto Serif — 400 (body), 700 (eyebrow / bold), plus 400 italic (taglines)
 */
// The export names become the @font-face family names, so keep them distinct
// from the CSS generic keywords (`sans`, `serif`).
export const rethinkSans = localFont({
  src: [
    {
      path: "../fonts/rethink-sans-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/rethink-sans-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/rethink-sans-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-sans-face",
});

export const robotoSerif = localFont({
  src: [
    {
      path: "../fonts/roboto-serif-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/roboto-serif-latin-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/roboto-serif-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/roboto-serif-latin-700-italic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-serif-face",
});
