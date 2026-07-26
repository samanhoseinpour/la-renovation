import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ContactCta } from "@/components/sections/contact-cta";
import { PageHeader } from "@/components/sections/page-header";
import { StudioStats } from "@/components/sections/studio-stats";
import { StudioStory } from "@/components/sections/studio-story";
import { siteImages } from "@/content/images";
import { aboutStats, ctaVariants } from "@/content/studio";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "A design-build studio in Los Angeles working on considered renovations of existing houses.",
  alternates: { canonical: "/about" },
};

const STORY = [
  `${site.name} is a design-build studio. We draw the work and we build it, which means one team is accountable from the first site visit to the final inspection.`,
  "Almost everything we do is a renovation. That is a deliberate choice — the existing housing stock in Los Angeles is good, and the environmental case for reusing it is hard to argue with.",
  "We work on a small number of projects at a time. If we are the wrong studio for your house, we will tell you early and point you somewhere better.",
];

const FACTS = [
  { label: "Founded", value: "2018" },
  { label: "Based", value: "Silver Lake, LA" },
  { label: "Team", value: "11 people" },
  { label: "License", value: site.license },
];

const PRINCIPLES = [
  {
    index: "01",
    title: "Subtract first",
    body: "Most houses we take on have been renovated before. The first job is usually removing what previous work added, not adding more.",
  },
  {
    index: "02",
    title: "One contract",
    body: "Design and construction sit together. There is no drawing set handed over to a builder who then reprices it.",
  },
  {
    index: "03",
    title: "Fixed scope",
    body: "Scope is agreed before demolition and published as an allowance schedule, so you can see which decisions are still open.",
  },
  {
    index: "04",
    title: "Narrow palette",
    body: "A small number of materials, used consistently, ages better than a wide one. It is also easier to repair.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About the studio"
        title="We renovate houses that are already here."
        lead="Founded in Silver Lake, working across Los Angeles on houses built between 1920 and 1970."
      />

      <StudioStory
        paragraphs={STORY}
        images={siteImages.about}
        facts={FACTS}
      />

      <StudioStats
        stats={aboutStats}
        surface="muted"
        eyebrow="The studio"
        heading="Founded to build what we draw."
      />

      <Section size="default" surface="muted">
        <Container>
          <h2 className="text-eyebrow text-muted-foreground">How we work</h2>
          <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2">
            {PRINCIPLES.map((principle) => (
              <div key={principle.index} className="border-t border-border pt-6">
                <p className="text-eyebrow text-muted-foreground">
                  {principle.index}
                </p>
                <h3 className="mt-4 text-h3">{principle.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {principle.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <ContactCta copy={ctaVariants.about} />
    </>
  );
}
