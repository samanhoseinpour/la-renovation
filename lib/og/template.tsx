import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

/**
 * Shared Open Graph card: dark brand canvas, wordmark eyebrow, page title,
 * brand rule, right-aligned footer line. The bottom-left corner stays empty
 * on purpose — X overlays its own title text there — and everything else sits
 * inside the ~1080×600 center safe zone that survives platform crops.
 *
 * Output is PNG (ImageResponse's native encode): AVIF and WebP og:images
 * still fail on X, LinkedIn, Slack and iMessage in 2026, and the flat canvas
 * keeps the file far under WhatsApp's ~600KB preview ceiling.
 */

export const ogSize = { width: 1200, height: 630 };

// Satori reads no CSS variables; literal values mirror the .dark palette in
// app/globals.css and the brand rule carried over from the original card.
const canvas = "#16181A";
const ink = "#F3F3F1";
const muted = "#A9B0B6";
const rule = "#2B4A63";

// Archivo, OFL-licensed, vendored because ImageResponse needs raw ttf/otf
// data — next/font's pipeline never exposes the files.
async function archivoFonts() {
  const [regular, semibold] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/archivo-regular.ttf")),
    readFile(join(process.cwd(), "assets/fonts/archivo-semibold.ttf")),
  ]);
  return [
    { name: "Archivo", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Archivo", data: semibold, weight: 600 as const, style: "normal" as const },
  ];
}

type BrandCardOptions = {
  /** The card's display line — usually the page title. */
  title: string;
  /** Bottom-right line; the tagline everywhere except home, which shows the site description. */
  footer?: string;
};

export async function brandCard({
  title,
  footer = site.tagline,
}: BrandCardOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: canvas,
          color: ink,
          fontFamily: "Archivo",
          padding: 72,
          paddingBottom: 96,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.16em",
            color: muted,
          }}
        >
          {site.name.toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              width: 140,
              height: 6,
              borderRadius: 3,
              backgroundColor: rule,
              marginTop: 44,
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: muted,
              maxWidth: 820,
              textAlign: "right",
            }}
          >
            {footer}
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await archivoFonts() },
  );
}

/** Standard og:image:alt for a brand card. */
export function cardAlt(title: string) {
  return `${title} · ${site.name}`;
}
