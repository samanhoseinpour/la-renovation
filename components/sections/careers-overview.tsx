import { ArrowLink } from "@/components/layout/arrow-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import type { CareersValue } from "@/content/careers";

type CareersOverviewProps = {
  values: CareersValue[];
  application: { heading: string; body: string };
  email: string;
};

/**
 * Adapted from @shadcnblocks/careers9: kept the closing general-application
 * panel; dropped the openings table, since there are no listings to publish
 * and inventing them is out of the question, along with its gradient wrapper,
 * department badges and separator rows. The values run in the numbered
 * hairline register the about page's approach grid established, and the panel
 * closes on the house ArrowLink instead of the block's bare arrow anchor.
 *
 * Contract: the page must not render a heading above the values grid. The
 * value titles and the application heading are its h2 outline, sitting
 * directly under the PageHeader h1; a section label between them would leave
 * the values one level too high.
 */
export function CareersOverview({
  values,
  application,
  email,
}: CareersOverviewProps) {
  return (
    <Section size="default">
      <Container>
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <Reveal key={value.title} delay={Math.min(index * 0.05, 0.2)}>
              <div className="border-t border-border pt-6">
                <p className="text-eyebrow text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-4 text-h3">{value.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  {value.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div
            id="apply"
            className="mt-20 scroll-mt-16 rounded-3xl border border-border bg-card p-8 md:p-14"
          >
            <h2 className="max-w-2xl text-h2 text-balance">
              {application.heading}
            </h2>
            <p className="mt-6 max-w-2xl text-muted-foreground">
              {application.body}
            </p>
            <div className="mt-10">
              <ArrowLink href={`mailto:${email}`}>{email}</ArrowLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
