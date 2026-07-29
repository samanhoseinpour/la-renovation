export type NavPanelKey = "projects" | "services" | "about";

export type NavItem = {
  label: string;
  href: string;
  /** Opens a mega-menu panel on desktop and an accordion section on mobile. */
  panel?: NavPanelKey;
};

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
    "Multifamily, commercial, and civil construction across Southern California.",
  url: "https://arazconstructiongroup.com",
  locale: "en_US",

  contact: {
    email: "office@arazconstruction.example", // placeholder — client to supply
    phone: "+1 (714) 555-0163", // placeholder — client to supply
    phoneHref: "tel:+17145550163",
    // City-level only until the client sends a real street address; street
    // and zip stay blank rather than fabricated. Consumers must render-guard
    // both.
    address: {
      street: "",
      city: "Orange County",
      state: "California",
      zip: "",
    },
    hours: "Mon–Fri, 8am–5pm PT",
  },

  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],

  nav: [
    { label: "Projects", href: "/projects", panel: "projects" },
    { label: "Services", href: "/services", panel: "services" },
    { label: "About", href: "/about", panel: "about" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],

  /**
   * Shown in the footer. CA contractors are required to display this, but a
   * fabricated number is a legal liability — leave unset until the client
   * supplies the real CSLB number, and every consumer must render-guard it.
   */
  license: undefined as string | undefined,
} as const;
