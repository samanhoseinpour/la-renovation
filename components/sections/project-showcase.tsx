import Image from "next/image";
import Link from "next/link";

import { ArrowLink } from "@/components/layout/arrow-link";
import { Reveal } from "@/components/motion/reveal";
import type { Project } from "@/content/projects";

/**
 * Adapted from @shadcnblocks/projects2: kept the alternating text/image rows
 * and the 4:12 editorial split; replaced its serif shout-caps heading with
 * the page's own section heading, py-32/container with the parent Section,
 * and the bare <img> with next/image. Rows alternate sides so a long index
 * doesn't read as a table.
 */
export function ProjectShowcase({ projects }: { projects: Project[] }) {
  return (
    <div className="space-y-20 md:space-y-28">
      {projects.map((project, i) => (
        <Reveal key={project.slug}>
          <article className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div
              className={
                i % 2 === 0 ? "order-2 lg:order-1 lg:col-span-4" : "order-2 lg:col-span-4"
              }
            >
              <p className="text-eyebrow text-muted-foreground">
                {project.index} / {project.neighborhood} · {project.year}
              </p>
              <h3 className="mt-4 text-h2">{project.title}</h3>
              <p className="mt-4 max-w-sm text-muted-foreground">
                {project.summary}
              </p>
              <div className="mt-8">
                {/* Hidden from AT: the image link below is the exposed one —
                    the biggest tap target should be the accessible target. */}
                <ArrowLink
                  href={`/projects/${project.slug}`}
                  aria-hidden
                  tabIndex={-1}
                >
                  View project
                </ArrowLink>
              </div>
            </div>

            <Link
              href={`/projects/${project.slug}`}
              aria-label={`View project: ${project.title}`}
              className={
                i % 2 === 0
                  ? "group/media order-1 lg:order-2 lg:col-span-8"
                  : "group/media order-1 lg:col-span-8"
              }
            >
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl bg-secondary">
                <Image
                  src={project.image.src}
                  alt={project.image.alt}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-editorial group-hover/media:scale-[1.03]"
                />
              </div>
            </Link>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
