import Image from "next/image";

import { ArrowLink } from "@/components/layout/arrow-link";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import type { SectionIntro } from "@/content/home";
import { blurProps, type SiteImage } from "@/content/images";

/**
 * Adapted from @shadcnblocks/cta43: kept the edge-to-edge background
 * photograph under a gradient overlay with a single CTA; left-aligned its
 * centered stack to match the hero's grammar, swapped the CSS background
 * image for next/image fill, and scoped the block `dark` like home-hero —
 * the photograph doesn't change with the theme, so type on it shouldn't
 * either. All on-image type is white-based, never muted grey (can't hold AA
 * over a photograph).
 */
export function CoverageBand({
  copy,
  image,
}: {
  copy: SectionIntro;
  image: SiteImage;
}) {
  return (
    <section className="dark relative flex min-h-[60svh] flex-col justify-end overflow-hidden">
      <Image
        src={image.src}
        alt={image.alt}
        {...blurProps(image.src)}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-black/75 via-black/35 to-black/20"
      />

      <Container className="relative py-14 md:py-20">
        <Reveal>
          <h2 className="text-eyebrow text-foreground/80">{copy.eyebrow}</h2>
          <p className="mt-6 max-w-3xl text-display-2 text-balance text-foreground">
            {copy.heading}
          </p>
          <p className="mt-8 max-w-md text-lead text-foreground/85">
            {copy.lead}
          </p>
          {copy.link && (
            <div className="mt-10">
              <ArrowLink href={copy.link.href}>{copy.link.label}</ArrowLink>
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
