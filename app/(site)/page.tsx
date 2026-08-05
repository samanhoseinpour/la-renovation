import { ArrowLink } from "@/components/layout/arrow-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ClientNotes } from "@/components/sections/client-notes";
import { CompanyIntro } from "@/components/sections/company-intro";
import { ContactCta } from "@/components/sections/contact-cta";
import { CoverageBand } from "@/components/sections/coverage-band";
import { DivisionShowcase } from "@/components/sections/division-showcase";
import { FaqTeaser } from "@/components/sections/faq-teaser";
import { HomeHero } from "@/components/sections/home-hero";
import { PartnerStrip } from "@/components/sections/partner-strip";
import { ProcessStrip } from "@/components/sections/process-strip";
import { ProjectShowcase } from "@/components/sections/project-showcase";
import { TeamMarquee } from "@/components/sections/team-marquee";
import { getHomeFaqs } from "@/content/faq";
import { companyIntro, coverage, divisionsIntro, faqIntro, processIntro, selectedWorkIntro, teamIntro } from "@/content/home";
import { siteImages } from "@/content/images";
import { partners, partnersIntro } from "@/content/partners";
import { getAllProjects } from "@/content/projects";
import { getAllServices } from "@/content/services";
import { ctaVariants, processPhases, testimonials } from "@/content/studio";
import { teamMembers } from "@/content/team";
import { JsonLd, webPageNode } from "@/lib/seo";
import { published, site } from "@/lib/site";

export default function HomePage() {
  const projects = getAllProjects().slice(0, 4);
  const services = getAllServices();

  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            path: "/",
            title: `${site.name} · ${site.tagline}`,
            description: site.description,
          }),
        ]}
      />
      <HomeHero />

      {projects.length > 0 && (
        <Section size="default" className="border-t border-border">
          <Container>
            <div className="flex items-baseline justify-between gap-8">
              <h2 className="text-eyebrow text-muted-foreground">
                {selectedWorkIntro.eyebrow}
              </h2>
              <ArrowLink href={selectedWorkIntro.link!.href}>
                {selectedWorkIntro.link!.label}
              </ArrowLink>
            </div>

            <div className="mt-14">
              <ProjectShowcase projects={projects} />
            </div>
          </Container>
        </Section>
      )}

      <Section size="default" surface="muted">
        <Container>
          <CompanyIntro copy={companyIntro} images={siteImages.homeIntro} />
        </Container>
      </Section>

      <Section size="default">
        <Container>
          <DivisionShowcase
            intro={divisionsIntro}
            services={services}
            linkImage={siteImages.homeAllDivisions}
          />
        </Container>
      </Section>

      <Section size="default" surface="muted">
        <Container>
          <ProcessStrip intro={processIntro} phases={processPhases} />
        </Container>
      </Section>

      <CoverageBand copy={coverage} image={siteImages.homeCoverage} />

      <Section size="default">
        <Container>
          <TeamMarquee intro={teamIntro} members={teamMembers} />
        </Container>
      </Section>

      <Section size="default" surface="muted">
        <Container>
          <FaqTeaser intro={faqIntro} faqs={getHomeFaqs()} />
        </Container>
      </Section>

      <Section size="default">
        <Container>
          <PartnerStrip intro={partnersIntro} partners={partners} />
        </Container>
      </Section>

      {published.testimonials && <ClientNotes testimonials={testimonials} />}

      <ContactCta copy={ctaVariants.home} />
    </>
  );
}
