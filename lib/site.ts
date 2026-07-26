export type NavPanelKey = "projects" | "services";

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
  name: "LA Renovation",
  /** Short form for the wordmark. */
  shortName: "LA/REN",
  tagline: "Design-build studio in Los Angeles",
  description:
    "A design-build studio renovating Los Angeles homes with restraint. Full-house renovations, kitchens, baths and ADUs across the Eastside and Westside.",
  /** Placeholder until the real domain is registered. */
  url: "https://larenovation.com",
  locale: "en_US",

  contact: {
    email: "studio@larenovation.com",
    phone: "+1 (323) 555-0142",
    phoneHref: "tel:+13235550142",
    address: {
      street: "2451 Sunset Blvd",
      city: "Los Angeles",
      state: "CA",
      zip: "90026",
    },
    hours: "Mon–Fri, 9am–6pm PT",
  },

  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Houzz", href: "https://houzz.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],

  nav: [
    { label: "Projects", href: "/projects", panel: "projects" },
    { label: "Services", href: "/services", panel: "services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],

  /** Shown in the footer. CA contractors are required to display this. */
  license: "CSLB #1098234",
} as const;
