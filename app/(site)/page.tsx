import { ArrowLink } from "@/components/layout/arrow-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ClientNotes } from "@/components/sections/client-notes";
import { CompanyIntro } from "@/components/sections/company-intro";
import { ContactCta } from "@/components/sections/contact-cta";
import { CoverageBand } from "@/components/sections/coverage-band";
import { HomeHero } from "@/components/sections/home-hero";
import { ProcessStrip } from "@/components/sections/process-strip";
import { ProjectShowcase } from "@/components/sections/project-showcase";
import { ServiceCards } from "@/components/sections/service-cards";
import { TeamStrip } from "@/components/sections/team-strip";
import { companyIntro, coverage, divisionsIntro, processIntro, selectedWorkIntro, teamIntro } from "@/content/home";
import { siteImages } from "@/content/images";
import { getAllProjects } from "@/content/projects";
import { getAllServices } from "@/content/services";
import { ctaVariants, processPhases, testimonials } from "@/content/studio";
import { teamMembers } from "@/content/team";
import { published } from "@/lib/site";

export default function HomePage() {
  const projects = getAllProjects().slice(0, 4);
  const services = getAllServices();

  return (
    <>
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
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
            <div>
              <h2 className="text-eyebrow text-muted-foreground">
                {divisionsIntro.eyebrow}
              </h2>
              <p className="mt-6 max-w-xs text-h2">
                {divisionsIntro.heading}
              </p>
              <div className="mt-8">
                <ArrowLink href={divisionsIntro.link!.href}>
                  {divisionsIntro.link!.label}
                </ArrowLink>
              </div>
            </div>

            <ServiceCards services={services} className="lg:col-span-2" />
          </div>
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
          <TeamStrip intro={teamIntro} members={teamMembers} />
        </Container>
      </Section>

      {published.testimonials && <ClientNotes testimonials={testimonials} />}

      <ContactCta copy={ctaVariants.home} />
    </>
  );
}
