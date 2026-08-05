/**
 * Site-wide imagery, all self-hosted AVIF under public/images/: the client's
 * own photos (home hero, About lead, EV charging depot, concrete division
 * card, the CEO's team portrait) plus Unsplash placeholder photography landed
 * locally until real project photos are shot. Swapping an image means editing one line here or
 * in content/projects.ts / content/services.ts — nothing lives in JSX.
 *
 * Only the gated demo projects in content/projects.ts still hotlink Unsplash
 * (next.config.ts allows images.unsplash.com): next/image fetches remote
 * sources server-side, and this dev machine can't reach images.unsplash.com,
 * so hotlinked entries render broken in next dev. New placeholders land like
 * the rest (download via the images.weserv.nl proxy, then images:migrate +
 * images:optimize into public/images/).
 */

export type SiteImage = {
  src: string;
  alt: string;
};

/** Large source rendition; next/image derives the responsive sizes. */
export function unsplash(id: string, width = 2400): string {
  return `https://images.unsplash.com/${id}?q=80&w=${width}&auto=format&fit=crop`;
}

/**
 * Resolved placeholder="blur" props for one image, ready to spread onto a
 * next/image; empty when the source has no generated entry. Computed by
 * blurProps() in content/blur.ts — server-only, so the generated map never
 * ships in a client bundle; client components receive these through props.
 */
export type BlurProps =
  | { placeholder: "blur"; blurDataURL: string }
  | Record<string, never>;

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
      src: "/images/services/service-preconstruction-survey-tripod.avif",
      alt: "Survey equipment on a tripod with a tower crane in the background",
    },
  ],
  /** Full-bleed coverage band on home. Placeholder until a client photo lands. */
  homeCoverage: {
    src: "/images/services/service-civil-night-paving.avif",
    alt: "Night paving crew operating an asphalt paving machine on a road",
  },
  /** Behind the All-divisions tile in the home grid. Rendered blurred to
      texture, so it only needs to read as "the whole company": the handshake
      echoes "One contract." */
  homeAllDivisions: {
    src: "/images/services/service-delivery-handshake.avif",
    alt: "Two site workers in hard hats shaking hands in front of stacked precast concrete panels",
  },
  /** Closing CTA panel on nearly every route. Shares the All-divisions source
      (that tile renders it blurred, so they never read as the same frame)
      until real jobsite photography lands. */
  contactCta: {
    src: "/images/services/service-delivery-handshake.avif",
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
      src: "/images/services/service-concrete-rebar-cages.avif",
      alt: "Construction worker in a hard hat crouched among structural rebar cages",
    },
  ],
} satisfies Record<string, SiteImage | SiteImage[]>;
