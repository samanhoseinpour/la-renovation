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
    src: unsplash("photo-1513828583688-c52646db42da", 3200),
    alt: "Industrial facility with blue motors and steel piping systems",
  },
  about: [
    {
      src: unsplash("photo-1504384308090-c894fdcc538d"),
      alt: "Construction workers in a modern workspace with laptops and equipment",
    },
    {
      src: unsplash("photo-1552664730-d307ca884978"),
      alt: "Team collaborating in a bright office environment with large windows",
    },
    {
      src: unsplash("photo-1454165804606-c3d57bc86b40"),
      alt: "People designing and reviewing architectural blueprints together",
    },
    {
      src: unsplash("photo-1493857671505-72967e2e2760"),
      alt: "Construction project planning with architectural models and blueprints",
    },
  ],
} satisfies Record<string, SiteImage | SiteImage[]>;
