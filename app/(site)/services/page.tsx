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
    "Seven construction divisions across Southern California — multifamily, commercial, civil, energy, concrete, single-family, and preconstruction.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="What we do"
        title="Seven divisions. One contract."
        lead="Most contractors coordinate. We self-perform the scopes that decide whether a project holds its schedule, and we engineer the systems that increasingly decide whether it passes inspection at all."
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
