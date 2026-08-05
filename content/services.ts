import type { SiteImage } from "./images";
import type { CtaCopy } from "./studio";

export type DeepDiveSection = {
  /** h3 of the subsection. */
  title: string;
  paragraphs: string[];
};

export type ServiceDeepDive = {
  /** Eyebrow h2 for the band, shared across divisions. */
  eyebrow: string;
  /** Two subsections at most; the band reads as an essay, not a list. */
  sections: DeepDiveSection[];
};

export type Service = {
  slug: string;
  index: string;
  title: string;
  /** One line for cards; also the meta-description fallback. */
  summary: string;
  /**
   * SERP/AI description for the division page: subject-first, entity plus
   * geography, phrased in words the page body already uses. Falls back to
   * `summary` when unset.
   */
  metaDescription?: string;
  /** Short meta line — no-figures register, used in tight rows like the nav panel. */
  scope: string;
  /** Paragraphs for the detail page. */
  body: string[];
  /** Bulleted scope items. */
  includes: string[];
  /** Portrait card photograph. Self-hosted placeholder photography until real project photos land. */
  image: SiteImage;
  /** One image per body paragraph on the detail page (three each). */
  rowImages: SiteImage[];
  /** Optional narrative band between the includes list and the closing CTA. */
  deepDive?: ServiceDeepDive;
  /** Per-division closing CTA; pages without one fall back to ctaVariants.services. */
  cta?: CtaCopy;
  /** Optional brand statement rendered after the deep dive. */
  statement?: string;
};

// Array order is display order everywhere (nav panel, footer, home grid,
// /services, both sitemaps) and was set by the client: energy leads.
export const services: Service[] = [
  {
    slug: "energy-infrastructure",
    index: "01",
    title: "Energy Infrastructure",
    summary: "EV charging, geothermal, solar and storage, clean fuel.",
    metaDescription:
      "Araz Construction Group builds EV charging, geothermal, solar and battery storage, and clean fuel infrastructure across Southern California.",
    scope: "EV charging, geothermal, solar, storage",
    body: [
      "EV charging, geothermal development, solar and battery storage, and clean fuel infrastructure. Energy has moved from an amenity to a code requirement, and new multifamily and commercial buildings now carry obligations that most builders subcontract without fully pricing.",
      "This division is led by engineering leadership drawn from utility-scale energy work: geothermal field development, charging network design and commissioning, and clean fuel infrastructure delivered in coordination with utilities and engineering contractors.",
      "That gives us two things. Compliance handled in house on every project we build, and standalone energy work for owners who need systems rather than buildings. Specialized drilling is performed by our licensed partners.",
    ],
    includes: [
      "EV charging design and commissioning",
      "Geothermal assessment and development",
      "Solar and battery storage",
      "Clean fuel infrastructure",
      "Energy code compliance",
      "Standalone energy engagements",
    ],
    image: {
      src: "/images/services/service-energy-ev-fast-charging.avif",
      alt: "Electric vehicle plugged into a fast-charging station indoors",
    },
    rowImages: [
      {
        src: "/images/services/service-energy-rooftop-solar.avif",
        alt: "Aerial view of solar panels installed on a corrugated metal rooftop",
      },
      {
        src: "/images/services/service-energy-geothermal-steam.avif",
        alt: "Geothermal steam plumes rising from the ground under a dramatic sky",
      },
      {
        src: "/images/services/service-energy-ev-connector.avif",
        alt: "Close-up of an electric vehicle plugged into a charging connector",
      },
    ],
    deepDive: {
      eyebrow: "In depth",
      sections: [
        {
          title: "The real constraint",
          paragraphs: [
            "Charging infrastructure rarely fails on engineering. It fails on schedule. Utility coordination runs on its own timeline, switchgear and distribution equipment carry lead times that do not compress, and trenching has to happen before paving, which has to happen before occupancy. The constraints interact, and they are only manageable when one party owns all of them. Most projects discover this after the electrical service has been sized, the site has been paved, and the utility application has not been filed. We sequence it from the beginning.",
            "Existing facilities are a different problem. The service was sized for a building that never anticipated the load, the parking was paved without conduit, and operations cannot stop while the work happens. We plan retrofits around how the building actually runs, phasing trenching and outages so the facility keeps operating, and using load management to avoid service upgrades wherever the existing capacity can be made to work harder.",
          ],
        },
        {
          title: "Ground-source systems",
          paragraphs: [
            "A ground-source system exchanges heat with the stable temperatures below the surface instead of fighting the outdoor air. A sealed loop carries heat out of the building in summer and draws it in during winter, and a heat pump moves that energy where it is needed, domestic hot water included. There is no combustion anywhere in the system and no on-site emissions.",
            "It is a ground question before it is a mechanical one. Soil composition, water table, and available area decide whether a loop field is straightforward or expensive, so we test before we design, and we say so early when a site does not suit ground-source. Drilling is performed by our licensed partners, working to our design and under our schedule.",
          ],
        },
      ],
    },
    cta: {
      eyebrow: "Start a project",
      heading: "Planning a charging installation?",
      lead: "Send us the site and the vehicle count. We'll model the load and the utility path before you commit to anything.",
      label: "Book a call",
      href: "/contact",
    },
  },
  {
    slug: "commercial-institutional",
    index: "02",
    title: "Commercial & Institutional Construction",
    summary: "Retail, office, light industrial, and civic work.",
    metaDescription:
      "Araz Construction Group delivers retail, office, light industrial, and civic construction across Southern California.",
    scope: "Retail, office, tenant improvement, civic",
    body: [
      "Retail, office, light industrial, tenant improvement, and civic work.",
      "Commercial schedules are governed by occupancy dates, and occupancy dates are governed by inspections. The delays are rarely in the framing. They sit in utility coordination, energy compliance, and long-lead equipment that nobody sequenced early enough.",
      "We front-load those items during preconstruction, when they are still decisions, rather than discovering them in the field, when they are problems. For tenant improvement work in occupied buildings, we plan around operations rather than expecting operations to plan around us.",
    ],
    includes: [
      "Retail and restaurant buildings",
      "Office and light industrial",
      "Tenant improvements",
      "Civic and institutional work",
      "Occupancy-driven scheduling",
      "Long-lead equipment coordination",
    ],
    image: {
      src: "/images/services/service-commercial-curved-glass-office.avif",
      alt: "Curved glass-clad office building exterior against the sky",
    },
    rowImages: [
      {
        src: "/images/services/service-commercial-brick-glass-facade.avif",
        alt: "Street-level view of a modern office building with brick and glass facade",
      },
      {
        src: "/images/services/service-commercial-glass-tower.avif",
        alt: "Close-up of a glass office tower facade reflecting light",
      },
      {
        src: "/images/services/service-workers-scaffolding.avif",
        alt: "Two construction workers standing on tubular scaffolding against a clear sky",
      },
    ],
    deepDive: {
      eyebrow: "In depth",
      sections: [
        {
          title: "The two decisions that matter most",
          paragraphs: [
            "A building's operating performance is mostly determined before anyone selects a fixture, and the first decision is the envelope. Airtight, thermally continuous construction is what allows mechanical systems to be sized down rather than compensating for losses forever. It is unglamorous work, sequencing, detailing, and inspection at every transition, and it is the difference between a building that performs as modeled and one that does not.",
            "The second decision is the controls. A building management system that actually responds to occupancy, daylight, and outdoor conditions will outperform a better-specified building running on fixed schedules. We treat both as construction problems rather than design intentions, because that is where they succeed or fail.",
          ],
        },
      ],
    },
    cta: {
      eyebrow: "Start a project",
      heading: "Tell us about the building.",
      lead: "A site, a shell, or an existing facility: send us what you have and we'll tell you what it will take.",
      label: "Book a call",
      href: "/contact",
    },
  },
  {
    slug: "civil-site-development",
    index: "03",
    title: "Civil & Site Development",
    summary: "Grading, utilities, drainage, and site preparation.",
    metaDescription:
      "Araz Construction Group delivers grading, utilities, drainage, and site preparation across Southern California.",
    scope: "Grading, utilities, drainage, paving",
    body: [
      "Grading, excavation, underground utilities, storm drainage, retaining walls, and paving.",
      "This is the work nobody sees and everybody pays for. Soil that behaves differently than the report suggested. Utilities that are not where the plans put them. Drainage the agency will not accept. These are the conditions that quietly reset budgets before a building is out of the ground.",
      "We self-perform this scope. That means the site is understood by the same company that will build on it, and the risk stays in one place instead of moving between parties while the schedule runs. We take civil work as a standalone scope as well as part of a full build.",
    ],
    includes: [
      "Grading and excavation",
      "Underground utilities",
      "Storm drainage",
      "Retaining walls",
      "Paving and flatwork",
      "Standalone civil packages",
    ],
    image: {
      src: "/images/services/service-civil-site-dusk.avif",
      alt: "Large civil construction site at dusk with tower cranes, precast concrete barriers, and shipping containers",
    },
    rowImages: [
      {
        src: "/images/services/service-civil-excavator.avif",
        alt: "Yellow excavator scooping a mound of dirt at a construction site",
      },
      {
        src: "/images/services/service-civil-retaining-wall.avif",
        alt: "Tall concrete retaining wall along a road with a wood guardrail above",
      },
      {
        src: "/images/services/service-civil-night-paving.avif",
        alt: "Night paving crew operating an asphalt paving machine on a road",
      },
    ],
    deepDive: {
      eyebrow: "In depth",
      sections: [
        {
          title: "Precision earthwork",
          paragraphs: [
            "Grading runs GPS-guided for cut-and-fill precision, which reduces over-excavation and the haul-off that follows it. Where a project warrants it, subgrade and stormwater systems are instrumented for moisture, settlement, and runoff, so drainage performance is measured data rather than a question answered by the first heavy rain.",
          ],
        },
        {
          title: "Water on site",
          paragraphs: [
            "Stormwater is engineered as infrastructure rather than an afterthought: detention, treatment, and bioswales that manage major storm events without runoff contamination, and permeable paving that keeps water on the site rather than exporting the problem downstream. Low-impact earthwork, recycled aggregates where specification allows, and soil conservation protocols run on every site, enforced by our own crews rather than requested of someone else's.",
          ],
        },
      ],
    },
    cta: {
      eyebrow: "Start a project",
      heading: "Send us the site.",
      lead: "We'll tell you what's underneath it, what it will take to prepare, and where the schedule risk actually sits.",
      label: "Book a site walk",
      href: "/contact",
    },
    statement:
      "We self-perform the ground: the scopes that set the schedule and carry the most carbon.",
  },
  {
    slug: "multifamily-mixed-use",
    index: "04",
    title: "Multifamily & Mixed-Use Construction",
    summary: "Apartment, condominium, and mixed-use projects.",
    metaDescription:
      "Araz Construction Group builds apartment, condominium, and mixed-use projects across Southern California.",
    scope: "Apartment, condominium, mixed-use",
    body: [
      "Apartment, condominium, and mixed-use projects from small infill through mid-size developments.",
      "Multifamily is a coordination problem before it is a construction problem. Structure, envelope, utilities, parking, and building systems all compete for the same critical path, and the losses happen in the gaps between them. We reduce the gaps by holding more of the scope ourselves: sitework, foundations, structure, and the energy systems that now govern how these buildings are approved.",
      "We work with developers from feasibility forward, pricing while the design is still moving so the budget and the drawings arrive together. For owners carrying multiple sites, we can run several projects under one reporting structure.",
    ],
    includes: [
      "Apartment buildings",
      "Condominium projects",
      "Mixed-use and podium construction",
      "Wrap and infill projects",
      "Developer feasibility support",
      "Multi-site program reporting",
    ],
    image: {
      src: "/images/services/service-multifamily-scaffold-wrap.avif",
      alt: "Apartment building wrapped in scaffolding during construction",
    },
    rowImages: [
      {
        src: "/images/services/service-concrete-rebar-formwork.avif",
        alt: "Multi-story concrete building under construction with exposed rebar and plywood formwork",
      },
      {
        src: "/images/services/service-workers-scaffolding.avif",
        alt: "Two construction workers standing on tubular scaffolding against a clear sky",
      },
      {
        src: "/images/services/service-preconstruction-blueprint.avif",
        alt: "Hand drawing on an architectural blueprint with a ruler and pencil",
      },
    ],
    deepDive: {
      eyebrow: "In depth",
      sections: [
        {
          title: "Charging at scale",
          paragraphs: [
            "Charging infrastructure is no longer optional in new multifamily, and it is the scope most builders subcontract without fully pricing. The cost surfaces late, usually as a service upgrade nobody budgeted. Smart charging balances draw across vehicles against real-time building demand, which is what makes charging at scale viable: the building does not need capacity for every vehicle charging at once, because they never do. We engineer it in house, on the same contract as the building, so the electrical service is sized for it from the start instead of revisited after it is installed.",
          ],
        },
        {
          title: "What residents get",
          paragraphs: [
            "Residents do not experience infrastructure. Units are delivered with smart thermostats, automated sub-metering, and keyless access, systems that reduce operating cost and give residents visibility into their own consumption rather than a bill that arrives without explanation. High-performance envelopes and passive solar orientation, where the site allows, reduce peak demand and utility costs together. A well-built envelope is the amenity residents never see and feel every month.",
          ],
        },
      ],
    },
    cta: {
      eyebrow: "Start a project",
      heading: "Working on a site?",
      lead: "Send us the parcel and the program. We'll tell you what it supports and where the budget risk sits.",
      label: "Book a call",
      href: "/contact",
    },
  },
  {
    slug: "concrete-foundation-structural",
    index: "05",
    title: "Concrete, Foundation & Structural",
    summary: "Foundations, structural concrete, retrofit, and repair.",
    metaDescription:
      "Araz Construction Group delivers foundations, structural concrete, retrofit, and repair across Southern California.",
    scope: "Foundations, retrofit, structural repair",
    body: [
      "Foundations, structural concrete, seismic and structural retrofit, underpinning, and structural repair.",
      "We own this scope. Concrete is the first thing to go wrong on a project and the most expensive thing to correct afterward, and self-performing it is the difference between managing a schedule and controlling one.",
      "It also changes how we estimate. When the crew pouring the foundation works for the same company that priced it, the number reflects conditions rather than an allowance. This division serves our own projects first and is available to other builders as a subcontract scope.",
    ],
    includes: [
      "Foundations",
      "Structural concrete",
      "Seismic retrofit",
      "Underpinning",
      "Structural repair",
      "Subcontract scopes for other builders",
    ],
    image: {
      src: "/images/services/service-concrete-foundation-structural.avif",
      alt: "Concrete foundation with rebar column starters rising into the structural frame of a mid-rise building, over a foundation plan drawing",
    },
    rowImages: [
      {
        src: "/images/services/service-concrete-foundation-pour.avif",
        alt: "Two workers pouring concrete into a rebar-lined foundation form in a residential backyard",
      },
      {
        src: "/images/services/service-concrete-rebar-cages.avif",
        alt: "Construction worker in a hard hat crouched among structural rebar cages",
      },
      {
        src: "/images/services/service-concrete-rebar-formwork.avif",
        alt: "Multi-story concrete building under construction with exposed rebar and plywood formwork",
      },
    ],
    deepDive: {
      eyebrow: "In depth",
      sections: [
        {
          title: "Instrumented concrete",
          paragraphs: [
            "Foundations are placed in low-carbon reinforced concrete with sensors embedded in the pour, monitoring curing strength, temperature, and moisture in real time. That data determines when it is actually safe to strip forms and load the structure, replacing a fixed waiting period with a measured one. On a cold pour it prevents loading concrete that is not ready. On a warm one it recovers schedule a conservative wait would have given away.",
            "It also produces a record. If a question comes up later about how a pour cured, the answer is data rather than recollection.",
          ],
        },
      ],
    },
    cta: {
      eyebrow: "Start a project",
      heading: "Starting from the ground?",
      lead: "Send us the site and the structural drawings. We'll price the ground work against real conditions.",
      label: "Book a call",
      href: "/contact",
    },
    statement: "Instrumented, not assumed.",
  },
  {
    slug: "preconstruction-program-management",
    index: "06",
    title: "Preconstruction & Program Management",
    summary: "Feasibility, budgeting, permitting, and owner's representation.",
    metaDescription:
      "Araz Construction Group runs feasibility, budgeting, permitting, and owner's representation for Southern California projects.",
    scope: "Feasibility, budgeting, permitting",
    body: [
      "Feasibility, budget development, constructability review, value engineering, permitting, and owner's representation.",
      "Preconstruction is where a project is actually won or lost. Decisions made before a permit is filed determine most of what the build will cost, and they are usually made with the least information.",
      "We work at that stage: testing what a site supports, developing budgets against real conditions, reviewing drawings for what will be difficult to build, and carrying projects through agency approval. For owners running several projects we provide program-level management across the portfolio. Available standalone or as the first phase of a full build.",
    ],
    includes: [
      "Feasibility studies",
      "Budget development",
      "Constructability review",
      "Value engineering",
      "Permitting and agency approval",
      "Owner's representation",
    ],
    image: {
      src: "/images/services/service-preconstruction-floor-plans.avif",
      alt: "Architectural floor plan drawings spread across a table",
    },
    rowImages: [
      {
        src: "/images/services/service-preconstruction-blueprint.avif",
        alt: "Hand drawing on an architectural blueprint with a ruler and pencil",
      },
      {
        src: "/images/services/service-preconstruction-survey-tripod.avif",
        alt: "Survey equipment on a tripod with a tower crane in the background",
      },
      {
        src: "/images/services/service-delivery-handshake.avif",
        alt: "Two site workers in hard hats shaking hands in front of stacked precast concrete panels",
      },
    ],
    cta: {
      eyebrow: "Start a project",
      heading: "Know before you commit.",
      lead: "Bring us the site or the drawings before the numbers harden. Feasibility, budgeting, and permitting are cheapest to get right now.",
      label: "Book a call",
      href: "/contact",
    },
  },
  {
    slug: "single-family",
    index: "07",
    title: "Single-Family Construction",
    summary: "Custom homes, accessory dwelling units, additions.",
    metaDescription:
      "Araz Construction Group builds custom homes, accessory dwelling units, and additions across Southern California.",
    scope: "Custom homes, ADUs, additions",
    body: [
      "Custom homes, spec homes, accessory dwelling units, and additions.",
      "A house goes wrong in one of two places: the budget is set before anyone understands the site, or the drawings are finished before anyone prices them. Both produce the same result, a number that moves after you have committed.",
      "We start with the lot. What it will hold, what the soil will support, what the agency will approve, and what it will cost to build there. Then design and pricing move together. Accessory dwelling units and additions run the same way, at a scale where the site matters even more.",
    ],
    includes: [
      "Custom homes",
      "Spec homes",
      "Accessory dwelling units",
      "Additions",
      "Lot and soil feasibility",
      "Pricing alongside design",
    ],
    image: {
      src: "/images/services/service-single-family-house.avif",
      alt: "Nearly finished single-family house with a dirt pile in the front yard",
    },
    rowImages: [
      {
        src: "/images/services/service-single-family-roof-trusses.avif",
        alt: "Timber roof trusses and wall framing on a house under construction",
      },
      {
        src: "/images/services/service-single-family-cleared-lot.avif",
        alt: "Yellow excavator parked on a cleared dirt hilltop under a clear sky",
      },
      {
        src: "/images/services/service-preconstruction-survey-tripod.avif",
        alt: "Survey equipment on a tripod with a tower crane in the background",
      },
    ],
    cta: {
      eyebrow: "Start a project",
      heading: "Start with the lot, not the floor plan.",
      lead: "Tell us where you want to build. We'll tell you what the ground will hold, what the agency will approve, and what it takes to build there.",
      label: "Book a call",
      href: "/contact",
    },
  },
];

export function getAllServices(): Service[] {
  return services;
}

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getServiceSlugs(): string[] {
  return services.map((service) => service.slug);
}

export type ServicesPageCopy = {
  header: { eyebrow: string; title: string; lead: string };
  process: { eyebrow: string; heading: string };
  faq: { eyebrow: string; heading: string; allLabel: string };
};

/** /services page strings. Section structure stays in the route file. */
export const servicesPage: ServicesPageCopy = {
  header: {
    eyebrow: "What we do",
    title: "Seven divisions. One contract.",
    lead: "Most contractors coordinate. We self-perform the scopes that decide whether a project holds its schedule, and we engineer the systems that increasingly decide whether it passes inspection at all.",
  },
  process: {
    eyebrow: "How it runs",
    heading: "One contract, five phases.",
  },
  faq: {
    eyebrow: "Questions",
    heading: "Asked on almost every first call.",
    allLabel: "All questions",
  },
};

export type DeliveryModelCopy = {
  eyebrow: string;
  heading: string;
  lead: string;
  columns: { title: string; body: string }[];
  image: SiteImage;
};

/** The self-perform story on /services. Re-authored from the FAQ answers, not quoted. */
export const deliveryModel: DeliveryModelCopy = {
  eyebrow: "Who does the work",
  heading: "Self-performed where it decides the outcome.",
  lead: "A project's schedule is set by a handful of scopes and lost in the seams between the companies performing them. We keep those scopes on our own payroll and hold everything under one agreement, so when conditions change on site there is no negotiation over whose problem it is.",
  columns: [
    {
      title: "Our crews",
      body: "Sitework, foundations, structural concrete, and the energy systems that increasingly shape approvals are performed by people who work here, priced by the office that employs them and accountable to the same schedule as everything else.",
    },
    {
      title: "Licensed partners",
      body: "Specialty trades are carried by licensed partners we name before work begins and stand behind after it's done. Their coverage is verified before they mobilize, and their work runs inside our schedule, not alongside it.",
    },
  ],
  image: {
    src: "/images/services/service-delivery-handshake.avif",
    alt: "Two site workers in hard hats shaking hands in front of stacked precast concrete panels",
  },
};
