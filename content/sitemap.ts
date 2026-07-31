import { published } from "@/lib/site";

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
  // Indices are derived, not hand-numbered, so gated entries (Projects while
  // unpublished) never leave a gap in the count.
  const pages = [
    { href: "/", title: "Home" },
    ...(published.projects
      ? [{ href: "/projects", title: "Projects", meta: "Built and current work" }]
      : []),
    { href: "/services", title: "Services", meta: "What we take on" },
    { href: "/about", title: "About", meta: "Story, mission, team" },
    { href: "/faq", title: "FAQ", meta: "Answers, grouped by topic" },
    { href: "/careers", title: "Careers", meta: "Working here" },
    { href: "/contact", title: "Contact", meta: "Start a conversation" },
  ];

  const groups: SitemapGroup[] = [
    {
      label: "Pages",
      entries: pages.map((page, i) => ({
        ...page,
        index: String(i + 1).padStart(2, "0"),
      })),
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

  // Groups that gate down to nothing (Projects while unpublished) drop out
  // rather than rendering a heading over an empty list.
  return groups.filter((group) => group.entries.length > 0);
}
