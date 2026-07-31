import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ArrowLink } from "@/components/layout/arrow-link";
import type { Service } from "@/content/services";
import { cn } from "@/lib/utils";

/**
 * Adapted from @shadcnblocks/services11: kept the portrait photo cards with
 * the corner arrow; swapped its framer-motion hover fade for CSS transitions,
 * its <img> for next/image, and its hardcoded white text for white over an
 * explicit scrim (image treatment, not a theme colour). Layout is left to
 * the page — this renders just the card grid. Summary line added under the
 * title when the divisions grid became home's information anchor.
 */
export function ServiceCards({
  services,
  className,
}: {
  services: Service[];
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2", className)}>
      {services.map((service) => (
        <Link
          key={service.slug}
          href={`/services/${service.slug}`}
          className="group/service block rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-secondary sm:aspect-4/5">
            <Image
              src={service.image.src}
              alt={service.image.alt}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-editorial group-hover/service:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6">
              <div className="pr-4">
                <p className="text-lg font-semibold text-white">{service.title}</p>
                <p className="mt-1 text-sm text-white/85 line-clamp-2">{service.summary}</p>
              </div>
              <ArrowUpRight className="size-6 shrink-0 text-white transition-transform duration-300 ease-editorial group-hover/service:translate-x-0.5 group-hover/service:-translate-y-0.5" />
            </div>
          </div>
        </Link>
      ))}

      {/* Eighth tile completing the 4x2 grid for seven cards: a plain link
          out rather than a photograph nobody would recognize. */}
      <div className="relative flex aspect-3/4 items-center justify-center rounded-2xl bg-secondary sm:aspect-4/5">
        <ArrowLink href="/services">All divisions</ArrowLink>
      </div>
    </div>
  );
}
