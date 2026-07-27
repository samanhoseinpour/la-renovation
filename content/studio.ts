export type Stat = {
  value: string;
  label: string;
};

export type Testimonial = {
  quote: string;
  /** Role + city, not a name. Clients asked to stay anonymous. */
  attribution: string;
  /** Links the quote to its project card on /projects. */
  projectSlug?: string;
};

export type ProcessPhase = {
  index: string;
  title: string;
  description: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type CtaCopy = {
  heading: string;
  lead: string;
  label: string;
  href: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "They priced the podium deck while we were still moving columns. When the drawings landed, the number barely moved.",
    attribution: "Development manager, Anaheim",
    projectSlug: "harbor-mixed-use",
  },
  {
    quote:
      "The site package was the first time our civil and building schedules came from the same office. Nothing waited on a handoff.",
    attribution: "Owner's representative, Tustin",
    projectSlug: "tustin-legacy-site-package",
  },
  {
    quote:
      "They told us what the lot would support before we paid for drawings, and the unit came in the way they said it would.",
    attribution: "Homeowner, Costa Mesa",
    projectSlug: "costa-mesa-adu",
  },
];

/** Looks up the quote tied to a project, if one exists. Used on project detail pages. */
export function getTestimonialFor(slug: string) {
  return testimonials.find((t) => t.projectSlug === slug) ?? null;
}

/** How an engagement runs, start to finish. Shown on /services. */
export const processPhases: ProcessPhase[] = [
  {
    index: "01",
    title: "Feasibility",
    description:
      "We test what the site supports — soil, utilities, access, zoning — before design spends money on assumptions.",
  },
  {
    index: "02",
    title: "Preconstruction",
    description:
      "Budget, constructability, and permitting move alongside design, so the number and the drawings arrive together.",
  },
  {
    index: "03",
    title: "Sitework & structure",
    description:
      "Our own crews take the scopes that set the schedule: earthwork, utilities, foundations, structure.",
  },
  {
    index: "04",
    title: "Systems & envelope",
    description:
      "Energy infrastructure, mechanical coordination, and the envelope are sequenced in rather than bolted on.",
  },
  {
    index: "05",
    title: "Closeout",
    description:
      "Inspections, commissioning, and documentation, finished the way they were priced.",
  },
];

export const faqs: Faq[] = [
  {
    question: "What kind of projects do you take on?",
    answer:
      "Multifamily and mixed-use, commercial and institutional, and civil site development, alongside the energy, concrete, and preconstruction scopes that support them. Most projects touch several divisions at once, which is the reason we hold them under one roof.",
  },
  {
    question: "Do you self-perform or subcontract?",
    answer:
      "We self-perform the scopes that set the schedule — sitework, foundations, structure, and the energy systems increasingly tied to permitting. Specialty trades go to licensed partners we name and stand behind, not whoever bids lowest that week.",
  },
  {
    question: "How early should we bring you in?",
    answer:
      "At feasibility, before design commits to anything. Bring us in there and the budget develops against the site instead of getting reset by it later.",
  },
  {
    question: "What will it cost?",
    answer:
      "There is no standard number. We develop the budget against your site during preconstruction, so you know the cost of a decision when you make it — not after.",
  },
  {
    question: "Where do you work?",
    answer:
      "We're based in Orange County and build across Southern California. Distance is rarely the constraint — scope and schedule are.",
  },
  {
    question: "Can you take just the sitework or energy scope?",
    answer:
      "Yes. Civil site development and energy infrastructure both run as standalone engagements, not only as part of a full build, for owners who need the ground work or the systems work without the rest of the contract.",
  },
];

/** Shown on /contact under the form. */
export const contactSteps: ProcessPhase[] = [
  {
    index: "01",
    title: "Tell us about the site",
    description: "Send the address or the plans — either is enough to start.",
  },
  {
    index: "02",
    title: "Walk it with us",
    description:
      "We look at what the ground, the utilities, and the agency will actually allow.",
  },
  {
    index: "03",
    title: "Get a straight read",
    description:
      "What the site supports, what it will take to build, and where the risk sits.",
  },
];

/** Project-stage options on the contact form. */
export const projectStages = [
  "Exploring feasibility",
  "Design underway",
  "Permit-ready",
  "Ready to build",
] as const;

/**
 * Trailing project-type option for visitors who can't map their plans onto a
 * named service. The string lands verbatim in the delivered enquiry email.
 */
export const projectTypeFallback = "Not sure yet";

/**
 * One CTA panel component, different copy per page. The same sentence on
 * six pages reads like a template; these don't.
 */
export const ctaVariants = {
  home: {
    heading: "Tell us about the site.",
    lead: "Send us the address or the plans. We'll tell you what it will support and what it will cost to build there.",
    label: "Book a call",
    href: "/contact",
  },
  projects: {
    heading: "Your site could be next.",
    lead: "Every project here started as a piece of ground and a set of questions. Send us yours.",
    label: "Book a site visit",
    href: "/contact",
  },
  services: {
    heading: "Not sure which division you need?",
    lead: "Describe the project and we'll tell you which scopes it touches — and which ones we'd hold ourselves.",
    label: "Book a call",
    href: "/contact",
  },
  about: {
    heading: "Put us on your next project.",
    lead: "One number, one schedule, one company answering for the result. Start with the address.",
    label: "Get in touch",
    href: "/contact",
  },
} satisfies Record<string, CtaCopy>;

/** Project pages personalise the panel with the project's neighborhood. */
export function projectCta(neighborhood: string): CtaCopy {
  return {
    heading: `Building in ${neighborhood}?`,
    lead: "Send us the address or the plans. We'll tell you what it will support and what it will cost to build there.",
    label: "Book a site visit",
    href: "/contact",
  };
}
