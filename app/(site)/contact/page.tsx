import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ContactOffice } from "@/components/sections/contact-office";
import { WhatHappensNext } from "@/components/sections/what-happens-next";
import {
  contactPage,
  contactSteps,
  projectStages,
  projectTypeFallback,
} from "@/content/office";
import { getAllServices } from "@/content/services";
import { breadcrumbNode, JsonLd, webPageNode } from "@/lib/seo";

const description =
  "Start a project with a Southern California general contractor. Tell us about it and we'll come take a look.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const services = getAllServices().map(({ slug, title }) => ({
    slug,
    title,
  }));

  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            path: "/contact",
            title: "Contact",
            description,
            type: "ContactPage",
          }),
          breadcrumbNode("/contact", [
            { name: "Home", path: "/" },
            { name: "Contact" },
          ]),
        ]}
      />
      <Section size="default">
        <Container>
          <ContactOffice
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
          <div className="mt-12">
            <WhatHappensNext steps={contactSteps} />
          </div>
        </Container>
      </Section>
    </>
  );
}
