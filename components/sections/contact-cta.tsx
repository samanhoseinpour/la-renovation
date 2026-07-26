import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import type { CtaCopy } from "@/content/studio";

/**
 * Adapted from @shadcnblocks/cta10: kept the contained rounded panel and the
 * split heading/action layout; replaced its accent surface with the inverted
 * ink panel, its py-32 wrapper with Section, and its anchor buttons with the
 * house pill Button. Copy varies per page via content/studio.ts — the same
 * sentence on six pages is what made the old band feel templated.
 */
export function ContactCta({ copy }: { copy: CtaCopy }) {
  return (
    <Section size="default">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-10 rounded-3xl bg-foreground p-8 text-background md:p-14 lg:flex-row lg:items-end lg:justify-between lg:p-16">
            <div>
              <h2 className="max-w-2xl text-display-2 text-balance">
                {copy.heading}
              </h2>
              <p className="mt-6 max-w-md text-lead opacity-70">{copy.lead}</p>
            </div>
            <Button
              size="xl"
              variant="brand"
              className="shrink-0"
              render={<Link href={copy.href} />}
              nativeButton={false}
            >
              {copy.label}
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
