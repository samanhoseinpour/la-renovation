import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLink } from "@/components/layout/arrow-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CompareGallery } from "@/components/sections/compare-gallery";
import { ContactCta } from "@/components/sections/contact-cta";
import { ProjectGallery } from "@/components/sections/project-gallery";
import { blurProps } from "@/content/blur";
import { getAllProjects, getProject } from "@/content/projects";
import { getService } from "@/content/services";
import { getTestimonialFor, projectCta } from "@/content/studio";
import { absoluteUrl, breadcrumbNode, JsonLd, webPageNode } from "@/lib/seo";

type Props = {
  // params is a Promise in Next.js 16 — synchronous access was removed.
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  // No openGraph block — same reasoning as services/[slug]: the layout's
  // siteName/locale survive only on the fallback path.
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const all = getAllProjects();
  const index = all.findIndex((p) => p.slug === project.slug);
  const next = all[(index + 1) % all.length];
  const testimonial = getTestimonialFor(project.slug);

  return (
    <>
      {/* Reachable only while published.projects is true — getProject returns
          undefined for gated slugs, so demo markup never ships. */}
      <JsonLd
        graph={[
          webPageNode({
            path: `/projects/${project.slug}`,
            title: project.title,
            description: project.summary,
            extra: {
              primaryImageOfPage: {
                "@type": "ImageObject",
                contentUrl: absoluteUrl(project.image.src),
                description: project.image.alt,
              },
            },
          }),
          breadcrumbNode(`/projects/${project.slug}`, [
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: project.title },
          ]),
        ]}
      />
      <Section size="sm" className="border-b border-border">
        <Container>
          <p className="text-eyebrow text-muted-foreground">
            {project.index} / {project.neighborhood} / {project.scope}
          </p>
          <h1 className="mt-6 max-w-4xl text-display-2 text-balance">
            {project.title}
          </h1>
          <p className="mt-8 max-w-xl text-lead text-muted-foreground">
            {project.summary}
          </p>
        </Container>
      </Section>

      <Section size="default">
        <Container>
          <div className="relative aspect-16/9 w-full overflow-hidden rounded-3xl bg-secondary">
            <Image
              src={project.image.src}
              alt={project.image.alt}
              {...blurProps(project.image.src)}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="mt-20 grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="space-y-6">
                {/* Index keys: the list is static content and never reorders,
                    and a content prefix collides the moment two paragraphs
                    open the same way. */}
                {project.body.map((paragraph, i) => (
                  <p key={i} className="text-lead">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-4 lg:col-start-9">
              <h2 className="text-eyebrow text-muted-foreground">Project</h2>
              <dl className="mt-6 border-t border-border">
                {project.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex justify-between gap-6 border-b border-border py-4"
                  >
                    <dt className="text-sm text-muted-foreground">
                      {fact.label}
                    </dt>
                    <dd className="text-sm tabular text-right">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <h2 className="mt-12 text-eyebrow text-muted-foreground">
                Services
              </h2>
              <ul className="mt-5 space-y-3">
                {project.services.map((serviceSlug) => {
                  const service = getService(serviceSlug);
                  if (!service) return null;
                  return (
                    <li key={serviceSlug}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {service.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </div>

          {testimonial ? (
            <figure className="mt-20 flex flex-col gap-6 border-t border-border pt-10 md:flex-row md:items-baseline md:justify-between md:gap-16 md:pt-14">
              <blockquote className="max-w-3xl text-h3">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="shrink-0 text-eyebrow text-muted-foreground">
                {testimonial.attribution}
              </figcaption>
            </figure>
          ) : null}
        </Container>
      </Section>

      {/* Gallery and next-project share one Section: as separate sections
          their paddings stacked into a dead band twice the intended rhythm. */}
      <Section size="sm">
        <Container>
          {project.compare?.length ? (
            <div className="mb-16">
              <CompareGallery pairs={project.compare} />
            </div>
          ) : null}

          <ProjectGallery images={project.gallery} />

          <div className="mt-16 flex flex-col gap-6 border-t border-border pt-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-eyebrow text-muted-foreground">Next project</p>
              <p className="mt-4 text-h2">{next.title}</p>
            </div>
            <div className="flex items-end gap-6">
              {/* Decorative duplicate of the ArrowLink target; md+ only —
                  between 640-900px the fixed thumb collided with the title. */}
              <Link
                href={`/projects/${next.slug}`}
                tabIndex={-1}
                aria-hidden
                className="hidden w-40 shrink-0 md:block"
              >
                <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-secondary">
                  <Image
                    src={next.image.src}
                    alt=""
                    {...blurProps(next.image.src)}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
              </Link>
              <ArrowLink href={`/projects/${next.slug}`}>
                {next.neighborhood}
              </ArrowLink>
            </div>
          </div>
        </Container>
      </Section>

      <ContactCta copy={projectCta(project.neighborhood)} />
    </>
  );
}
