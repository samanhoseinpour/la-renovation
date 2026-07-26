import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ContactCta } from "@/components/sections/contact-cta";
import { PageHeader } from "@/components/sections/page-header";
import { ProjectShowcase } from "@/components/sections/project-showcase";
import { getAllProjects } from "@/content/projects";
import { ctaVariants } from "@/content/studio";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected renovations, additions and ADUs across Los Angeles — Los Feliz, Laurel Canyon, Venice and Silver Lake.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <>
      <PageHeader
        eyebrow={`Selected work · ${projects.length} projects`}
        title="Houses we have taken apart and put back together."
        lead="Most of our work is on Los Angeles housing stock built between 1920 and 1970. The constraints are rarely where people expect."
      />

      <Section size="default">
        <Container>
          <ProjectShowcase projects={projects} showFacts />
        </Container>
      </Section>

      <ContactCta copy={ctaVariants.projects} />
    </>
  );
}
