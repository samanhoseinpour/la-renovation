import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ArrowLink } from "@/components/layout/arrow-link";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { blurProps } from "@/content/blur";
import { homeHero } from "@/content/home";
import { siteImages } from "@/content/images";
import { published } from "@/lib/site";

/**
 * Adapted from @shadcnblocks/hero157: kept the full-bleed viewport photograph
 * with the text stack anchored to its bottom edge and the border-left lead
 * paragraph. Replaced its CSS background-image with a preloaded next/image —
 * the LCP element must exist in server HTML and must not sit behind a Reveal —
 * its flat black overlay with a bottom-weighted gradient scrim, and its
 * uppercase outline CTA with the house brand pill + ArrowLink.
 *
 * The `dark` class scopes descendants to dark tokens: the photograph doesn't
 * change with the theme, so type and controls on it shouldn't either.
 *
 * -mt-16 pulls the section under the h-16 sticky header, which runs
 * transparent while any part of the hero is behind it (see site-header.tsx,
 * which observes #home-hero).
 *
 * Copy lives in content/home.ts.
 */
export function HomeHero() {
  return (
    <section
      id="home-hero"
      className="dark relative -mt-16 flex min-h-svh max-h-350 flex-col justify-end overflow-hidden"
    >
      <Image
        src={siteImages.homeHero.src}
        alt={siteImages.homeHero.alt}
        {...blurProps(siteImages.homeHero.src)}
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />
      {/* Two scrims: bottom-weighted under the text stack, plus a top band
          behind the transparent header — nothing guarantees the photo is
          dark up there, and nav links must hold contrast over sky. All
          on-image type is white-based (foreground in this dark scope), never
          grey muted-foreground: grey over a photograph can't hold AA. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-black/75 via-black/40 to-black/25"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-44 bg-linear-to-b from-black/70 to-transparent"
      />

      <Container className="relative pt-40 pb-14 md:pb-20">
        <Reveal mode="mount">
          <p className="text-eyebrow text-foreground/80">
            {homeHero.eyebrow}
          </p>
          <h1 className="mt-6 max-w-5xl text-display-1 text-balance text-foreground">
            {homeHero.heading}
          </h1>
        </Reveal>

        <Reveal mode="mount" delay={0.08}>
          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            {/* The lead is the client's full positioning paragraph, not a
                one-liner: body size at xl width keeps it from rivalling the
                headline while holding a readable measure. */}
            <p className="max-w-xl border-l border-foreground/40 pl-6 text-base text-foreground/85">
              {homeHero.lead}
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Button
                size="xl"
                variant="brand"
                render={<Link href={homeHero.primaryCta.href} />}
                nativeButton={false}
              >
                {homeHero.primaryCta.label}
                <ArrowRight data-icon="inline-end" />
              </Button>
              {published.projects ? (
                <ArrowLink href={homeHero.secondaryCta.published.href}>
                  {homeHero.secondaryCta.published.label}
                </ArrowLink>
              ) : (
                <ArrowLink href={homeHero.secondaryCta.unpublished.href}>
                  {homeHero.secondaryCta.unpublished.label}
                </ArrowLink>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
