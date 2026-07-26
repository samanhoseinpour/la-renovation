import { unsplash, type SiteImage } from "./images";

export type Service = {
  slug: string;
  index: string;
  title: string;
  /** One line for cards and meta descriptions. */
  summary: string;
  /** Paragraphs for the detail page. */
  body: string[];
  /** Bulleted scope items. */
  includes: string[];
  /** Rough engagement length, shown in the fact row. */
  duration: string;
  /** Indicative range — deliberately vague until real numbers are agreed. */
  startingAt: string;
  /** Portrait card photograph. Temporary Unsplash stand-in. */
  image: SiteImage;
  /** One image per body paragraph on the detail page (three each). */
  rowImages: SiteImage[];
};

export const services: Service[] = [
  {
    slug: "full-renovation",
    index: "01",
    title: "Full renovation",
    summary:
      "Whole-house work from survey through punch list, with one team responsible for both drawings and delivery.",
    body: [
      "Most of our work is whole-house. We start with a measured survey and a structural assessment, because on Los Angeles housing stock from the 1920s to the 1960s the constraints are almost never where the client expects them to be.",
      "Design and construction sit under one contract. That removes the gap where scope usually gets lost — there is no drawing set handed to a builder who then reprices it.",
      "We work to a fixed scope agreed before demolition, and we publish an allowance schedule so you can see exactly which decisions are still open.",
    ],
    includes: [
      "Measured survey and existing-conditions drawings",
      "Structural assessment and engineering coordination",
      "Permit set and agency submissions",
      "Fixed-scope construction contract",
      "Allowance schedule for finishes and fixtures",
      "Weekly site walk with written notes",
    ],
    duration: "9–16 months",
    startingAt: "Projects from $450k",
    image: {
      src: unsplash("photo-1704742950992-9815a104820c"),
      alt: "Interior room under construction with exposed wooden stud framing",
    },
    rowImages: [
      {
        src: unsplash("photo-1698846296220-e44d9d4b9100"),
        alt: "Hands sketching a floor plan on paper",
      },
      {
        src: unsplash("photo-1463082459669-fd1ca1692fea"),
        alt: "Woodworker's hands running along a plank in a workshop",
      },
      {
        src: unsplash("photo-1600210492493-0946911123ea"),
        alt: "Finished living room with a leather sofa beside a large window",
      },
    ],
  },
  {
    slug: "kitchen-bath",
    index: "02",
    title: "Kitchen & bath",
    summary:
      "Single-room work at the same level of detail as a full renovation, without the whole house coming apart.",
    body: [
      "Kitchens and baths are where a renovation is judged, and they are also where the most decisions compress into the least square footage.",
      "We treat them as cabinetry-and-services problems first. Getting the plumbing wall and the appliance run right at survey stage is what prevents the compromises that show up later as a soffit nobody wanted.",
      "Casework is drawn in full and shop-fabricated. Nothing is specified from a catalogue page and adjusted on site.",
    ],
    includes: [
      "Existing services survey",
      "Full cabinetry and millwork drawings",
      "Appliance and fixture specification",
      "Electrical and lighting layout",
      "Shop-fabricated casework",
      "Two-week site protection plan",
    ],
    duration: "3–6 months",
    startingAt: "Projects from $120k",
    image: {
      src: unsplash("photo-1765371515325-b6611765dfad"),
      alt: "Modern wooden kitchen with a marble backsplash",
    },
    rowImages: [
      {
        src: unsplash("photo-1764526624453-db32c24eca55"),
        alt: "Warm wooden kitchen with an island",
      },
      {
        src: unsplash("photo-1781249144416-46a743be97a0"),
        alt: "Kitchen with speckled stone countertops and wood cabinets",
      },
      {
        src: unsplash("photo-1688786219616-598ed96aa19d"),
        alt: "Freestanding bathtub in a bathroom with stone flooring",
      },
    ],
  },
  {
    slug: "additions-adu",
    index: "03",
    title: "Additions & ADUs",
    summary:
      "Accessory dwellings and volume additions, permitted under current Los Angeles ordinance.",
    body: [
      "California's ADU rules changed what is possible on a standard Los Angeles lot, but the ordinance rewards projects that are designed around it rather than squeezed into it afterwards.",
      "We run a feasibility study before any design work: setbacks, height envelope, parking, fire access, and utility capacity. It is a short piece of work that regularly saves a year.",
      "Additions to the main house follow the same logic — we would rather find the volume inside the existing envelope than add to the footprint.",
    ],
    includes: [
      "Zoning and feasibility study",
      "ADU ordinance compliance review",
      "Utility capacity assessment",
      "Permit set and plan-check response",
      "Construction delivery",
      "Final inspection and certificate",
    ],
    duration: "8–14 months",
    startingAt: "Projects from $280k",
    image: {
      src: unsplash("photo-1635356200963-544fbe261517"),
      alt: "Minimal concrete building volume with a tree behind it",
    },
    rowImages: [
      {
        src: unsplash("photo-1676802037786-3697d60497ae"),
        alt: "New timber framing and roof trusses against a blue sky",
      },
      {
        src: unsplash("photo-1587897916568-06872801b3cc"),
        alt: "Contemporary white house volume among green trees",
      },
      {
        src: unsplash("photo-1759435530019-10b2c9f0f315"),
        alt: "Quiet modern wooden house with a single large window",
      },
    ],
  },
  {
    slug: "historic-restoration",
    index: "04",
    title: "Historic restoration",
    summary:
      "Work on HPOZ and Mills Act properties, where the review process is part of the design problem.",
    body: [
      "In a Historic Preservation Overlay Zone the question is not what you would like to do but what you can demonstrate is consistent with the period of significance.",
      "We prepare the documentation that review boards actually want: photographic survey, character-defining feature analysis, and drawings that distinguish original fabric from later intervention.",
      "Where original material can be repaired we repair it. Replacement is a last resort and is documented as such.",
    ],
    includes: [
      "Photographic and measured survey",
      "Character-defining feature analysis",
      "HPOZ / Mills Act documentation",
      "Board presentation and review support",
      "Specialist trade coordination",
      "Repair-first material strategy",
    ],
    duration: "12–20 months",
    startingAt: "Projects from $500k",
    image: {
      src: unsplash("photo-1776538229240-a4a83d29713e"),
      alt: "Ornate trim and painted detailing on a historic house",
    },
    rowImages: [
      {
        src: unsplash("photo-1721244654392-9c912a6eb236"),
        alt: "Vintage architectural blueprint with facade elevations",
      },
      {
        src: unsplash("photo-1677484249724-229971fa7925"),
        alt: "Chair on the shaded porch of a historic house",
      },
      {
        src: unsplash("photo-1618582383736-ed9080511254"),
        alt: "Restored period room with an antique wooden door",
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
