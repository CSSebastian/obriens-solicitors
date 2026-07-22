import { ImageResponse } from "next/og";

import { site } from "@/content/site";

/**
 * Branded Open Graph / social-share card, generated at build time.
 *
 * File-convention route: Next wires this into `openGraph.images` (and, via
 * twitter-image, the Twitter card) for the whole app, so every page inherits it
 * unless it sets its own. Deliberately self-contained — no external font fetch —
 * so the build can never fail on a network hiccup.
 */
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#14213d";
const MUTED = "#aab2bf";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: NAVY,
          color: "#ffffff",
          padding: "80px 90px",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          Solicitors · Berri, South Australia
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 82, fontWeight: 700, lineHeight: 1.05 }}>
            {site.name}
          </div>
          <div style={{ fontSize: 46, color: MUTED, marginTop: 24 }}>
            {site.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 28,
            color: MUTED,
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingTop: 28,
          }}
        >
          <span>Serving the Riverland since {site.established}</span>
          <span>{site.phone}</span>
        </div>
      </div>
    ),
    size,
  );
}
