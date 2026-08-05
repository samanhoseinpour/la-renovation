import { published } from "@/lib/site";

import { unsplash, type SiteImage } from "./images";

/** Before/after pair rendered by components/sections/compare-gallery.tsx. */
export type ComparePair = { before: SiteImage; after: SiteImage; caption?: string };

export type Project = {
  slug: string;
  /** Two-digit index shown in the eyebrow caption, e.g. "001 / LOS FELIZ". */
  index: string;
  title: string;
  neighborhood: string;
  /** Short scope label used in listings. */
  scope: string;
  /** One line for cards and meta descriptions. */
  summary: string;
  /** Paragraphs for the case-study body. */
  body: string[];
  /** Key/value pairs rendered as the project fact table. */
  facts: { label: string; value: string }[];
  /** Slugs from content/services.ts. */
  services: string[];
  /** Hero photograph. Temporary Unsplash stand-in; see content/images.ts. */
  image: SiteImage;
  /** Case-study gallery, three per project. */
  gallery: SiteImage[];
  /** Before/after pairs for the compare gallery; placeholder stock until real photography exists. */
  compare?: ComparePair[];
};

export const projects: Project[] = [
  {
    slug: "harbor-mixed-use",
    index: "001",
    title: "Harbor Boulevard Mixed-Use",
    neighborhood: "Anaheim",
    scope: "Podium apartments over retail",
    summary:
      "A mid-block infill site taken from rough grade to a podium building with its charging infrastructure designed in, not added on.",
    body: [
      "The site came to us as rough grade on a busy corner: a small infill lot with utilities in the wrong place and a podium building that had to hold both parking and retail frontage. We took the civil package, the deck, and the structure as one scope.",
      "That mattered most at the podium pour. The crew forming the deck worked for the same company that had priced it, so when the soils report and the field disagreed, the fix was absorbed inside one schedule instead of negotiated between three.",
      "The charging and electrical infrastructure was engineered alongside the structure rather than after it, which is increasingly the difference between a building that passes plan check and one that gets redesigned there.",
    ],
    facts: [
      { label: "Scope", value: "Multifamily over ground-floor retail" },
      { label: "Delivery", value: "Negotiated GC" },
      { label: "Divisions", value: "Civil, concrete, structure, energy" },
    ],
    services: [
      "multifamily-mixed-use",
      "concrete-foundation-structural",
      "energy-infrastructure",
    ],
    image: {
      src: unsplash("photo-1508450859948-4e04fabaa4ea", 3200),
      alt: "Multi-story podium building under construction, concrete decks and orange safety railing against a clear sky",
    },
    gallery: [
      {
        src: unsplash("photo-1693651005564-a8c24afbc28e"),
        alt: "Yellow ride-on roller compacting graded dirt at a construction site, site trailers in the background",
      },
      {
        src: unsplash("photo-1768677903496-becc4be07258"),
        alt: "Worker in a hard hat and safety vest standing on a dense rebar grid ahead of a concrete pour",
      },
      {
        src: unsplash("photo-1761401429082-cec0cb4080b9"),
        alt: "Outdoor EV charging station with two cables mounted between green bollards",
      },
    ],
    // Placeholder stand-in pairs reusing verified stock until this project is
    // photographed before and after for real.
    compare: [
      {
        before: {
          src: unsplash("photo-1777919393730-463e2c0b7f4c"),
          alt: "Multi-story concrete building under construction with exposed rebar and plywood formwork",
        },
        after: {
          src: unsplash("photo-1778961419928-2968ddd57c05"),
          alt: "Street-level view of a finished modern building with brick and glass facade",
        },
        caption: "Podium deck to occupied frontage",
      },
      {
        before: {
          src: unsplash("photo-1576446470246-499c738d1c8e"),
          alt: "Open electrical panel with a row of circuit breakers and rough-in wiring",
        },
        after: {
          src: unsplash("photo-1707341597123-c53bbb7e7f93"),
          alt: "Electric vehicle plugged into a fast-charging station in a covered parking bay",
        },
        caption: "Electrical rough-in to charging bay",
      },
    ],
  },
  {
    slug: "bristol-street-offices",
    index: "002",
    title: "Bristol Street Offices",
    neighborhood: "Santa Ana",
    scope: "Office shell and tenant build-out",
    summary:
      "Shell, core, and phased suite build-outs on an occupancy-driven schedule, priced during design rather than after it.",
    body: [
      "An office shell with phased suite build-outs, governed the way commercial work always is: by occupancy dates. The framing was never the risk. Utility coordination and long-lead equipment were.",
      "We front-loaded both during preconstruction, while they were still decisions. Switchgear and rooftop units were sequenced before drywall dates were promised to tenants, not after.",
      "The suites were priced as the drawings developed, so each tenant's number arrived with their layout instead of chasing it.",
    ],
    facts: [
      { label: "Scope", value: "Commercial shell + TI" },
      { label: "Delivery", value: "Preconstruction-led" },
      { label: "Divisions", value: "Commercial, preconstruction" },
    ],
    services: ["commercial-institutional", "preconstruction-program-management"],
    image: {
      src: unsplash("photo-1481026469463-66327c86e544", 3200),
      alt: "Low-angle view of a faceted glass curtain wall on an office building against the sky",
    },
    gallery: [
      {
        src: unsplash("photo-1644221150167-fb4fafa7f411"),
        alt: "High-rise concrete structure under construction with a tower crane and perimeter scaffolding",
      },
      {
        src: unsplash("photo-1576446470246-499c738d1c8e"),
        alt: "Open electrical panel with a row of circuit breakers and blue wiring",
      },
      {
        src: unsplash("photo-1762146828422-50a8bd416d3c"),
        alt: "Architectural floor plan drawings spread across a table",
      },
    ],
    compare: [
      {
        before: {
          src: unsplash("photo-1771530789155-b1f03fbf82b5"),
          alt: "Empty commercial shell space with exposed ceiling ductwork and a polished concrete floor",
        },
        after: {
          src: unsplash("photo-1552664730-d307ca884978"),
          alt: "Built-out office suite in use, bright interior with large windows",
        },
        caption: "Shell space to built-out suites",
      },
    ],
  },
  {
    slug: "tustin-legacy-site-package",
    index: "003",
    title: "Tustin Legacy Site Package",
    neighborhood: "Tustin",
    scope: "Standalone civil package",
    summary:
      "Grading, wet and dry utilities, and street improvements delivered as a standalone scope for another builder's vertical schedule.",
    body: [
      "A standalone civil scope delivered for another builder's vertical schedule: grading, wet and dry utilities, storm drainage, and street improvements.",
      "Site packages fail quietly. Soil that behaves differently than the report, utilities that are not where the record drawings put them, drainage the agency wants redesigned. Our crews hit all three and absorbed them inside the same contract.",
      "The vertical builder started on schedule on pads that matched the plans they were given. That is the whole job of a site package, and it is rarer than it should be.",
    ],
    facts: [
      { label: "Scope", value: "Grading, utilities, paving" },
      { label: "Delivery", value: "Standalone civil scope" },
      { label: "Divisions", value: "Civil, concrete" },
    ],
    services: ["civil-site-development", "concrete-foundation-structural"],
    image: {
      src: unsplash("photo-1749899524117-27214916684e", 3200),
      alt: "Excavator with bucket extended on a graded dirt lot, a white pickup truck parked nearby",
    },
    gallery: [
      {
        src: unsplash("photo-1693907986952-3cd372e4c9d8"),
        alt: "Blue ductile iron water main with valve fittings exposed in an open trench",
      },
      {
        src: unsplash("photo-1565364507085-325347bae748"),
        alt: "Excavator laying large pipes into a trench at a foggy job site",
      },
      {
        src: unsplash("photo-1776381733574-372689e246b4"),
        alt: "Asphalt roller paving a street at dusk with its headlights on",
      },
    ],
    compare: [
      {
        before: {
          src: unsplash("photo-1751054770504-c69daeec4721"),
          alt: "Yellow excavator scooping a mound of dirt on a rough-graded site",
        },
        after: {
          src: unsplash("photo-1768751947846-708a2836f4b7"),
          alt: "Finished concrete retaining wall along a paved road with a wood guardrail above",
        },
        caption: "Rough grade to finished streetscape",
      },
    ],
  },
  {
    slug: "costa-mesa-adu",
    index: "004",
    title: "Costa Mesa ADU",
    neighborhood: "Costa Mesa",
    scope: "Detached accessory dwelling unit",
    summary:
      "A backyard unit run like our larger work: the lot understood first, the price moving with the drawings, the systems built in.",
    body: [
      "A detached backyard unit, run the way we run larger work: understand the lot before promising a number.",
      "Access, setbacks, the sewer lateral, and the panel capacity were resolved before design committed. The price developed with the drawings, so the owners watched the number settle instead of jump.",
      "The unit went in with its electrical infrastructure sized for what the property will need next, not just what the code asked for on the day it was permitted.",
    ],
    facts: [
      { label: "Scope", value: "Detached new construction" },
      { label: "Delivery", value: "Design alongside pricing" },
      { label: "Divisions", value: "Single-family, energy" },
    ],
    services: ["single-family", "energy-infrastructure"],
    image: {
      src: unsplash("photo-1676802037786-3697d60497ae", 3200),
      alt: "Peaked roof trusses and wall framing on a house under construction against a blue sky",
    },
    gallery: [
      {
        src: unsplash("photo-1690719095815-549c60090c9f"),
        alt: "Close-up of roof trusses and rafters on a wood-framed structure under construction",
      },
      {
        src: unsplash("photo-1668961915523-884872e392f8"),
        alt: "Two pipes draining into a small concrete-lined catch basin in a grassy yard",
      },
      {
        src: unsplash("photo-1566417110090-6b15a06ec800"),
        alt: "Industrial circuit breaker panel mounted on a wall with wiring connected",
      },
    ],
    compare: [
      {
        before: {
          src: unsplash("photo-1743130940742-c0d1fff97f1c"),
          alt: "Two workers pouring concrete into a rebar-lined foundation form in a residential backyard",
        },
        after: {
          src: unsplash("photo-1778164912282-c89de4d198ea"),
          alt: "Nearly finished single-family unit with siding on and a dirt front yard",
        },
        caption: "Backyard pour to weather-tight unit",
      },
      {
        before: {
          src: unsplash("photo-1639953803381-e9c3f3a38253"),
          alt: "Timber roof trusses and wall framing on a unit under construction",
        },
        after: {
          src: unsplash("photo-1745187946672-2c1d8cf26a2b"),
          alt: "Solar panels installed across a finished rooftop, seen from above",
        },
        caption: "Roof framing to solar array",
      },
    ],
  },
];

/**
 * The gate the rest of the site reads through. While the portfolio is
 * unpublished this is empty, which drains the nav panel, footer column,
 * sitemaps and home showcase, and 404s the detail routes — the demo data
 * above stays intact for the flip back.
 */
const publishedProjects: Project[] = published.projects ? projects : [];

export function getAllProjects(): Project[] {
  return publishedProjects;
}

export function getProject(slug: string): Project | undefined {
  return publishedProjects.find((project) => project.slug === slug);
}

export function getProjectSlugs(): string[] {
  return publishedProjects.map((project) => project.slug);
}

/** /projects header while the portfolio is unpublished. */
export const projectsComingSoon = {
  eyebrow: "Projects",
  title: "The portfolio comes after the work.",
  lead: "We'd rather show finished projects than mockups, so this page stays quiet until the first ones are built and photographed. The services pages cover what we take on in the meantime.",
  metaDescription:
    "Project case studies from Araz Construction Group are on the way. Until then, see the services we take on across Southern California.",
};

/** /projects header once the portfolio is published. */
export const projectsHeader = {
  title: "Built from the ground, wired to the grid.",
  lead: "Energy, commercial, civil, and multifamily work across Southern California, each project taken from site development through the systems that run the building.",
  metaDescription:
    "Selected energy, commercial, civil, and multifamily construction projects by Araz Construction Group across Southern California.",
};
