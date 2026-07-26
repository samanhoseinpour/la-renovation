import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ContactCta } from "@/components/sections/contact-cta";
import { FaqList } from "@/components/sections/faq-list";
import { PageHeader } from "@/components/sections/page-header";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { ServicePanorama } from "@/components/sections/service-panorama";
import { getAllServices } from "@/content/services";
import { ctaVariants, faqs, processPhases } from "@/content/studio";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Full renovations, kitchens and baths, additions and ADUs, and historic restoration across Los Angeles.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="One team for the drawings and the building."
        lead="Design and construction sit under a single contract, which removes the gap where scope normally gets lost."
      />

      <Section>
        <Container>
          <ServicePanorama services={getAllServices()} />
        </Container>
      </Section>

      <Section surface="muted">
        <Container>
          <Reveal>
            <p className="text-eyebrow text-muted-foreground">How it runs</p>
            <h2 className="mt-6 max-w-2xl text-h2 text-balance">
              One contract, five phases.
            </h2>
          </Reveal>
          <div className="mt-14">
            <ProcessTimeline phases={processPhases} />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <p className="text-eyebrow text-muted-foreground">Questions</p>
            <h2 className="mt-6 max-w-2xl text-h2 text-balance">
              Asked on almost every first call.
            </h2>
          </Reveal>
          <div className="mt-14">
            <FaqList faqs={faqs} />
          </div>
        </Container>
      </Section>

      <ContactCta copy={ctaVariants.services} />
    </>
  );
}
