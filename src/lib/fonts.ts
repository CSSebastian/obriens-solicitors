import { DM_Sans, PT_Serif } from "next/font/google";

/**
 * Two-font system taken from the design PNGs.
 *
 * Headings use a clean geometric sans; body copy, labels and button text use a
 * transitional serif. DM Sans and PT Serif are stand-ins for the real faces —
 * TBC from Figma.
 */
export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const ptSerif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-pt-serif",
});
