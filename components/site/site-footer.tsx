import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { getAllProjects } from "@/content/projects";
import { getAllServices } from "@/content/services";
import { site } from "@/lib/site";

/**
 * Rethemed from @shadcnblocks/footer5. The four-column responsive grid is the
 * part worth keeping. Dropped: the react-icons dependency (social links are
 * text here, which suits the editorial direction), the "Mobile App" store
 * badges, and the fixed py-32 — vertical rhythm comes from <Section>.
 */
export function SiteFooter() {
  const columns = [
    {
      title: "Studio",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Projects", href: "/projects" },
      ],
    },
    {
      title: "Services",
      links: getAllServices().map((service) => ({
        label: service.title,
        href: `/services/${service.slug}`,
      })),
    },
    {
      title: "Selected work",
      links: getAllProjects()
        .slice(0, 4)
        .map((project) => ({
          label: project.title,
          href: `/projects/${project.slug}`,
        })),
    },
  ];

  return (
    <Section as="footer" size="sm" className="mt-auto border-t border-border">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-h3">{site.name}</p>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {site.tagline}
            </p>
            <address className="mt-6 text-sm not-italic text-muted-foreground">
              {site.contact.address.street}
              <br />
              {site.contact.address.city}, {site.contact.address.state}{" "}
              {site.contact.address.zip}
            </address>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-eyebrow text-muted-foreground">
                {column.title}
              </p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <a
              href={`mailto:${site.contact.email}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {site.contact.email}
            </a>
            <a
              href={site.contact.phoneHref}
              className="text-sm tabular text-muted-foreground transition-colors hover:text-foreground"
            >
              {site.contact.phone}
            </a>
            {site.social.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {social.label}
              </a>
            ))}
          </div>

          <p className="text-eyebrow text-muted-foreground">
            {site.license} · © {new Date().getFullYear()}
          </p>
        </div>
      </Container>
    </Section>
  );
}
