import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ContactCta } from "@/components/sections/contact-cta";
import { FaqTopics } from "@/components/sections/faq-topics";
import { PageHeader } from "@/components/sections/page-header";
import { faqTopics } from "@/content/faq";
import { ctaVariants } from "@/content/studio";
import { breadcrumbNode, faqMainEntity, JsonLd, webPageNode } from "@/lib/seo";

const description =
  "Answers to the questions owners ask before a project starts: how the work runs, how it gets priced, and how to check a contractor's license.";

export const metadata: Metadata = {
  title: "FAQ",
  description,
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      {/* FAQPage markup carries no SERP feature anymore (rich results retired
          May 2026); it stays as machine-readable Q&A for non-Google consumers. */}
      <JsonLd
        graph={[
          webPageNode({
            path: "/faq",
            title: "FAQ",
            description,
            type: "FAQPage",
            extra: faqMainEntity(faqTopics.flatMap((topic) => topic.faqs)),
          }),
          breadcrumbNode("/faq", [
            { name: "Home", path: "/" },
            { name: "FAQ" },
          ]),
        ]}
      />
      <PageHeader
        eyebrow="Questions"
        title="The questions worth asking any contractor."
        lead="Grouped by topic: how a project runs, how it gets priced, who carries the license, and what working with us is like. Same answers we'd give you on the phone."
      />

      <Section>
        <Container>
          <Reveal>
            <p className="text-eyebrow text-muted-foreground">By topic</p>
            <h2 className="mt-6 max-w-2xl text-h2 text-balance">
              Start with the part you&rsquo;re worried about.
            </h2>
          </Reveal>
          <div className="mt-14">
            <FaqTopics topics={faqTopics} />
          </div>
        </Container>
      </Section>

      <ContactCta copy={ctaVariants.faq} />
    </>
  );
}
