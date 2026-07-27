import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ContactCta } from "@/components/sections/contact-cta";
import { PageHeader } from "@/components/sections/page-header";
import { StudioMission } from "@/components/sections/studio-mission";
import { StudioStory } from "@/components/sections/studio-story";
import { StudioTeam } from "@/components/sections/studio-team";
import { aboutFacts, aboutIntro, aboutStory, approach, mission, vision } from "@/content/about";
import { siteImages } from "@/content/images";
import { ctaVariants } from "@/content/studio";
import { teamMembers } from "@/content/team";

export const metadata: Metadata = {
  title: "About",
  description: aboutIntro,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About the company"
        title="The company is new. The experience isn't."
        lead={aboutIntro}
      />

      <StudioStory
        id="story"
        className="scroll-mt-16"
        paragraphs={aboutStory}
        images={siteImages.about}
        facts={aboutFacts}
      />

      <StudioMission id="mission" mission={mission} vision={vision} />

      <StudioTeam id="team" members={teamMembers} />

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
        </Container>
      </Section>

      <ContactCta copy={ctaVariants.about} />
    </>
  );
}
