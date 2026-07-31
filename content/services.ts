import { unsplash, type SiteImage } from "./images";

export type Service = {
  slug: string;
  index: string;
  title: string;
  /** One line for cards and meta descriptions. */
  summary: string;
  /** Short meta line — no-figures register, used in tight rows like the nav panel. */
  scope: string;
  /** Paragraphs for the detail page. */
  body: string[];
  /** Bulleted scope items. */
  includes: string[];
  /** Portrait card photograph. Temporary Unsplash stand-in. */
  image: SiteImage;
  /** One image per body paragraph on the detail page (three each). */
  rowImages: SiteImage[];
};

export const services: Service[] = [
  {
    slug: "multifamily-mixed-use",
    index: "01",
    title: "Multifamily & Mixed-Use Construction",
    summary: "Apartment, condominium, and mixed-use projects.",
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
      src: unsplash("photo-1777104247068-ad8c489cd9e9"),
      alt: "Apartment building wrapped in scaffolding during construction",
    },
    rowImages: [
      {
        src: unsplash("photo-1777919393730-463e2c0b7f4c"),
        alt: "Multi-story concrete building under construction with exposed rebar and plywood formwork",
      },
      {
        src: unsplash("photo-1751703019097-02f294f45343"),
        alt: "Two construction workers standing on tubular scaffolding against a clear sky",
      },
      {
        src: unsplash("photo-1503387762-592deb58ef4e"),
        alt: "Hand drawing on an architectural blueprint with a ruler and pencil",
      },
    ],
  },
  {
    slug: "commercial-institutional",
    index: "02",
    title: "Commercial & Institutional Construction",
    summary: "Retail, office, light industrial, and civic work.",
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
      src: unsplash("photo-1757954694963-ea693d2cb1dc"),
      alt: "Curved glass-clad office building exterior against the sky",
    },
    rowImages: [
      {
        src: unsplash("photo-1778961419928-2968ddd57c05"),
        alt: "Street-level view of a modern office building with brick and glass facade",
      },
      {
        src: unsplash("photo-1745015446589-7ee6f702d8c1"),
        alt: "Close-up of a glass office tower facade reflecting light",
      },
      {
        src: unsplash("photo-1751703019097-02f294f45343"),
        alt: "Two construction workers standing on tubular scaffolding against a clear sky",
      },
    ],
  },
  {
    slug: "civil-site-development",
    index: "03",
    title: "Civil & Site Development",
    summary: "Grading, utilities, drainage, and site preparation.",
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
      src: unsplash("photo-1766791789983-57f22d98fcc8"),
      alt: "Large civil construction site at dusk with tower cranes, precast concrete barriers, and shipping containers",
    },
    rowImages: [
      {
        src: unsplash("photo-1751054770504-c69daeec4721"),
        alt: "Yellow excavator scooping a mound of dirt at a construction site",
      },
      {
        src: unsplash("photo-1768751947846-708a2836f4b7"),
        alt: "Tall concrete retaining wall along a road with a wood guardrail above",
      },
      {
        src: unsplash("photo-1757030689760-3ec8be7326ae"),
        alt: "Night paving crew operating an asphalt paving machine on a road",
      },
    ],
  },
  {
    slug: "energy-infrastructure",
    index: "04",
    title: "Energy Infrastructure",
    summary: "EV charging, geothermal, solar and storage, clean fuel.",
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
      src: unsplash("photo-1707341597123-c53bbb7e7f93"),
      alt: "Electric vehicle plugged into a fast-charging station indoors",
    },
    rowImages: [
      {
        src: unsplash("photo-1745187946672-2c1d8cf26a2b"),
        alt: "Aerial view of solar panels installed on a corrugated metal rooftop",
      },
      {
        src: unsplash("photo-1702058897414-c772071c498c"),
        alt: "Geothermal steam plumes rising from the ground under a dramatic sky",
      },
      {
        src: unsplash("photo-1703860271509-b50f5679f2a0"),
        alt: "Close-up of an electric vehicle plugged into a charging connector",
      },
    ],
  },
  {
    slug: "concrete-foundation-structural",
    index: "05",
    title: "Concrete, Foundation & Structural",
    summary: "Foundations, structural concrete, retrofit, and repair.",
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
      src: unsplash("photo-1763771420303-0f11ccf613d1"),
      alt: "Close-up of bundled, rust-coated steel rebar",
    },
    rowImages: [
      {
        src: unsplash("photo-1743130940742-c0d1fff97f1c"),
        alt: "Two workers pouring concrete into a rebar-lined foundation form in a residential backyard",
      },
      {
        src: unsplash("photo-1635249578213-68b0aa67fdf7"),
        alt: "Construction worker in a hard hat crouched among structural rebar cages",
      },
      {
        src: unsplash("photo-1777919393730-463e2c0b7f4c"),
        alt: "Multi-story concrete building under construction with exposed rebar and plywood formwork",
      },
    ],
  },
  {
    slug: "single-family",
    index: "06",
    title: "Single-Family Construction",
    summary: "Custom homes, accessory dwelling units, additions.",
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
      src: unsplash("photo-1778164912282-c89de4d198ea"),
      alt: "Nearly finished single-family house with a dirt pile in the front yard",
    },
    rowImages: [
      {
        src: unsplash("photo-1639953803381-e9c3f3a38253"),
        alt: "Timber roof trusses and wall framing on a house under construction",
      },
      {
        src: unsplash("photo-1649807533255-bbc9c9fb7d77"),
        alt: "Yellow excavator parked on a cleared dirt hilltop under a clear sky",
      },
      {
        src: unsplash("photo-1682663810771-89d21838530f"),
        alt: "Survey equipment on a tripod with a tower crane in the background",
      },
    ],
  },
  {
    slug: "preconstruction-program-management",
    index: "07",
    title: "Preconstruction & Program Management",
    summary: "Feasibility, budgeting, permitting, and owner's representation.",
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
      src: unsplash("photo-1762146828422-50a8bd416d3c"),
      alt: "Architectural floor plan drawings spread across a table",
    },
    rowImages: [
      {
        src: unsplash("photo-1503387762-592deb58ef4e"),
        alt: "Hand drawing on an architectural blueprint with a ruler and pencil",
      },
      {
        src: unsplash("photo-1682663810771-89d21838530f"),
        alt: "Survey equipment on a tripod with a tower crane in the background",
      },
      {
        src: unsplash("photo-1742112125635-6f8201c6ee3f"),
        alt: "Two site workers in hard hats shaking hands in front of stacked precast concrete panels",
      },
    ],
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
    src: unsplash("photo-1742112125635-6f8201c6ee3f"),
    alt: "Two site workers in hard hats shaking hands in front of stacked precast concrete panels",
  },
};
