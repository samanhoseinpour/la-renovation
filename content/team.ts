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
  { name: "Dylan Hughes", role: "President & Chief Executive Officer", photo: { src: "/images/team/dylan-hughes.avif", alt: "Dylan Hughes, President & Chief Executive Officer at Araz Construction Group" } },
  { name: "Shahrouz Kharrati", role: "Chief Operating Officer & Qualifying Individual", photo: { src: "/images/team/shahrouz-kharrati.avif", alt: "Shahrouz Kharrati, Chief Operating Officer & Qualifying Individual at Araz Construction Group" } },
  { name: "Ferris Zahedi", role: "VP of Construction Operations", photo: { src: "/images/team/ferris-zahedi.avif", alt: "Ferris Zahedi, VP of Construction Operations at Araz Construction Group" } },
  { name: "Arshia Esmaeili", role: "Chief Financial Officer & Corporate Secretary", photo: { src: "/images/team/arshia-esmaeili.avif", alt: "Arshia Esmaeili, Chief Financial Officer & Corporate Secretary at Araz Construction Group" } },
  { name: "G. Reza Ghasemi", role: "Senior Project Engineer, Energy Infrastructure", photo: { src: "/images/team/reza-ghasemi.avif", alt: "G. Reza Ghasemi, Senior Project Engineer for Energy Infrastructure at Araz Construction Group" } },
  { name: "Mazen Khoudeir", role: "Design Manager & Preconstruction Lead", photo: { src: "/images/team/mazen-khoudeir.avif", alt: "Mazen Khoudeir, Design Manager & Preconstruction Lead at Araz Construction Group" } },
  { name: "Payam Shirazi", role: "Director of Business Development", photo: { src: "/images/team/payam-shirazi.avif", alt: "Payam Shirazi, Director of Business Development at Araz Construction Group" } },
  { name: "Elika Grami", role: "Business Development Manager", photo: { src: "/images/team/elika-grami.avif", alt: "Elika Grami, Business Development Manager at Araz Construction Group" } },
  { name: "Daniel Zhang", role: "Strategic Partnerships Manager", photo: { src: "/images/team/daniel-zhang.avif", alt: "Daniel Zhang, Strategic Partnerships Manager at Araz Construction Group" } },
  { name: "Michelle Taylor", role: "Marketing Manager", photo: { src: "/images/team/michelle-taylor.avif", alt: "Michelle Taylor, Marketing Manager at Araz Construction Group" } },
  { name: "Mounir Khoudeir", role: "Senior Technical Advisor", photo: { src: "/images/team/mounir-khoudeir.avif", alt: "Mounir Khoudeir, Senior Technical Advisor at Araz Construction Group" } },
];
