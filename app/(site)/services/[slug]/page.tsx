import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArrowLink } from "@/components/layout/arrow-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ContactCta } from "@/components/sections/contact-cta";
import { DivisionDeepDive } from "@/components/sections/division-deep-dive";
import { ProjectCard } from "@/components/sections/project-card";
import { ServiceNarrative } from "@/components/sections/service-narrative";
import { StatementBand } from "@/components/sections/statement-band";
import { Badge } from "@/components/ui/badge";
import { getAllProjects } from "@/content/projects";
import { getAllServices, getService } from "@/content/services";
import { ctaVariants } from "@/content/studio";
import { breadcrumbNode, JsonLd, serviceNode, webPageNode } from "@/lib/seo";

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

  // No openGraph block: a page-level one replaces the layout's wholesale,
  // dropping og:site_name and og:locale; the fallback path keeps them and
  // still emits this page's title and description.
  return {
    title: service.title,
    description: service.metaDescription ?? service.summary,
    alternates: { canonical: `/services/${service.slug}` },
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
      <JsonLd
        graph={[
          webPageNode({
            path: `/services/${service.slug}`,
            title: service.title,
            description: service.metaDescription ?? service.summary,
          }),
          breadcrumbNode(`/services/${service.slug}`, [
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title },
          ]),
          serviceNode(service),
        ]}
      />
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

      {service.deepDive && <DivisionDeepDive deepDive={service.deepDive} />}

      {service.statement && (
        <Section size="sm">
          <Container>
            <StatementBand statement={service.statement} />
          </Container>
        </Section>
      )}

      {related.length > 0 && (
        <Section surface={service.deepDive ? "default" : "muted"}>
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

      <ContactCta copy={service.cta ?? ctaVariants.services} />
    </>
  );
}
