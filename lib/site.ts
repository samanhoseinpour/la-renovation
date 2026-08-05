export type NavPanelKey = "projects" | "services" | "about";

export type NavItem = {
  label: string;
  href: string;
  /** Opens a mega-menu panel on desktop and an accordion section on mobile. */
  panel?: NavPanelKey;
};

/**
 * Build-time publish gates for content that exists in the repo but isn't
 * ready to show: demo projects, client notes with no real clients behind
 * them. Flip a flag to true and every gated surface (nav, home, footer,
 * sitemaps, routes) comes back on its own — nothing else needs editing.
 */
export const published: { projects: boolean; testimonials: boolean } = {
  projects: false,
  testimonials: false,
};

// The Projects item stays defined while unpublished so the flag flip
// restores it; the filter inside `site` is what keeps it out of the header.
const navItems: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects", panel: "projects" },
  { label: "Services", href: "/services", panel: "services" },
  { label: "About", href: "/about", panel: "about" },
  { label: "Contact", href: "/contact" },
];

/**
 * Single source of truth for site-wide copy, navigation and contact details.
 * Anything that appears in more than one place belongs here.
 */
export const site = {
  name: "Araz Construction Group",
  /** Short form for the wordmark. */
  shortName: "ARAZ",
  tagline: "Ground to grid.",
  description:
    "Sustainable energy infrastructure alongside commercial, civil, and multifamily construction across Southern California.",
  url: "https://arazconstructiongroup.com",
  locale: "en_US",

  contact: {
    email: "office@arazconstruction.example", // placeholder — client to supply
    phone: "+1 (714) 555-0163", // placeholder — client to supply
    phoneHref: "tel:+17145550163",
    // The client dropped the county-level base claim (the site speaks
    // Southern California only), so street, city and zip all stay blank
    // until a real address lands. Consumers must render-guard every field.
    address: {
      street: "",
      city: "",
      state: "California",
      zip: "",
    },
    hours: "Mon–Fri, 8am–5pm PT",
  },

  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],

  nav: navItems.filter(
    (item) => item.panel !== "projects" || published.projects,
  ),

  /**
   * Shown in the footer. CA contractors are required to display this, but a
   * fabricated number is a legal liability — leave unset until the client
   * supplies the real CSLB number, and every consumer must render-guard it.
   */
  license: undefined as string | undefined,

  /**
   * Bond and insurance details shown on /licenses. Same rule as the license
   * number: fabricating them is a liability, so each stays unset until the
   * client supplies the real value, and every consumer must render-guard.
   */
  licensing: {
    bond: undefined as string | undefined,
    liability: undefined as string | undefined,
    workersComp: undefined as string | undefined,
  },
} as const;
