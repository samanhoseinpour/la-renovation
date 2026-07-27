import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  className,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: {
  project: Project;
  className?: string;
  /** Match to the grid the card sits in so the optimizer serves sane widths. */
  sizes?: string;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group/card block rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-secondary">
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-editorial group-hover/card:scale-105"
        />
      </div>

      <p className="mt-5 text-eyebrow text-muted-foreground">
        {project.index} / {project.neighborhood}
      </p>
      <h3 className="mt-3 text-h3">{project.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{project.scope}</p>
    </Link>
  );
}
