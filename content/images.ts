/**
 * Site-wide imagery. The home hero, the About lead photo, the home intro's
 * EV charging photo and the concrete division's card are the client's own
 * images, stored as AVIF under public/images/. The rest is temporary
 * placeholder photography hotlinked from Unsplash (next.config.ts allows
 * images.unsplash.com) until real project photos are shot. Swapping an image
 * means editing one line here or in content/projects.ts /
 * content/services.ts — nothing lives in JSX.
 *
 * The three About story/nav placeholders are Unsplash shots stored locally
 * like the client images: next/image fetches remote sources server-side, and
 * this dev machine can't reach images.unsplash.com, so hotlinked entries
 * render broken in next dev. New placeholders should land the same way
 * (download, then images:migrate + images:optimize into public/images/).
 */

import { blurMap } from "./blur-map.generated";

export type SiteImage = {
  src: string;
  alt: string;
};

/** Large source rendition; next/image derives the responsive sizes. */
export function unsplash(id: string, width = 2400): string {
  return `https://images.unsplash.com/${id}?q=80&w=${width}&auto=format&fit=crop`;
}

/**
 * Blur-up props for any manifest src, local path or Unsplash URL. Spread onto
 * a next/image; sources missing from the generated map degrade to no
 * placeholder. Regenerate the map with `npm run images:placeholders`.
 */
export function blurProps(
  src: string,
): { placeholder: "blur"; blurDataURL: string } | Record<string, never> {
  const key = src.startsWith("/")
    ? src
    : /images\.unsplash\.com\/(photo-[A-Za-z0-9_-]+)/.exec(src)?.[1];
  const blurDataURL = key ? blurMap[key] : undefined;
  return blurDataURL ? { placeholder: "blur", blurDataURL } : {};
}

export const siteImages = {
  homeHero: {
    src: "/images/home/home-downtown-la-skyline-sunset.avif",
    alt: "Downtown Los Angeles skyline at sunset, high-rise towers against the San Gabriel Mountains",
  },
  /** Two-image diptych beside the "Who we are" copy on home. */
  homeIntro: [
    {
      src: "/images/home/home-ev-truck-charging-depot.avif",
      alt: "Electric trucks charging at a row of DC fast chargers in a logistics yard",
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
  /** Behind the All-divisions tile in the home grid. Rendered blurred to
      texture, so it only needs to read as "the whole company": the handshake
      echoes "One contract." */
  homeAllDivisions: {
    src: unsplash("photo-1742112125635-6f8201c6ee3f"),
    alt: "Two site workers in hard hats shaking hands in front of stacked precast concrete panels",
  },
  /** Closing CTA panel on nearly every route. Shares the All-divisions source
      (that tile renders it blurred, so they never read as the same frame)
      until real jobsite photography lands. */
  contactCta: {
    src: unsplash("photo-1742112125635-6f8201c6ee3f"),
    alt: "Two site workers in hard hats shaking hands in front of stacked precast concrete panels",
  },
  about: [
    {
      src: "/images/about/about-laguna-coastline-aerial.avif",
      alt: "Aerial view of the Laguna Beach coastline, homes on the bluffs above a curving Pacific shoreline",
    },
    {
      src: "/images/about/about-highrise-tower-cranes.avif",
      alt: "Tower cranes over a high-rise under construction, the upper floors wrapped in scaffolding and netting",
    },
    {
      src: "/images/about/about-crew-post-tension-deck.avif",
      alt: "Site crew in hard hats and high-visibility vests surveying a post-tensioned concrete deck before the pour",
    },
    {
      src: "/images/about/about-site-walk-deck.avif",
      alt: "Two engineers in hard hats and high-visibility vests on a rebar deck, one pointing across the site",
    },
    {
      src: unsplash("photo-1635249578213-68b0aa67fdf7"),
      alt: "Construction worker in a hard hat crouched among structural rebar cages",
    },
  ],
} satisfies Record<string, SiteImage | SiteImage[]>;
