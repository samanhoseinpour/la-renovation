import type { Metadata } from "next";

import { ArrowLink } from "@/components/layout/arrow-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ContactCta } from "@/components/sections/contact-cta";
import { PageHeader } from "@/components/sections/page-header";
import { ProjectIndex } from "@/components/sections/project-index";
import { ctaVariants } from "@/content/office";
import {
  getAllProjects,
  projectsComingSoon,
  projectsHeader,
} from "@/content/projects";
import { breadcrumbNode, JsonLd, webPageNode } from "@/lib/seo";
import { published } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description: published.projects
    ? projectsHeader.metaDescription
    : projectsComingSoon.metaDescription,
  alternates: { canonical: "/projects" },
  // Unindex while the portfolio is unpublished — same rule as /licenses.
  ...(published.projects ? {} : { robots: { index: false, follow: false } }),
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  if (projects.length === 0) {
    return (
      <>
        <PageHeader
          eyebrow={projectsComingSoon.eyebrow}
          title={projectsComingSoon.title}
          lead={projectsComingSoon.lead}
        />

        <Section size="default">
          <Container>
            <ArrowLink href="/services">See what we take on</ArrowLink>
          </Container>
        </Section>

        <ContactCta copy={ctaVariants.projectsComingSoon} />
      </>
    );
  }

  return (
    <>
      {/* Only the published portfolio carries markup; the gated coming-soon
          branch above is noindexed and emits none. */}
      <JsonLd
        graph={[
          webPageNode({
            path: "/projects",
            title: "Projects",
            description: projectsHeader.metaDescription,
            type: "CollectionPage",
          }),
          breadcrumbNode("/projects", [
            { name: "Home", path: "/" },
            { name: "Projects" },
          ]),
        ]}
      />
      <PageHeader
        eyebrow={`Selected work · ${projects.length} projects`}
        title={projectsHeader.title}
        lead={projectsHeader.lead}
      />

      <Section size="default">
        <Container>
          <ProjectIndex projects={projects} />
        </Container>
      </Section>

      <ContactCta copy={ctaVariants.projects} />
    </>
  );
}
