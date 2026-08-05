import Image from "next/image";

import { ArrowLink } from "@/components/layout/arrow-link";
import { Reveal } from "@/components/motion/reveal";
import type { CompanyIntroCopy } from "@/content/home";
import { blurProps, type SiteImage } from "@/content/images";

/**
 * Adapted from @shadcnblocks/about19: kept the tall-imagery-beside-narrow-copy
 * split; dropped the avatar attribution row, split the single bordered image
 * into a staggered two-image diptych so the section doesn't clone
 * StudioStory's zigzag, and replaced its shell with the page's
 * Section/Container and semantic tokens.
 */
export function CompanyIntro({
  copy,
  images,
}: {
  copy: CompanyIntroCopy;
  images: SiteImage[];
}) {
  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
      <Reveal className="lg:col-span-5">
        <h2 className="text-eyebrow text-muted-foreground">{copy.eyebrow}</h2>
        <p className="mt-6 max-w-md text-h2 text-balance">{copy.heading}</p>
        <div className="mt-8 space-y-6">
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph} className="max-w-xl text-lead text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
        {copy.link && (
          <div className="mt-10">
            <ArrowLink href={copy.link.href}>{copy.link.label}</ArrowLink>
          </div>
        )}
      </Reveal>

      <div className="grid grid-cols-2 gap-6 lg:col-span-7">
        <Reveal>
          <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-secondary">
            <Image
              src={images[0].src}
              alt={images[0].alt}
              {...blurProps(images[0].src)}
              fill
              sizes="(min-width: 1024px) 30vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        {/* pt offset staggers the pair so the diptych reads editorial, not grid. */}
        <Reveal delay={0.05} className="pt-10 lg:pt-16">
          <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-secondary">
            <Image
              src={images[1].src}
              alt={images[1].alt}
              {...blurProps(images[1].src)}
              fill
              sizes="(min-width: 1024px) 30vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
