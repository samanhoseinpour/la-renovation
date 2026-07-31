/** Eyebrow label plus optional sentence, lead and ArrowLink for a home section. */
export type SectionIntro = {
  eyebrow: string;
  heading?: string;
  lead?: string;
  link?: { label: string; href: string };
};

export type CompanyIntroCopy = SectionIntro & { paragraphs: string[] };

/**
 * Hero copy, including both secondary-CTA labels — the component picks by
 * `published.projects` so the flag flip needs no copy edit.
 */
export const homeHero = {
  eyebrow: "Southern California",
  heading: "Ground to grid.",
  lead: "Multifamily, commercial, and civil construction across Southern California: site development, foundations, structure, and the systems that run a building. Most of it in house.",
  primaryCta: { label: "Book a call", href: "/contact" },
  secondaryCta: {
    published: { label: "View selected work", href: "/projects" },
    unpublished: { label: "Explore the services", href: "/services" },
  },
};

/** Intro row for the gated Selected Work section. */
export const selectedWorkIntro: SectionIntro = {
  eyebrow: "Selected work",
  link: { label: "All projects", href: "/projects" },
};

export const companyIntro: CompanyIntroCopy = {
  eyebrow: "Who we are",
  heading: "One company, from the ground up.",
  paragraphs: [
    "Araz Construction Group is a Southern California general contractor that keeps the deciding scopes of a project inside one company: sitework, concrete, structure, and energy, all on one schedule.",
    "Handoffs are where budgets move and schedules slip, so we built a company with fewer of them. When something changes in the field, there is no seam to argue over.",
  ],
  link: { label: "The full story", href: "/about" },
};

export const divisionsIntro: SectionIntro = {
  eyebrow: "What we do",
  heading: "Seven divisions. One contract.",
  link: { label: "All services", href: "/services" },
};

export const processIntro: SectionIntro = {
  eyebrow: "The process",
  heading: "Feasibility to closeout, one schedule.",
  link: { label: "How a project runs", href: "/services" },
};

export const coverage: SectionIntro = {
  eyebrow: "Where we build",
  heading: "All of Southern California.",
  lead: "Multifamily, commercial, and civil projects across the region, from raw ground to running systems. If the site is in Southern California, we'll come walk it.",
  link: { label: "Tell us about the site", href: "/contact" },
};

export const teamIntro: SectionIntro = {
  eyebrow: "The people",
  heading: "The people behind the divisions.",
  link: { label: "Meet the team", href: "/about#team" },
};

export const faqIntro: SectionIntro = {
  eyebrow: "Questions",
  heading: "The questions owners start with.",
  link: { label: "All questions", href: "/faq" },
};
