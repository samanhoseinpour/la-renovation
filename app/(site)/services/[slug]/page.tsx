import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArrowLink } from "@/components/layout/arrow-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ContactCta } from "@/components/sections/contact-cta";
import { ProjectCard } from "@/components/sections/project-card";
import { ServiceNarrative } from "@/components/sections/service-narrative";
import { Badge } from "@/components/ui/badge";
import { getAllProjects } from "@/content/projects";
import { getAllServices, getService } from "@/content/services";
import { ctaVariants } from "@/content/studio";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllServices().map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) return {};

  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.title,
      description: service.summary,
      type: "article",
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) notFound();

  const related = getAllProjects()
    .filter((project) => project.services.includes(service.slug))
    .slice(0, 3);

  return (
    <>
      <Section size="sm" className="border-b border-border">
        <Container>
          <p className="text-eyebrow text-muted-foreground">
            Service {service.index}
          </p>
          <h1 className="mt-6 max-w-4xl text-display-2 text-balance">
            {service.title}
          </h1>
          <p className="mt-8 max-w-xl text-lead text-muted-foreground">
            {service.summary}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Badge variant="outline">{service.scope}</Badge>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <ServiceNarrative service={service} />
        </Container>
      </Section>

      <Section size="sm" className="border-t border-border">
        <Container>
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-12">
              <h2 className="text-eyebrow text-muted-foreground lg:col-span-4">
                What&rsquo;s included
              </h2>
              <ul className="border-t border-border lg:col-span-7 lg:col-start-6">
                {service.includes.map((item) => (
                  <li
                    key={item}
                    className="border-b border-border py-4 text-sm"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section surface="muted">
          <Container>
            <div className="flex items-baseline justify-between gap-8">
              <h2 className="text-eyebrow text-muted-foreground">
                Related work
              </h2>
              <ArrowLink href="/projects">All projects</ArrowLink>
            </div>
            <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <ContactCta copy={ctaVariants.services} />
    </>
  );
}
