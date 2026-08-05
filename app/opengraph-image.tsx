import { brandCard, ogSize } from "@/lib/og/template";
import { site } from "@/lib/site";

// Home and every route without its own card: the tagline carries the line
// and the footer holds the full positioning sentence.
export const alt = `${site.name} · ${site.tagline}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return brandCard({ title: site.tagline, footer: site.description });
}
