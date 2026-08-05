import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

/**
 * PNG counterpart of app/icon.svg (apple-touch-icon accepts no SVG): the "A"
 * monogram on the graphite tile. Doubles as the schema graph's
 * Organization.logo and the iMessage preview fallback when a page image
 * can't be fetched.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const semibold = await readFile(
    join(process.cwd(), "assets/fonts/archivo-semibold.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#16181A",
          color: "#F3F3F1",
          fontFamily: "Archivo",
          fontSize: 112,
          fontWeight: 600,
        }}
      >
        A
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
