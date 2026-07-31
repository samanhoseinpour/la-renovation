/**
 * Site-wide imagery. The home hero and the About lead photo are the client's
 * own banners, stored as AVIF under public/images/. The rest is temporary
 * placeholder photography hotlinked from Unsplash (next.config.ts allows
 * images.unsplash.com) until real project photos are shot. Swapping an image
 * means editing one line here or in content/projects.ts /
 * content/services.ts — nothing lives in JSX.
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
    src: "/images/home/home-downtown-la-skyline-sunset.avif",
    alt: "Downtown Los Angeles skyline at sunset, high-rise towers against the San Gabriel Mountains",
  },
  /** Two-image diptych beside the "Who we are" copy on home. */
  homeIntro: [
    {
      src: unsplash("photo-1743130940742-c0d1fff97f1c"),
      alt: "Two workers pouring concrete into a rebar-lined foundation form in a residential backyard",
    },
    {
      src: unsplash("photo-1682663810771-89d21838530f"),
      alt: "Survey equipment on a tripod with a tower crane in the background",
    },
  ],
  /** Full-bleed coverage band on home. Placeholder until a client photo lands. */
  homeCoverage: {
    src: unsplash("photo-1757030689760-3ec8be7326ae"),
    alt: "Night paving crew operating an asphalt paving machine on a road",
  },
  about: [
    {
      src: "/images/about/about-laguna-coastline-aerial.avif",
      alt: "Aerial view of the Laguna Beach coastline, homes on the bluffs above a curving Pacific shoreline",
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
