import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { blurProps } from "@/content/blur";
import { siteImages } from "@/content/images";
import type { CtaCopy } from "@/content/office";

/**
 * Adapted from @shadcnblocks/cta42 crossed with cta14: kept their contained
 * rounded photo panel, swapped the centered stack for the site's bottom-left
 * grammar and the CSS background for next/image fill under a side scrim.
 * Dark-scoped like coverage-band: the photo doesn't change with the theme, so
 * type on it shouldn't either, and the brand pill resolves to lifted steel,
 * which holds on the scrim. One server component since the parallax drift
 * retired with the motion runtime (PSI, 2026-08) — no client leaf, so the
 * server-only blur-up spreads straight onto the image. Copy varies per page
 * via content/office.ts.
 */
export function ContactCta({ copy }: { copy: CtaCopy }) {
  const image = siteImages.contactCta;

  return (
    <Section size="default">
      <Container>
        <div className="dark relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-3xl p-8 text-foreground md:min-h-[32rem] md:p-14 lg:p-16">
          <Image
            src={image.src}
            alt={image.alt}
            {...blurProps(image.src)}
            fill
            // Contained panel, not full-bleed: past the 88rem shell the
            // photo never renders wider than the container's 80rem inner.
            sizes="(min-width: 88rem) 80rem, 100vw"
            className="object-cover"
          />
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
      </Container>
    </Section>
  );
}
