import { notFound } from "next/navigation";

import { getService } from "@/content/services";
import { brandCard, cardAlt, ogSize } from "@/lib/og/template";

type Props = { params: Promise<{ slug: string }> };

// The file convention's static `alt` export can't vary by slug; this is the
// documented per-param path, and the single entry keeps one card per page.
export async function generateImageMetadata({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);

  return [
    {
      id: "card",
      alt: cardAlt(service?.title ?? "Services"),
      size: ogSize,
      contentType: "image/png",
    },
  ];
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);

  // Mirror the page's 404 contract instead of serving a soft-200 card for
  // arbitrary slugs — each hit here is a live render.
  if (!service) notFound();

  return brandCard({ title: service.title });
}
