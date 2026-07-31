import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ArrowLink, ArrowMark } from "@/components/layout/arrow-link";
import { Reveal } from "@/components/motion/reveal";
import type { SectionIntro } from "@/content/home";
import type { SiteImage } from "@/content/images";
import type { Service } from "@/content/services";

/**
 * Home's divisions section. The intro rail pins on lg+ while the portrait
 * card grid scrolls past; the cards carry the same photo treatment as the
 * retired service-cards (@shadcnblocks/services11) grid they replace —
 * white over an explicit scrim (image treatment, not a theme colour).
 */
export function DivisionShowcase({
  intro,
  services,
  linkImage,
}: {
  intro: SectionIntro;
  services: Service[];
  /** Behind the All-divisions tile; rendered blurred to texture. */
  linkImage: SiteImage;
}) {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <Reveal>
          <h2 className="text-eyebrow text-muted-foreground">{intro.eyebrow}</h2>
          <p className="mt-6 max-w-xs text-h2">{intro.heading}</p>
          {intro.link && (
            <div className="mt-8">
              <ArrowLink href={intro.link.href}>{intro.link.label}</ArrowLink>
            </div>
          )}
        </Reveal>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2">
        {services.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="group/division block rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-secondary sm:aspect-4/5">
              <Image
                src={service.image.src}
                alt={service.image.alt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-editorial group-hover/division:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6">
                <div className="pr-4">
                  <h3 className="text-lg font-semibold text-white">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/85 line-clamp-2">
                    {service.summary}
                  </p>
                </div>
                <ArrowUpRight className="size-6 shrink-0 text-white transition-transform duration-300 ease-editorial group-hover/division:translate-x-0.5 group-hover/division:-translate-y-0.5" />
              </div>
            </div>
          </Link>
        ))}

        {/* Eighth tile completing the 4x2 grid for seven cards. Its photo
            stays blurred and dimmed to texture — the tile is a signpost, not
            a portfolio image — and the block is scoped `dark` like
            coverage-band so the mark's tokens hold over the photograph in
            both themes. The whole tile is the link; group/arrow lets the
            ArrowMark answer hover from anywhere on it. */}
        <Link
          href="/services"
          className="dark group/arrow relative flex aspect-3/4 items-center justify-center overflow-hidden rounded-2xl bg-secondary outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:aspect-4/5"
        >
          {/* scale-105 keeps the blur's soft edge outside the crop. */}
          <Image
            src={linkImage.src}
            alt=""
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="scale-105 object-cover blur-md"
          />
          <div className="absolute inset-0 bg-black/60" />
          <ArrowMark className="relative">All divisions</ArrowMark>
        </Link>
      </div>
    </div>
  );
}
