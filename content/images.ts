/**
 * Temporary placeholder photography, hotlinked from Unsplash while real
 * project photos are shot. Swapping an image means editing one line here or
 * in content/projects.ts / content/services.ts — nothing lives in JSX.
 * next.config.ts allows images.unsplash.com; the optimizer does the rest.
 */

export type SiteImage = {
  src: string;
  alt: string;
};

/** Large source rendition; next/image derives the responsive sizes. */
export function unsplash(id: string, width = 2400): string {
  return `https://images.unsplash.com/${id}?q=80&w=${width}&auto=format&fit=crop`;
}

export const siteImages = {
  homeHero: {
    src: unsplash("photo-1785024773247-1e3d7fc81ee9", 3200),
    alt: "Mid-century modern house with low rooflines set against the hills",
  },
  about: [
    {
      src: unsplash("photo-1653164488636-7407bec89281"),
      alt: "Architectural scale model of a house on a studio table",
    },
    {
      src: unsplash("photo-1590880795696-20c7dfadacde"),
      alt: "Drawings and documents spread across a wooden worktable",
    },
    {
      src: unsplash("photo-1517438020812-01a8eeb72f69"),
      alt: "A Silver Lake backstreet under a late Los Angeles sunset",
    },
  ],
  contact: {
    src: unsplash("photo-1780523893199-8f0fdab83909"),
    alt: "Vase with green branches on a quiet desk beside a bright window",
  },
} satisfies Record<string, SiteImage | SiteImage[]>;
