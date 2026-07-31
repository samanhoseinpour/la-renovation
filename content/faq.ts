export type Faq = {
  question: string;
  answer: string;
  /** Marks the subset shown on /services. */
  featured?: boolean;
  /** Marks the subset shown on the home teaser — keep disjoint from `featured`. */
  homeFeatured?: boolean;
};

export type FaqTopic = {
  key: string;
  label: string;
  faqs: Faq[];
};

/** Every question, grouped by topic for /faq. Rendered in this order. */
export const faqTopics: FaqTopic[] = [
  {
    key: "process",
    label: "Process & timeline",
    faqs: [
      {
        question: "How early should we bring you in?",
        answer:
          "At feasibility, before design commits to anything. Bring us in there and the budget develops against the site instead of getting reset by it later.",
        featured: true,
      },
      {
        question: "What actually happens during feasibility?",
        answer:
          "We walk the site and test what it supports: soil, utilities, access, zoning, and what the agency is likely to approve. You get a straight read on what the ground will hold, what it will take to build there, and where the risk sits. Design starts from that instead of from assumptions.",
        homeFeatured: true,
      },
      {
        question: "How do permits and agency approvals work?",
        answer:
          "Permitting runs inside preconstruction, not after it. We map the approvals path early, from plan check and corrections through utility clearances, because the agency shapes the schedule as much as the construction does. By the time crews mobilize, the file has already been through the counter.",
      },
      {
        question: "What happens when the schedule slips?",
        answer:
          "We say so early and in plain terms: what moved, why, and what it does to the dates downstream. Because we self-perform the critical path, recovering a slip is usually work inside our own crews rather than a negotiation between subcontractors.",
      },
    ],
  },
  {
    key: "budget",
    label: "Budget & contracts",
    faqs: [
      {
        question: "What will it cost?",
        answer:
          "There is no standard number. We develop the budget against your site during preconstruction, so you know the cost of a decision when you make it, not after.",
        featured: true,
      },
      {
        question: "Fixed price or cost-plus?",
        answer:
          "Both. The contract form should match the risk. A fully drawn scope on understood ground can carry a fixed number; a project still moving through design is better held in a structure that prices decisions as they're made. We recommend a form once we've seen the drawings and the site, and we tell you why.",
        homeFeatured: true,
      },
      {
        question: "How do change orders work?",
        answer:
          "A change is priced before it is built. You see the cost and the schedule effect together, in writing, before you approve it. Nothing proceeds on a handshake and gets settled later. Preconstruction exists to keep that list short.",
      },
    ],
  },
  {
    key: "licensing",
    label: "Licensing & insurance",
    faqs: [
      {
        question: "Are you licensed and insured?",
        answer:
          "Yes. Licensed as a California contractor and insured for the work we take on. Don't take that on faith, from us or from anyone: every contractor's license can be verified with the CSLB, and we'd rather you look ours up than wonder. The paperwork is available before you sign anything.",
        homeFeatured: true,
      },
      {
        question: "Do your crews or your subs carry the insurance on site?",
        answer:
          "Depends on who is doing the work. Scopes we self-perform run under our own license and coverage. Specialty trades go to licensed partners, and we verify their coverage before they mobilize. Nobody works the site on an assumption.",
      },
      {
        question: "Can we see the paperwork before we sign?",
        answer:
          "Yes. License details, certificates of insurance, and the names of the licensed partners we'd bring onto your project are available before you commit to anything. Any contractor should be able to produce the same without hesitation.",
      },
    ],
  },
  {
    key: "working-with-us",
    label: "Working with us",
    faqs: [
      {
        question: "What kind of projects do you take on?",
        answer:
          "Multifamily and mixed-use, commercial and institutional, and civil site development, alongside the energy, concrete, and preconstruction scopes that support them. Most projects touch several divisions at once, which is the reason we hold them under one roof.",
        homeFeatured: true,
      },
      {
        question: "Do you self-perform or subcontract?",
        answer:
          "We self-perform the scopes that set the schedule: sitework, foundations, structure, and the energy systems increasingly tied to permitting. Specialty trades go to licensed partners we name and stand behind, not whoever bids lowest that week.",
      },
      {
        question: "Can you take just the sitework or energy scope?",
        answer:
          "Yes. Civil site development and energy infrastructure both run as standalone engagements, not only as part of a full build, for owners who need the ground work or the systems work without the rest of the contract.",
        featured: true,
      },
      {
        question: "Do you work with owners who already have an architect?",
        answer:
          "Often. We join wherever the project stands: reviewing drawings for constructability, pricing as design develops, flagging what will be hard to build while it can still change on paper. The architect keeps the design. We make sure it can be built for the number attached to it.",
      },
      {
        question: "Where do you work?",
        answer:
          "We build across Southern California. Distance is rarely the constraint; scope and schedule are.",
      },
    ],
  },
];

/** The 3–4 questions surfaced on /services, in topic order. */
export function getFeaturedFaqs(): Faq[] {
  return faqTopics.flatMap((topic) => topic.faqs.filter((faq) => faq.featured));
}

/** The four questions on the home teaser, one per topic, disjoint from the /services set. */
export function getHomeFaqs(): Faq[] {
  return faqTopics.flatMap((topic) => topic.faqs.filter((faq) => faq.homeFeatured));
}
