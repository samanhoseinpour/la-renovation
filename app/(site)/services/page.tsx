import type { Metadata } from "next";

import { ArrowLink } from "@/components/layout/arrow-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ContactCta } from "@/components/sections/contact-cta";
import { DeliveryModel } from "@/components/sections/delivery-model";
import { FaqList } from "@/components/sections/faq-list";
import { PageHeader } from "@/components/sections/page-header";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { ServicePanorama } from "@/components/sections/service-panorama";
import { StatementBand } from "@/components/sections/statement-band";
import { getFeaturedFaqs } from "@/content/faq";
import { deliveryModel, getAllServices, servicesPage } from "@/content/services";
import { ctaVariants, processPhases, statements } from "@/content/studio";
import { breadcrumbNode, JsonLd, webPageNode } from "@/lib/seo";

const description =
  "Seven construction divisions across Southern California: energy, commercial, civil, multifamily, concrete, preconstruction, and single-family.";

export const metadata: Metadata = {
  title: "Services",
  description,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        graph={[
          webPageNode({ path: "/services", title: "Services", description }),
          breadcrumbNode("/services", [
            { name: "Home", path: "/" },
            { name: "Services" },
          ]),
        ]}
      />
      <PageHeader
        eyebrow={servicesPage.header.eyebrow}
        title={servicesPage.header.title}
        lead={servicesPage.header.lead}
      />

      <Section>
        <Container>
          <ServicePanorama services={getAllServices()} />
        </Container>
      </Section>

      <Section surface="muted">
        <Container>
          <Reveal>
            <p className="text-eyebrow text-muted-foreground">{servicesPage.process.eyebrow}</p>
            <h2 className="mt-6 max-w-2xl text-h2 text-balance">
              {servicesPage.process.heading}
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
            <p className="text-eyebrow text-muted-foreground">{deliveryModel.eyebrow}</p>
            <h2 className="mt-6 max-w-2xl text-h2 text-balance">{deliveryModel.heading}</h2>
          </Reveal>
          <div className="mt-14">
            <DeliveryModel copy={deliveryModel} />
          </div>
        </Container>
      </Section>

      <Section surface="muted">
        <Container>
          <Reveal>
            <p className="text-eyebrow text-muted-foreground">{servicesPage.faq.eyebrow}</p>
            <h2 className="mt-6 max-w-2xl text-h2 text-balance">
              {servicesPage.faq.heading}
            </h2>
          </Reveal>
          <div className="mt-14">
            <FaqList faqs={getFeaturedFaqs()} />
          </div>
          <div className="mt-10">
            <ArrowLink href="/faq">{servicesPage.faq.allLabel}</ArrowLink>
          </div>
        </Container>
      </Section>

      <Section size="sm">
        <Container>
          <StatementBand {...statements.services} />
        </Container>
      </Section>

      <ContactCta copy={ctaVariants.services} />
    </>
  );
}
