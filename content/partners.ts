import type { SectionIntro } from "@/content/home";

export type Partner = {
  name: string;
  /** Bare host shown as the cell caption in the mono face; href carries the real link. */
  domain: string;
  href: string;
  /**
   * Ink-normalized mark under public/images/partners: pure black plus alpha,
   * so the strip can paint it with the foreground token via CSS mask in
   * either theme. Width/height are the intrinsic pixels of the trimmed mark.
   */
  logo: { src: string; width: number; height: number };
  /**
   * Optical size equalizer. Dense square lockups need more cap height than
   * wide wordmarks to carry the same visual weight at a shared baseline.
   */
  scale?: number;
};

/** Shared by the home and About strips; the band reads the same on both. */
export const partnersIntro: SectionIntro = {
  eyebrow: "Who we build with",
  heading: "The company we keep.",
  lead: "Manufacturers and builders we work with directly, here and across borders.",
};

/** Client-set order. Domains double as the captions: the TLDs carry the geography. */
export const partners: Partner[] = [
  {
    name: "Katwell",
    domain: "katwell.com.cn",
    href: "https://www.katwell.com.cn/en/",
    logo: { src: "/images/partners/katwell.avif", width: 800, height: 464 },
  },
  {
    name: "Canadian Flooring and Renovations",
    domain: "flooringandrenovations.com",
    href: "https://flooringandrenovations.com/",
    logo: { src: "/images/partners/canadian-flooring-renovations.avif", width: 350, height: 178 },
    scale: 0.95,
  },
  {
    name: "Wesdev Construction USA",
    domain: "wesdevconstruction.com",
    href: "https://wesdevconstruction.com/",
    logo: { src: "/images/partners/wesdev-construction.avif", width: 242, height: 112 },
    scale: 0.92,
  },
  {
    name: "Lions Gate Construction",
    domain: "lionsgateconstruction.ca",
    href: "https://lionsgateconstruction.ca/",
    logo: { src: "/images/partners/lions-gate-construction.avif", width: 800, height: 662 },
    scale: 1.18,
  },
  {
    name: "Relux Construction",
    domain: "reluxconstruction.com",
    href: "https://reluxconstruction.com/",
    logo: { src: "/images/partners/relux-construction.avif", width: 381, height: 600 },
    // The only portrait badge in the set: at the shared cap it would carry
    // roughly half the ink of the wordmarks beside it, so it runs well over.
    scale: 1.6,
  },
];
