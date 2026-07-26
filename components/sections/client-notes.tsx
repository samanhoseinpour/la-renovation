import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import type { Testimonial } from "@/content/studio";

/**
 * Adapted from @shadcnblocks/testimonial38: kept the divided-list rhythm of
 * stacked quote rows; dropped the card border, avatars, company logos and the
 * case-study strip. The quote carries each row at h3 scale; attribution is a
 * neighborhood + scope line because clients asked to stay anonymous.
 */
export function ClientNotes({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <Section size="default">
      <Container>
        <h2 className="text-eyebrow text-muted-foreground">Client notes</h2>

        <div className="mt-14">
          {testimonials.map((testimonial, i) => (
            <Reveal key={i}>
              <figure className="flex flex-col gap-6 border-t border-border py-10 md:flex-row md:items-baseline md:justify-between md:gap-16 md:py-14">
                <blockquote className="max-w-3xl text-h3">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="shrink-0 text-eyebrow text-muted-foreground">
                  {testimonial.attribution}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
