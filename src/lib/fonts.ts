import { Rethink_Sans, Roboto_Serif } from "next/font/google";

/**
 * The firm's two-font system, per the official style guide.
 *
 * Headings use Rethink Sans (a clean contemporary grotesque); body copy,
 * labels and button text use Roboto Serif. Both are free Google Fonts and are
 * loaded via next/font so they self-host with no layout shift.
 *
 * Weights are trimmed to what the type scale actually uses:
 *   Rethink Sans — 400 (rare), 500 (headings + nav/medium), 700 (bold labels)
 *   Roboto Serif — 400 (body), 700 (eyebrow / bold), plus 400 italic (taglines)
 */
export const sans = Rethink_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-sans-face",
});

export const serif = Roboto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif-face",
});
