import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori (which renders this) needs explicit `display: flex` on any element
// with children, and cannot read our CSS variables — hence literal hex values
// from the light palette.
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#F3F3F1",
          color: "#16181A",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.16em",
            color: "#5A6167",
          }}
        >
          {site.name.toUpperCase()}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 78,
            lineHeight: 1.04,
            letterSpacing: "-0.025em",
            maxWidth: 920,
          }}
        >
          Ground to grid.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", fontSize: 26, color: "#5A6167" }}>
            {site.tagline}
          </div>
          <div
            style={{
              display: "flex",
              width: 140,
              height: 6,
              borderRadius: 3,
              backgroundColor: "#2B4A63",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
