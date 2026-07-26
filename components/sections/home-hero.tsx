import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ArrowLink } from "@/components/layout/arrow-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { siteImages } from "@/content/images";

/**
 * Adapted from @shadcnblocks/hero82: kept the poster layout — an oversized
 * headline over one wide rounded image. Replaced its AspectRatio + <img>
 * with next/image on aspect utilities, its animated download button with the
 * house pill Button and a plain lucide ArrowRight, and its container/py-20
 * shell with Section/Container. Mount-mode Reveal runs the load sequence;
 * per the motion policy this hero is the only place that animates on mount.
 */
export function HomeHero() {
  return (
    <Section size="lg">
      <Container>
        <Reveal mode="mount">
          <p className="text-eyebrow text-muted-foreground">
            Los Angeles · Design-build
          </p>
          <h1 className="mt-10 max-w-5xl text-display-1 text-balance">
            Renovating Los Angeles homes with{" "}
            <em className="not-italic text-muted-foreground">restraint.</em>
          </h1>
        </Reveal>

        <Reveal mode="mount" delay={0.08}>
          <div className="mt-12 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-md text-lead text-muted-foreground">
              A design-build studio working on full-house renovations, kitchens
              and ADUs across the Eastside and Westside.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Button
                size="xl"
                variant="brand"
                render={<Link href="/contact" />}
                nativeButton={false}
              >
                Book a call
                <ArrowRight />
              </Button>
              <ArrowLink href="/projects">View selected work</ArrowLink>
            </div>
          </div>
        </Reveal>

        <Reveal mode="mount" delay={0.16}>
          <div className="relative mt-16 aspect-5/3 w-full overflow-hidden rounded-3xl bg-secondary lg:aspect-16/8">
            <Image
              src={siteImages.homeHero.src}
              alt={siteImages.homeHero.alt}
              fill
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
              className="object-cover"
            />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
