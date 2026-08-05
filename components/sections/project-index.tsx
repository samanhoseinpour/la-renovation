import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { blurProps } from "@/content/images";
import type { Project } from "@/content/projects";

/**
 * Adapted from @shadcnblocks/case-studies3: kept the hairline frame with one
 * featured case study above a supporting grid. Replaced its logo/company/tag
 * demo copy with the project content model, its <img> with next/image, its
 * dotted side rails with plain hairlines, and its py-32/container shell with
 * the parent Section. The featured slot takes the first project passed in.
 *
 * This is the /projects treatment; the home page keeps the alternating
 * showcase rows, so the two pages no longer show the same layout twice.
 */
export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [featured, ...rest] = projects;
  if (!featured) return null;

  return (
    <div className="border border-border">
      <Reveal>
        <Link
          href={`/projects/${featured.slug}`}
          className="group/featured grid transition-colors duration-200 ease-editorial hover:bg-muted/40 lg:grid-cols-2"
        >
          <div className="order-2 flex flex-col justify-between gap-10 p-6 md:p-10 lg:order-1 lg:p-12">
            <p className="text-eyebrow text-muted-foreground">
              {featured.index} / {featured.neighborhood}
            </p>
            <div>
              <h2 className="text-h1 text-balance">{featured.title}</h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                {featured.summary}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                {featured.scope}
              </p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                View project
                <ArrowRight className="size-4 transition-transform duration-200 ease-editorial group-hover/featured:translate-x-1" />
              </span>
            </div>
          </div>

          <div className="order-1 p-6 pb-0 md:p-10 md:pb-0 lg:order-2 lg:p-12 lg:pl-0">
            <div className="relative aspect-14/9 overflow-hidden rounded-2xl bg-secondary">
              <Image
                src={featured.image.src}
                alt={featured.image.alt}
                {...blurProps(featured.image.src)}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-editorial group-hover/featured:scale-[1.03]"
              />
            </div>
          </div>
        </Link>
      </Reveal>

      <Reveal>
        <div className="grid border-t border-border lg:grid-cols-3">
          {rest.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group/card flex flex-col justify-between gap-12 border-t border-border p-6 transition-colors duration-200 ease-editorial first:border-t-0 hover:bg-muted/40 md:p-10 lg:border-t-0 lg:border-l lg:first:border-l-0 lg:p-12"
            >
              <p className="text-eyebrow text-muted-foreground">
                {project.index} / {project.neighborhood}
              </p>
              <div>
                <h3 className="text-h3 text-balance">{project.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {project.summary}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {project.scope}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
                  View project
                  <ArrowRight className="size-4 transition-transform duration-200 ease-editorial group-hover/card:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
