import { brandCard, cardAlt, ogSize } from "@/lib/og/template";

export const alt = cardAlt("About");
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return brandCard({ title: "About" });
}
