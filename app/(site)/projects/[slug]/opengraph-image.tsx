import { notFound } from "next/navigation";

import { getProject } from "@/content/projects";
import { brandCard, cardAlt, ogSize } from "@/lib/og/template";

type Props = { params: Promise<{ slug: string }> };

// The file convention's static `alt` export can't vary by slug; this is the
// documented per-param path, and the single entry keeps one card per page.
export async function generateImageMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);

  return [
    {
      id: "card",
      alt: cardAlt(project?.title ?? "Projects"),
      size: ogSize,
      contentType: "image/png",
    },
  ];
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  // The gated accessor returns undefined for unpublished slugs, so demo
  // titles never render onto a card and gated URLs 404 like their pages.
  const project = getProject(slug);

  if (!project) notFound();

  return brandCard({ title: project.title });
}
