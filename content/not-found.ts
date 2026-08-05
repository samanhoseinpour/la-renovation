export type NotFoundCopy = {
  /** Section name for the eyebrow, e.g. "Error 404 / Projects". */
  label?: string;
  heading: string;
  lead: string;
};

/** The two exits on the 404 page. Everything else on it is copy below. */
export const notFoundActions = {
  home: { label: "Back to the office", href: "/" },
  sitemap: { label: "Explore the sitemap", href: "/sitemap" },
};

/** Unknown addresses that match no site section. */
export const notFoundFallback: NotFoundCopy = {
  heading: "There's nothing at this address.",
  lead: "The page you were after was moved, retired, or never built. The rest of the site is still standing.",
};

const legal: Omit<NotFoundCopy, "label"> = {
  heading: "This clause doesn't exist.",
  lead: "The fine print sits on three short pages, and every one of them is in the sitemap.",
};

/**
 * Per-section verdicts, keyed by the first path segment of the dead URL.
 * Each speaks to the part of the site the visitor was in; the fallback
 * covers everything else.
 */
export const notFoundSections: Record<string, NotFoundCopy> = {
  projects: {
    label: "Projects",
    heading: "No project at this address.",
    lead: "The link may have outlived the page it pointed to. The projects page is the place to start.",
  },
  services: {
    label: "Services",
    heading: "No division answers to this name.",
    lead: "The scopes we hold, and the divisions that hold them, are all on the services page.",
  },
  about: {
    label: "About",
    heading: "This chapter was never written.",
    lead: "The story fits on one page, and this address isn't on it. The about page has the whole thing.",
  },
  contact: {
    label: "Contact",
    heading: "This route doesn't reach the office.",
    lead: "The contact page has the form and the direct lines. Start there and a person answers.",
  },
  faq: {
    label: "FAQ",
    heading: "That question isn't in the stack.",
    lead: "The questions we do get asked live on the FAQ page, sorted by topic.",
  },
  careers: {
    label: "Careers",
    heading: "This opening doesn't exist.",
    lead: "The roles we're hiring for are on the careers page, next to the application panel.",
  },
  licenses: {
    label: "Licenses",
    heading: "This paper isn't on file.",
    lead: "Licensing has its own page, and the paperwork behind it is available on request.",
  },
  privacy: { label: "Privacy", ...legal },
  terms: { label: "Terms", ...legal },
  accessibility: { label: "Accessibility", ...legal },
  sitemap: {
    label: "Sitemap",
    heading: "The index has no such entry.",
    lead: "The sitemap itself is one level up, and it lists every page on the site.",
  },
};

/** Resolves the copy for a dead URL from its first path segment. */
export function getNotFoundCopy(pathname: string | null): NotFoundCopy {
  const section = pathname?.split("/").filter(Boolean)[0]?.toLowerCase();
  return (section && notFoundSections[section]) || notFoundFallback;
}
