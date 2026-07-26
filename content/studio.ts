export type Stat = {
  value: string;
  label: string;
};

export type Testimonial = {
  quote: string;
  /** Neighborhood + scope, not a name. Clients asked to stay anonymous. */
  attribution: string;
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

/** Home page figures. Plain numerals, no marketing inflation. */
export const studioStats: Stat[] = [
  { value: "31", label: "projects completed since 2018" },
  { value: "74,000", label: "square feet of LA housing renovated" },
  { value: "2 in 3", label: "new clients arrive by referral" },
  { value: "11", label: "people, one office, no subcontracted design" },
];

/** About page variant: the studio itself rather than output. */
export const aboutStats: Stat[] = [
  { value: "2018", label: "founded in Silver Lake" },
  { value: "11", label: "architects, builders and one very patient PM" },
  { value: "9 of 9", label: "HPOZ submissions approved first round" },
  { value: "1962", label: "the oldest house we've taken back to frame" },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "In week two they told us the foundation money had to come before the kitchen money. Nobody else who bid the job said that out loud. The schedule we agreed in March was the schedule we lived with.",
    attribution: "Full renovation, Los Feliz",
  },
  {
    quote:
      "We stayed in the house for four months of the work. The dust walls went up before demolition started and came down the day the floors were sealed. I emailed on a Sunday exactly once, and was politely told to wait for the Monday site notes.",
    attribution: "Kitchen & bath, Venice",
  },
  {
    quote:
      "The house doesn't look renovated, which is what we asked for and didn't quite believe we'd get.",
    attribution: "Addition, Laurel Canyon",
  },
];

/** How an engagement runs, start to finish. Shown on /services. */
export const processPhases: ProcessPhase[] = [
  {
    index: "01",
    title: "Site visit",
    description:
      "We walk the house with you. No drawings and no pitch; we're looking at structure and listening to how you live.",
  },
  {
    index: "02",
    title: "Feasibility",
    description:
      "Measured survey, structural assessment, zoning check. You get a short memo on what the house will allow and a realistic cost range, before any design fees.",
  },
  {
    index: "03",
    title: "Design & permits",
    description:
      "Drawings develop under the same contract that will build them. We carry the permit set through plan check ourselves and answer corrections in-house.",
  },
  {
    index: "04",
    title: "Construction",
    description:
      "Fixed scope agreed before demolition. A weekly site walk with written notes, and an allowance schedule so every open decision stays visible.",
  },
  {
    index: "05",
    title: "Handover",
    description:
      "Punch list, systems walkthrough, and an as-built record of what's behind the walls. We come back at one year to check our work.",
  },
];

export const faqs: Faq[] = [
  {
    question: "What does a renovation actually cost?",
    answer:
      "Kitchens and baths from about $120k, whole-house work from $450k, ADUs from $280k. We publish ranges rather than averages because the era and structure of the house move the number far more than the finishes do. The feasibility memo narrows it for your house specifically.",
  },
  {
    question: "Can we live in the house during the work?",
    answer:
      "For single-room work, usually yes, behind a proper protection plan. For structural or whole-house work, no, and we'd rather tell you that at the first meeting than after you've planned around staying.",
  },
  {
    question: "How firm are your schedules?",
    answer:
      "The schedule is agreed alongside the fixed scope, and the weekly notes track it in writing. When something moves, you hear it from us that week with a reason attached, not at the end.",
  },
  {
    question: "Do you handle permits?",
    answer:
      "Yes, in-house. Permit sets, agency submissions and plan-check corrections are part of every engagement. On hillside and HPOZ lots this is most of the calendar, which is exactly why we don't outsource it.",
  },
  {
    question: "Our house is in an HPOZ. Is that a problem?",
    answer:
      "It's a process, not a problem. We prepare the documentation review boards actually want, and our submissions have so far been approved first round. Budget more calendar, not necessarily more money.",
  },
  {
    question: "Why design-build instead of an architect plus a contractor?",
    answer:
      "One contract means there is no gap where scope gets lost, no drawing set handed to a builder who reprices it, and one phone number when something needs deciding. You give up a second opinion; you gain a single point of responsibility.",
  },
  {
    question: "Where do you work?",
    answer:
      "Los Angeles, Eastside and Westside. Roughly: if we can get from Silver Lake to your site inside forty minutes, the weekly walk stays weekly.",
  },
];

/** Shown on /contact under the form. */
export const contactSteps: ProcessPhase[] = [
  {
    index: "01",
    title: "We reply within two working days",
    description:
      "A short email, usually with a few questions about the house and what prompted the project.",
  },
  {
    index: "02",
    title: "We walk the house",
    description:
      "If it sounds like a fit, we book a site visit. About an hour, no charge, no drawings yet.",
  },
  {
    index: "03",
    title: "You get a feasibility memo",
    description:
      "What the house allows, a realistic range, and a suggested next step, whether or not that step is with us.",
  },
];

/**
 * Budget options on the contact form. The bands bracket the published
 * service starting prices, so an answer maps straight onto likely scope.
 */
export const budgetBands = [
  "Under $150k",
  "$150k – $300k",
  "$300k – $500k",
  "$500k and up",
  "Not sure yet",
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
    heading: "Start with a site visit.",
    lead: "We walk the house, listen to what you want, and tell you honestly what it will take.",
    label: "Book a call",
    href: "/contact",
  },
  projects: {
    heading: "Most of these started as ordinary houses.",
    lead: "Good bones matter more than good photos. A site visit is how we find out what yours will allow.",
    label: "Book a site visit",
    href: "/contact",
  },
  services: {
    heading: "Not sure which of these you need?",
    lead: "Most clients aren't when they call. We look at the house first; the scope conversation comes after.",
    label: "Book a call",
    href: "/contact",
  },
  about: {
    heading: "Talk to the studio.",
    lead: "Email us or book a call. You'll be talking to the people who will actually run your job.",
    label: "Get in touch",
    href: "/contact",
  },
} satisfies Record<string, CtaCopy>;

/** Project pages personalise the panel with the project's neighborhood. */
export function projectCta(neighborhood: string): CtaCopy {
  return {
    heading: `Planning work in ${neighborhood}?`,
    lead: "We've probably walked a house like yours. Start with a visit and a straight answer on what it will take.",
    label: "Book a site visit",
    href: "/contact",
  };
}
