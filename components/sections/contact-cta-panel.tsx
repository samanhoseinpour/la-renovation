"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { m, useScroll, useTransform } from "motion/react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import type { BlurProps, SiteImage } from "@/content/images";
import type { CtaCopy } from "@/content/studio";

/**
 * Adapted from @shadcnblocks/cta42 crossed with cta14: kept their contained
 * rounded photo panel, swapped the centered stack for the site's bottom-left
 * grammar and the CSS background for next/image fill under a side scrim. The
 * photograph drifts slower than the page on scroll, a scrubbed transform like
 * process-strip's pour line, oversized vertically so the drift never shows an
 * edge. Dark-scoped like coverage-band: the photo doesn't change with the
 * theme, so type on it shouldn't either, and the brand pill resolves to
 * lifted steel, which holds on the scrim. Copy varies per page via
 * content/studio.ts; the photograph and its blur-up arrive resolved from the
 * server shell in contact-cta.tsx.
 */
export function ContactCtaPanel({
  copy,
  image,
  blur,
}: {
  copy: CtaCopy;
  image: SiteImage;
  blur: BlurProps;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <Section size="default">
      <Container>
        <Reveal>
          <div
            ref={panelRef}
            className="dark relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-3xl p-8 text-foreground md:min-h-[32rem] md:p-14 lg:p-16"
          >
            <m.div className="absolute inset-x-0 -inset-y-[8%]" style={{ y }}>
              <Image
                src={image.src}
                alt={image.alt}
                {...blur}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </m.div>
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-r from-black/75 via-black/45 to-black/15"
            />

            <div className="relative">
              <p className="text-eyebrow text-foreground/80">{copy.eyebrow}</p>
              <h2 className="mt-6 max-w-2xl text-display-2 text-balance">
                {copy.heading}
              </h2>
              <p className="mt-6 max-w-md text-lead text-foreground/85">
                {copy.lead}
              </p>
              <Button
                size="xl"
                variant="brand"
                className="mt-10"
                render={<Link href={copy.href} />}
                nativeButton={false}
              >
                {copy.label}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
