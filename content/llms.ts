import { published, site } from "@/lib/site";

import { accessibilityStatement, privacyPolicy, termsOfUse } from "./legal";
import { getAllServices } from "./services";

/**
 * Body of /llms.txt (llmstxt.org shape: H1, blockquote summary, H2 link
 * sections). A cheap hedge, not a lever: Google states it ignores the file,
 * and fetch studies show most copies are never read — but agents that do
 * look get an honest, register-compliant map. Mirrors the same publish
 * gates as every other surface.
 */
export function llmsText(): string {
  const url = (path: string) => `${site.url}${path === "/" ? "/" : path}`;
  const line = (title: string, path: string, note: string) =>
    `- [${title}](${url(path)}): ${note}`;

  const pages = [
    line("Home", "/", site.description),
    ...(published.projects
      ? [line("Projects", "/projects", "Selected work across the divisions.")]
      : []),
    line(
      "Services",
      "/services",
      "The construction divisions, how projects run, and the self-perform delivery model.",
    ),
    line("About", "/about", "Who the company is, the team, and how the work runs."),
    line("FAQ", "/faq", "The questions owners ask before a project starts, answered plainly."),
    line("Careers", "/careers", "Introductions from people in the trades and in preconstruction."),
    line("Contact", "/contact", "Start a project. Phone, email, and the Los Angeles office."),
  ];

  const services = getAllServices().map((service) =>
    line(service.title, `/services/${service.slug}`, service.summary),
  );

  const legal = [
    line(privacyPolicy.title, "/privacy", "What the site collects, which is almost nothing."),
    line(termsOfUse.title, "/terms", "How the site may be used."),
    line(
      accessibilityStatement.title,
      "/accessibility",
      "How the site works with a keyboard, a screen reader, and reduced motion.",
    ),
  ];

  return [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `A Southern California general contractor. ${site.tagline}`,
    "",
    "## Pages",
    "",
    ...pages,
    "",
    "## Services",
    "",
    ...services,
    "",
    "## Legal",
    "",
    ...legal,
    "",
  ].join("\n");
}
