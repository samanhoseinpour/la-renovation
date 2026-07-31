import { ArrowLink } from "@/components/layout/arrow-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import type { AboutCareersCopy } from "@/content/about";

/**
 * No source block: the registry's careers blocks are job-listing layouts and
 * team14 leads with people imagery — this band is deliberately a quiet text
 * hinge to /careers, unanchored (the About mega panel is the anchor tour,
 * and this section's only job is to leave the page). The statement renders
 * as a p, not a heading, so the band contributes only the "Careers" h2 to
 * the outline.
 */
export function CareersBand({ copy }: { copy: AboutCareersCopy }) {
  return (
    <Section size="default">
      <Container>
        <Reveal>
          <h2 className="text-eyebrow text-muted-foreground">{copy.eyebrow}</h2>
          <p className="mt-6 max-w-2xl text-h2 text-balance">{copy.statement}</p>
          <p className="mt-6 max-w-xl text-muted-foreground">{copy.body}</p>
          <div className="mt-8">
            <ArrowLink href={copy.link.href}>{copy.link.label}</ArrowLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
