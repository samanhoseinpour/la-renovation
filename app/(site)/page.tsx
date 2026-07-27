import { ArrowLink } from "@/components/layout/arrow-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ClientNotes } from "@/components/sections/client-notes";
import { ContactCta } from "@/components/sections/contact-cta";
import { HomeHero } from "@/components/sections/home-hero";
import { ProjectShowcase } from "@/components/sections/project-showcase";
import { ServiceCards } from "@/components/sections/service-cards";
import { getAllProjects } from "@/content/projects";
import { getAllServices } from "@/content/services";
import { ctaVariants, testimonials } from "@/content/studio";

export default function HomePage() {
  const projects = getAllProjects().slice(0, 4);
  const services = getAllServices();

  return (
    <>
      <HomeHero />

      <Section size="default" className="border-t border-border">
        <Container>
          <div className="flex items-baseline justify-between gap-8">
            <h2 className="text-eyebrow text-muted-foreground">
              Selected work
            </h2>
            <ArrowLink href="/projects">All projects</ArrowLink>
          </div>

          <div className="mt-14">
            <ProjectShowcase projects={projects} />
          </div>
        </Container>
      </Section>

      <Section size="default" surface="muted">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
            <div>
              <h2 className="text-eyebrow text-muted-foreground">What we do</h2>
              <p className="mt-6 max-w-xs text-h2">
                Seven divisions. One contract.
              </p>
              <div className="mt-8">
                <ArrowLink href="/services">All services</ArrowLink>
              </div>
            </div>

            <ServiceCards services={services} className="lg:col-span-2" />
          </div>
        </Container>
      </Section>

      <ClientNotes testimonials={testimonials} />

      <ContactCta copy={ctaVariants.home} />
    </>
  );
}
