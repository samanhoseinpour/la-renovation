"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { BlurProps } from "@/content/images";
import type { Service } from "@/content/services";
import { cn } from "@/lib/utils";

export type PanoramaItem = {
  service: Service;
  /** Resolved blur-up for the division photo; computed by the server shell
      in service-panorama.tsx. */
  blur: BlurProps;
};

/**
 * Adapted from @shadcnblocks/feature199: kept the linked list with a sticky
 * media pane that swaps per active row. Replaced its window scroll-listener
 * mobile mode with inline per-row images (below md the pane is gone and each
 * row simply carries its photograph — no sticky, nothing to track), its <img>
 * swap with a crossfading next/image stack, and its hover-only activation
 * with hover + focus so keyboard users drive the pane too. Rows are links to
 * the service detail pages.
 */
export function ServicePanoramaRail({ items }: { items: PanoramaItem[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-12 md:grid-cols-5 md:gap-10 lg:gap-16">
      <div className="border-b border-border md:col-span-3">
        {items.map(({ service, blur }, index) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            className="group/row block border-t border-border py-8 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 lg:py-10"
          >
            <p className="text-eyebrow text-muted-foreground">
              {service.index}
            </p>
            <div className="mt-4 flex items-baseline justify-between gap-6">
              <h3
                className={cn(
                  "text-h2 text-balance transition-colors duration-200 ease-editorial",
                  active === index
                    ? "text-foreground"
                    : "text-foreground md:text-muted-foreground",
                )}
              >
                {service.title}
              </h3>
              <ArrowRight className="size-5 shrink-0 transition-transform duration-200 ease-editorial group-hover/row:translate-x-1" />
            </div>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              {service.summary}
            </p>
            <p className="mt-5 text-eyebrow text-muted-foreground">
              {service.scope}
            </p>

            <div className="relative mt-6 aspect-3/2 overflow-hidden rounded-2xl bg-secondary md:hidden">
              <Image
                src={service.image.src}
                alt={service.image.alt}
                {...blur}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Decorative for AT: the rows carry the accessible content, and below
          md each row shows its own image instead. The stacked imgs keep their
          manifest alt for image crawlers. */}
      <div aria-hidden className="hidden md:col-span-2 md:block">
        <div className="sticky top-24">
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-secondary">
            {items.map(({ service, blur }, index) => (
              <Image
                key={service.slug}
                src={service.image.src}
                alt={service.image.alt}
                {...blur}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className={cn(
                  "object-cover transition-opacity duration-500 ease-editorial",
                  active === index ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
