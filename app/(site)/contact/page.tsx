import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ContactStudio } from "@/components/sections/contact-studio";
import { WhatHappensNext } from "@/components/sections/what-happens-next";
import { getAllServices } from "@/content/services";
import {
  contactPage,
  contactSteps,
  projectStages,
  projectTypeFallback,
} from "@/content/studio";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with a Southern California general contractor. Tell us about it and we'll come take a look.",
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
            title={contactPage.title}
            lead={contactPage.lead}
            commitment={contactPage.commitment}
            formIntro={contactPage.formIntro}
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
