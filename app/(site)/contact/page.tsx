import type { Metadata } from "next";
import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/sections/contact-form";
import { PageHeader } from "@/components/sections/page-header";
import { WhatHappensNext } from "@/components/sections/what-happens-next";
import { siteImages } from "@/content/images";
import { contactSteps } from "@/content/studio";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a renovation project in Los Angeles. Tell us about the property and we'll come and look at it.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell us about the house."
        lead="Every project starts with a site visit. Send a few details and we'll arrange one."
      />

      {/* Split layout after contact32: form left, tall photo right on lg. */}
      <Section size="default">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <ContactForm />
            </div>

            <div className="relative hidden aspect-4/5 overflow-hidden rounded-3xl lg:col-span-5 lg:col-start-8 lg:block">
              <Image
                src={siteImages.contact.src}
                alt={siteImages.contact.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section size="default" className="border-t border-border">
        <Container>
          <Reveal>
            <div className="grid gap-x-8 gap-y-12 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <a
                  href={`mailto:${site.contact.email}`}
                  className="block text-h1 wrap-anywhere underline-offset-8 hover:underline"
                >
                  {site.contact.email}
                </a>
                <a
                  href={site.contact.phoneHref}
                  className="tabular mt-4 block text-h1 underline-offset-8 hover:underline"
                >
                  {site.contact.phone}
                </a>
              </div>

              <div className="text-sm text-muted-foreground lg:col-span-3 lg:col-start-10">
                <h2 className="text-eyebrow">Visit</h2>
                <address className="mt-4 not-italic">
                  {site.contact.address.street}
                  <br />
                  {site.contact.address.city}, {site.contact.address.state}{" "}
                  {site.contact.address.zip}
                </address>
                <h2 className="mt-8 text-eyebrow">Hours</h2>
                <p className="mt-4">{site.contact.hours}</p>
              </div>
            </div>
          </Reveal>
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
