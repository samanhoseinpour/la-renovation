export type { Faq } from "./faq";

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

export type CtaCopy = {
  eyebrow: string;
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
      "Soil, utilities, access, zoning: we test what the site supports before design spends money on assumptions.",
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

/** Shown on /contact under the form. */
export const contactSteps: ProcessPhase[] = [
  {
    index: "01",
    title: "Tell us about the site",
    description: "Send the address or the plans. Either is enough to start.",
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

export type ContactPageCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  /** Sits above the form fields: what to send for a specific first answer. */
  formIntro: string;
  /** The response promise under the lead. Client-authored; flagged in the spec. */
  commitment: string;
  officeHeading: string;
  /** Rail closer: deflects question-shaped visits to the FAQ. */
  faq: { note: string; link: { label: string; href: string } };
};

/** /contact page copy. Title and lead moved out of the route unchanged. */
export const contactPage: ContactPageCopy = {
  eyebrow: "Contact",
  title: "Tell us about the project.",
  lead: "Every project starts with a site visit. Send a few details and we'll arrange one.",
  formIntro:
    "The more you can tell us about the site and the program, the more useful our first response will be. If you have drawings, a survey, or a soils report, send them. We'd rather answer specifically than generally.",
  commitment:
    "We respond to every enquiry. If the project isn't a fit for us, we'll say so and point you toward someone better suited rather than taking the meeting anyway.",
  officeHeading: "Office",
  faq: {
    note: "Here with a question rather than a project? The FAQ may already have the answer.",
    link: { label: "Browse the FAQ", href: "/faq" },
  },
};

/**
 * Every string the contact form renders: group headings, field labels,
 * placeholders, legends, helper lines, the submit pair and the confirmation
 * panel. The zod error messages stay beside the schema in
 * app/(site)/contact/schema.ts; the server-only outcome messages stay in
 * the action.
 */
export const contactForm = {
  groups: {
    about: {
      heading: "About you",
      note: "Name and email are all we need to reply. The rest helps us come prepared.",
    },
    project: {
      heading: "The project",
      note: "Tell us as much or as little as you know at this point.",
    },
  },
  optionalTag: "Optional",
  requiredHint: "Fields marked * are required.",
  fields: {
    name: { label: "Name", placeholder: "Alex Rivera" },
    email: { label: "Email", placeholder: "you@company.com" },
    // 555-01XX is the reserved fictional range; the office's own area code.
    phone: { label: "Phone", placeholder: "(424) 555-0134" },
    company: { label: "Company", placeholder: "Company or organization" },
    services: {
      legend: "What does the project involve?",
      help: "Choose everything that applies.",
    },
    stage: {
      legend: "Where does it stand?",
      help: "Skip this if you aren't sure yet.",
    },
    message: {
      label: "Anything else we should know?",
      help: "Where the property is, what you're hoping to do, and roughly when.",
      placeholder: "The site address is a good start.",
    },
  },
  errorSummary: "Please check the highlighted fields.",
  submit: "Send enquiry",
  submitting: "Sending…",
  success: {
    eyebrow: "Enquiry received",
    urgentPrefix: "If it's urgent, call",
    urgentSuffix: "during office hours.",
    again: "Send another enquiry",
  },
} as const;

export type ContactFormCopy = typeof contactForm;

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
    eyebrow: "Start a project",
    heading: "Tell us about the site.",
    lead: "Send us the address or the plans. We'll tell you what it will support and what it will cost to build there.",
    label: "Book a call",
    href: "/contact",
  },
  projects: {
    eyebrow: "Start a project",
    heading: "Your site could be next.",
    lead: "Every project here started as a piece of ground and a set of questions. Send us yours.",
    label: "Book a site visit",
    href: "/contact",
  },
  /** Shown on /projects while the portfolio is unpublished. */
  projectsComingSoon: {
    eyebrow: "Start a project",
    heading: "Be one of the first on this page.",
    lead: "The portfolio is coming. Your project could be in it. Send us the site and we'll take it from the ground up.",
    label: "Book a call",
    href: "/contact",
  },
  services: {
    eyebrow: "Start a project",
    heading: "Not sure which division you need?",
    lead: "Describe the project and we'll tell you which scopes it touches, and which ones we'd hold ourselves.",
    label: "Book a call",
    href: "/contact",
  },
  about: {
    eyebrow: "Start a project",
    heading: "Put us on your next project.",
    lead: "One number, one schedule, one company answering for the result. Start with the address.",
    label: "Get in touch",
    href: "/contact",
  },
  faq: {
    eyebrow: "Get an answer",
    heading: "Didn't find your question?",
    lead: "Ask it the direct way. Describe the project and we'll answer for your site, not in general terms.",
    label: "Ask us directly",
    href: "/contact",
  },
  licenses: {
    eyebrow: "Due diligence",
    heading: "Want the paperwork?",
    lead: "Ask for it. License details and certificates of insurance, before you commit to anything.",
    label: "Request the paperwork",
    href: "/contact",
  },
} satisfies Record<string, CtaCopy>;

export type StatementCopy = {
  eyebrow?: string;
  statement: string;
};

/**
 * Single-voice brand statements for the StatementBand. These are the house
 * speaking, not clients — client-notes stays the testimonial surface.
 * Division pages carry theirs on `Service.statement`.
 */
export const statements: { services: StatementCopy; about: StatementCopy } = {
  services: { statement: "Most construction problems are handoff problems." },
  about: {
    statement: "Low carbon is an engineering outcome, not a marketing position.",
  },
};

/** Project pages personalise the panel with the project's neighborhood. */
export function projectCta(neighborhood: string): CtaCopy {
  return {
    eyebrow: "Start a project",
    heading: `Building in ${neighborhood}?`,
    lead: "Send us the address or the plans. We'll tell you what it will support and what it will cost to build there.",
    label: "Book a site visit",
    href: "/contact",
  };
}
