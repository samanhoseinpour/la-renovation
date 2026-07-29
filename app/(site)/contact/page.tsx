import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ContactStudio } from "@/components/sections/contact-studio";
import { WhatHappensNext } from "@/components/sections/what-happens-next";
import { getAllServices } from "@/content/services";
import {
  contactSteps,
  projectStages,
  projectTypeFallback,
} from "@/content/studio";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with an Orange County general contractor. Tell us about it and we'll come take a look.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const services = getAllServices().map(({ slug, title }) => ({
    slug,
    title,
  }));

  return (
    <>
      <Section size="default">
        <Container>
          <ContactStudio
            title="Tell us about the house."
            lead="Every project starts with a site visit. Send a few details and we'll arrange one."
            services={services}
            serviceFallback={projectTypeFallback}
            stages={projectStages}
          />
        </Container>
      </Section>

      <Section size="default" className="border-t border-border">
        <Container>
          <h2 className="text-eyebrow text-muted-foreground">
            What happens next
          </h2>
          <Reveal>
            <div className="mt-12">
              <WhatHappensNext steps={contactSteps} />
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
