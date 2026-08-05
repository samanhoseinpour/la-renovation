import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CareersBand } from "@/components/sections/careers-band";
import { ContactCta } from "@/components/sections/contact-cta";
import { OfficeCommitments } from "@/components/sections/office-commitments";
import { OfficeMission } from "@/components/sections/office-mission";
import { OfficeStory } from "@/components/sections/office-story";
import { OfficeTeam } from "@/components/sections/office-team";
import { PageHeader } from "@/components/sections/page-header";
import { PartnerStrip } from "@/components/sections/partner-strip";
import { StatementBand } from "@/components/sections/statement-band";
import { aboutCareers, aboutIntro, aboutStory, approach, commitments, mission, vision } from "@/content/about";
import { siteImages } from "@/content/images";
import { ctaVariants, statements } from "@/content/office";
import { partners, partnersIntro } from "@/content/partners";
import { teamMembers } from "@/content/team";
import { breadcrumbNode, JsonLd, webPageNode } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description: aboutIntro,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            path: "/about",
            title: "About",
            description: aboutIntro,
            type: "AboutPage",
          }),
          breadcrumbNode("/about", [
            { name: "Home", path: "/" },
            { name: "About" },
          ]),
        ]}
      />
      <PageHeader
        eyebrow="About the company"
        title="The company is new. The experience isn't."
        lead={aboutIntro}
      />

      <OfficeStory
        id="story"
        className="scroll-mt-16"
        paragraphs={aboutStory}
        images={siteImages.about}
      />

      <OfficeMission id="mission" mission={mission} vision={vision} />

      <OfficeTeam id="team" members={teamMembers} />

      {/* scroll-mt-16 clears the h-16 sticky header on anchor navigation —
          same 64px as the Lenis `anchors: { offset: -64 }` and the header's
          IntersectionObserver rootMargin (components/motion/smooth-scroll.tsx,
          components/site/site-header.tsx). */}
      <Section id="approach" size="default" className="scroll-mt-16">
        <Container>
          <h2 className="text-eyebrow text-muted-foreground">How we work</h2>
          <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2">
            {approach.map((item, index) => (
              <div key={item.title} className="border-t border-border pt-6">
                <p className="text-eyebrow text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-h3">{item.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-20">
            <StatementBand {...statements.about} />
          </div>
        </Container>
      </Section>

      <OfficeCommitments id="commitments" items={commitments} />

      <CareersBand copy={aboutCareers} />

      <Section size="default" surface="muted">
        <Container>
          <PartnerStrip intro={partnersIntro} partners={partners} />
        </Container>
      </Section>

      <ContactCta copy={ctaVariants.about} />
    </>
  );
}
