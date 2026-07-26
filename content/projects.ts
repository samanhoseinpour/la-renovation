import { unsplash, type SiteImage } from "./images";

export type Project = {
  slug: string;
  /** Two-digit index shown in the eyebrow caption, e.g. "001 / LOS FELIZ". */
  index: string;
  title: string;
  neighborhood: string;
  year: number;
  /** Short scope label used in listings. */
  scope: string;
  squareFeet: number;
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
};

export const projects: Project[] = [
  {
    slug: "hillside-house",
    index: "001",
    title: "Hillside House",
    neighborhood: "Los Feliz",
    year: 2025,
    scope: "Full renovation",
    squareFeet: 3400,
    summary:
      "A 1962 post-and-beam, carefully undone. We removed four decades of additions to recover the original section.",
    body: [
      "The house had been renovated three times since it was built, each pass adding partitions that cut the plan away from the hillside it was designed around. Our first move was subtraction: taking the interior back to its post-and-beam frame to see what was actually there.",
      "What emerged was a clean structural rhythm that the later work had obscured. We kept every original beam, replaced the failing glazing with thermally broken steel, and rebuilt the floor plane in a single material so the eye runs uninterrupted to the canyon.",
      "The kitchen moved to the north wall, where it now reads as casework rather than a room. Two bedrooms were combined into one primary suite. Nothing was added to the footprint.",
    ],
    facts: [
      { label: "Location", value: "Los Feliz, Los Angeles" },
      { label: "Completed", value: "2025" },
      { label: "Area", value: "3,400 sq ft" },
      { label: "Scope", value: "Full renovation, structural" },
      { label: "Original build", value: "1962" },
    ],
    services: ["full-renovation", "kitchen-bath"],
    image: {
      src: unsplash("photo-1771372578232-7c20a006f7b4", 3200),
      alt: "Vaulted living space with exposed wood beams and a wall of black-framed windows",
    },
    gallery: [
      {
        src: unsplash("photo-1764837599929-100bd5890c57"),
        alt: "Steel-framed glass doors opening to a view of trees and rooftops below",
      },
      {
        src: unsplash("photo-1749911774364-299b0134a84c"),
        alt: "Sunlit interior with floor-to-ceiling windows and sparse furniture",
      },
      {
        src: unsplash("photo-1560449752-3fd4bdbe7df0"),
        alt: "Warm wood-paneled study with built-in shelves and a reading chair",
      },
    ],
  },
  {
    slug: "canyon-residence",
    index: "002",
    title: "Canyon Residence",
    neighborhood: "Laurel Canyon",
    year: 2025,
    scope: "Addition + renovation",
    squareFeet: 2650,
    summary:
      "A cramped canyon cottage gains 600 square feet without ever looking larger from the street.",
    body: [
      "Hillside setbacks and a protected oak left almost no room to build outward, so the addition went down rather than out — a lower level cut into the slope, lit from a courtyard carved on the uphill side.",
      "From the street the house is unchanged: same roofline, same modest frontage. The new volume only reveals itself from the canyon below.",
      "Material palette is deliberately narrow — board-formed concrete at the cut, white oak above, and a single plaster tone throughout.",
    ],
    facts: [
      { label: "Location", value: "Laurel Canyon, Los Angeles" },
      { label: "Completed", value: "2025" },
      { label: "Area", value: "2,650 sq ft" },
      { label: "Scope", value: "Lower-level addition" },
      { label: "Original build", value: "1948" },
    ],
    services: ["additions-adu", "full-renovation"],
    image: {
      src: unsplash("photo-1773229323015-2dcf5be73dc6", 3200),
      alt: "Two slender trees against a smooth board-formed concrete facade",
    },
    gallery: [
      {
        src: unsplash("photo-1616179058441-37aa58affac8"),
        alt: "Formed-concrete wall with visible pour lines and texture",
      },
      {
        src: unsplash("photo-1653491945955-6bc68c5e013b"),
        alt: "House perched on a brushy Southern California hilltop among trees",
      },
      {
        src: unsplash("photo-1774516534097-76eb46de7229"),
        alt: "Calm concrete-walled interior with wood floor and a large window",
      },
    ],
  },
  {
    slug: "abbot-kinney-loft",
    index: "003",
    title: "Abbot Kinney Loft",
    neighborhood: "Venice",
    year: 2024,
    scope: "Interior renovation",
    squareFeet: 1850,
    summary:
      "A former workshop converted to a single-volume residence, keeping the bow-truss roof fully exposed.",
    body: [
      "The building's value was entirely in its roof — a bow-truss span that had been hidden above a dropped ceiling for thirty years. Everything we did was in service of keeping it visible from every point in the plan.",
      "Programme is arranged as freestanding volumes that stop short of the trusses: a kitchen block, a bathroom core, and a sleeping platform. None of them touch the roof.",
      "Skylights were reglazed rather than replaced, and the concrete slab was ground and sealed in place.",
    ],
    facts: [
      { label: "Location", value: "Venice, Los Angeles" },
      { label: "Completed", value: "2024" },
      { label: "Area", value: "1,850 sq ft" },
      { label: "Scope", value: "Adaptive reuse" },
      { label: "Original build", value: "1931" },
    ],
    services: ["full-renovation", "kitchen-bath"],
    image: {
      src: unsplash("photo-1718871783985-6ddaa255e922", 3200),
      alt: "Bright white loft interior with daylight washing over minimal furniture",
    },
    gallery: [
      {
        src: unsplash("photo-1767279141109-e63ff1e1e3e9"),
        alt: "Timber roof structure with skylights showing blue sky",
      },
      {
        src: unsplash("photo-1776090188651-a1ec2cf2bdb0"),
        alt: "Open industrial room with sunlight streaming across the floor",
      },
      {
        src: unsplash("photo-1783554467905-edd4c1b08321"),
        alt: "Industrial space with columns, large windows and a polished floor",
      },
    ],
  },
  {
    slug: "sunset-junction-adu",
    index: "004",
    title: "Sunset Junction ADU",
    neighborhood: "Silver Lake",
    year: 2024,
    scope: "New ADU",
    squareFeet: 740,
    summary:
      "A detached studio at the rear of a 1920s lot, built to read as a garden structure rather than a second house.",
    body: [
      "The brief was a working studio that could become a rental later, which meant it had to satisfy ADU code without ever feeling like a code exercise.",
      "We set the volume against the rear property line and opened it entirely to the garden, so the remaining yard reads as the building's room rather than what's left over.",
      "Cladding is vertical cedar left to grey. In two years it will disappear into the fence line.",
    ],
    facts: [
      { label: "Location", value: "Silver Lake, Los Angeles" },
      { label: "Completed", value: "2024" },
      { label: "Area", value: "740 sq ft" },
      { label: "Scope", value: "Detached ADU" },
      { label: "Permitting", value: "LA ADU ordinance" },
    ],
    services: ["additions-adu"],
    image: {
      src: unsplash("photo-1760067537293-6b30141d6a52", 3200),
      alt: "Compact modern structure with wood and stone exterior cladding",
    },
    gallery: [
      {
        src: unsplash("photo-1781902915627-00db827a7cf9"),
        alt: "Wood-clad garden structure framed by leaves under a blue sky",
      },
      {
        src: unsplash("photo-1774311237295-a65a4c1ff38a"),
        alt: "Small studio living space with a large window onto greenery",
      },
      {
        src: unsplash("photo-1607582544956-a874e6740135"),
        alt: "Compact white and wood kitchen inside a small studio",
      },
    ],
  },
];

export function getAllProjects(): Project[] {
  return projects;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectSlugs(): string[] {
  return projects.map((project) => project.slug);
}
