import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";

type StudioStoryProps = {
  id?: string;
  className?: string;
  paragraphs: string[];
  images: { src: string; alt: string }[];
  facts: { label: string; value: string }[];
};

/**
 * Adapted from @shadcnblocks/about28: kept the two-column zigzag of image and
 * text pairs with rounded-2xl frames and the lg column stagger; dropped the
 * demo copy and careers CTA, swapped <img> for next/image, and replaced the
 * container/mt-* wrapper with Section/Container. The offset column ends in a
 * quiet facts <dl> instead of a fourth photo.
 */
export function StudioStory({
  id,
  className,
  paragraphs,
  images,
  facts,
}: StudioStoryProps) {
  return (
    // id/className let the page anchor this section (#story) with
    // scroll-mt-16 — same 64px as the Lenis `anchors: { offset: -64 }` and
    // the header's IntersectionObserver rootMargin
    // (components/motion/smooth-scroll.tsx, components/site/site-header.tsx).
    <Section id={id} size="default" className={className}>
      <Container>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-14 lg:gap-20">
            <Reveal>
              <div className="space-y-8">
                <StoryImage image={images[0]} eager />
                <p className="max-w-xl text-lead">{paragraphs[0]}</p>
              </div>
            </Reveal>
            <Reveal>
              <div className="space-y-8">
                <p className="max-w-xl text-lead">{paragraphs[1]}</p>
                <StoryImage image={images[1]} />
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col gap-14 lg:gap-20 lg:pt-28">
            <Reveal>
              <div className="space-y-8">
                <StoryImage image={images[2]} portrait />
                <p className="max-w-xl text-lead">{paragraphs[2]}</p>
              </div>
            </Reveal>
            <Reveal>
              <div>
                <h2 className="text-eyebrow text-muted-foreground">Studio</h2>
                <dl className="mt-6 border-t border-border">
                  {facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex justify-between gap-6 border-b border-border py-4"
                    >
                      <dt className="text-sm text-muted-foreground">
                        {fact.label}
                      </dt>
                      <dd className="text-sm tabular text-right">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function StoryImage({
  image,
  portrait = false,
  eager = false,
}: {
  image: { src: string; alt: string };
  /** Taller frame for the offset column, so the stagger reads on lg. */
  portrait?: boolean;
  /** Only for the first image, which can sit at the fold on desktop. */
  eager?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${
        portrait ? "aspect-3/4" : "aspect-4/3"
      }`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="object-cover"
        {...(eager ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
      />
    </div>
  );
}
