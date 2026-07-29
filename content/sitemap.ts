import { accessibilityStatement, privacyPolicy, termsOfUse } from "./legal";
import { getAllProjects } from "./projects";
import { getAllServices } from "./services";

export type SitemapEntry = {
  href: string;
  index: string;
  title: string;
  /** Pre-composed meta line — the separator and phrasing are copy decisions. */
  meta?: string;
};

export type SitemapGroup = {
  label: string;
  entries: SitemapEntry[];
};

/** PageHeader copy for /sitemap; the lead doubles as the meta description. */
export const sitemapHeader = {
  eyebrow: "Sitemap",
  title: "The whole site, one page.",
  lead: "Every page on the site in one list, from the main pages down to the fine print.",
};

/**
 * Lean projection of the site tree for the /sitemap directory. Only live
 * routes belong here, and /styleguide stays internal. Project/service meta
 * lines match content/nav.ts — change the two together.
 */
export function getSitemapGroups(): SitemapGroup[] {
  return [
    {
      label: "Pages",
      entries: [
        { href: "/", index: "01", title: "Home" },
        { href: "/projects", index: "02", title: "Projects", meta: "Built and current work" },
        { href: "/services", index: "03", title: "Services", meta: "What we take on" },
        { href: "/about", index: "04", title: "About", meta: "Story, mission, team" },
        { href: "/faq", index: "05", title: "FAQ", meta: "Answers, grouped by topic" },
        { href: "/careers", index: "06", title: "Careers", meta: "Working here" },
        { href: "/contact", index: "07", title: "Contact", meta: "Start a conversation" },
      ],
    },
    {
      label: "Projects",
      entries: getAllProjects().map((project) => ({
        href: `/projects/${project.slug}`,
        index: project.index,
        title: project.title,
        meta: `${project.neighborhood} · ${project.scope}`,
      })),
    },
    {
      label: "Services",
      entries: getAllServices().map((service) => ({
        href: `/services/${service.slug}`,
        index: service.index,
        title: service.title,
        meta: service.scope,
      })),
    },
    {
      // /licenses stays unlisted here, as everywhere, until the real CSLB
      // number lands — see the README route notes.
      label: "Legal",
      entries: [
        { href: "/privacy", index: "01", title: privacyPolicy.title },
        { href: "/terms", index: "02", title: termsOfUse.title },
        { href: "/accessibility", index: "03", title: accessibilityStatement.title },
      ],
    },
  ];
}
