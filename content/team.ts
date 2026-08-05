import type { SiteImage } from "@/content/images";

export type TeamMember = {
  name: string;
  role: string;
  /** Members without a shot yet render the person-glyph fallback frame. */
  photo?: SiteImage;
};

// Array order is display order for the home marquee and /about#team,
// set by the client.
export const teamMembers: TeamMember[] = [
  { name: "Dylan Hughes", role: "President & Chief Executive Officer", photo: { src: "/images/team/dylan-hughes.avif", alt: "Dylan Hughes" } },
  { name: "Shahrouz", role: "Chief Operating Officer & Qualifying Individual" },
  { name: "Ferris Zahedi", role: "VP of Construction Operations", photo: { src: "/images/team/ferris-zahedi.avif", alt: "Ferris Zahedi" } },
  { name: "Arshia Esmaeili", role: "Chief Financial Officer & Corporate Secretary", photo: { src: "/images/team/arshia-esmaeili.avif", alt: "Arshia Esmaeili" } },
  { name: "G. Reza Ghasemi", role: "Senior Project Engineer, Energy Infrastructure", photo: { src: "/images/team/reza-ghasemi.avif", alt: "G. Reza Ghasemi" } },
  { name: "Mazen Khoudeir", role: "Design Manager & Preconstruction Lead", photo: { src: "/images/team/mazen-khoudeir.avif", alt: "Mazen Khoudeir" } },
  { name: "Payam Shirazi", role: "Director of Business Development", photo: { src: "/images/team/payam-shirazi.avif", alt: "Payam Shirazi" } },
  { name: "Elika Grami", role: "Business Development Manager" },
  { name: "Daniel Zhang", role: "Strategic Partnerships Manager", photo: { src: "/images/team/daniel-zhang.avif", alt: "Daniel Zhang" } },
  { name: "Michelle Taylor", role: "Marketing Manager", photo: { src: "/images/team/michelle-taylor.avif", alt: "Michelle Taylor" } },
  { name: "Mounir Khoudeir", role: "Senior Technical Advisor", photo: { src: "/images/team/mounir-khoudeir.avif", alt: "Mounir Khoudeir" } },
];
