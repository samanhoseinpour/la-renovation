import { brandCard, cardAlt, ogSize } from "@/lib/og/template";

export const alt = cardAlt("Terms of use");
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return brandCard({ title: "Terms of use" });
}
