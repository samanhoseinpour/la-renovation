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
  // Client-supplied paragraph, kept verbatim (their wording overrides the
  // house no-figures register here).
  lead: "Araz Construction Group is a Southern California general contractor specializing in sustainable energy infrastructure, including EV charging and geothermal projects, alongside commercial, civil, and multifamily developments. Dedicated to environmental stewardship and reducing carbon footprints, Araz self-performs critical scopes, such as sitework, foundations, and engineering structures, while seamlessly integrating renewable systems into every build. By consolidating these phases under a single contract, Araz eliminates communication gaps, minimizes delays, and ensures strict accountability from ground to grid, all driven by the decades of collective hands-on engineering, project management, and field execution experience of its team.",
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
  // The hero above states what Araz is (the client's verbatim paragraph);
  // this section carries the why instead, so home doesn't read twice.
  paragraphs: [
    "Most projects are built by a chain of companies: one grades the site, another pours the structure, a third shows up late to fit the systems in. Every handoff in that chain is a seam, and seams are where budgets move and schedules slip.",
    "We structured Araz so the seams never open: sitework, concrete, structure, and energy are divisions of one company, priced by one office, accountable to one schedule.",
    "It's also why energy leads the divisions rather than trailing the trades: the systems a building is approved on are engineered in from the first drawing, not fitted around a finished shell.",
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
  lead: "Energy, commercial, civil, and multifamily projects across the region, from raw ground to running systems. If the site is in Southern California, we'll come walk it.",
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
