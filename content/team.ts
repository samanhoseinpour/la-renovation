import type { SiteImage } from "@/content/images";

export type TeamMember = { name: string; role: string; photo: SiteImage };

export const teamMembers: TeamMember[] = [
  { name: "Mahyar Taghizadeh", role: "CEO", photo: { src: "/images/team/mahyar-taghizadeh.avif", alt: "Mahyar Taghizadeh" } },
  { name: "Reza Ghasemi", role: "Senior Project Engineer", photo: { src: "/images/team/reza-ghasemi.avif", alt: "Reza Ghasemi" } },
  { name: "Ferris Zahedi", role: "Infrastructure Development Manager", photo: { src: "/images/team/ferris-zahedi.avif", alt: "Ferris Zahedi" } },
  { name: "Mazen Khoudeir", role: "Architectural Project Manager", photo: { src: "/images/team/mazen-khoudeir.avif", alt: "Mazen Khoudeir" } },
  { name: "Mounir Khoudeir", role: "Sustainable Energy Integration Advisor", photo: { src: "/images/team/mounir-khoudeir.avif", alt: "Mounir Khoudeir" } },
  { name: "Daniel Zhang", role: "Global Partnerships Manager", photo: { src: "/images/team/daniel-zhang.avif", alt: "Daniel Zhang" } },
  { name: "Payam Shirazi", role: "Business Development", photo: { src: "/images/team/payam-shirazi.avif", alt: "Payam Shirazi" } },
  { name: "Michelle Taylor", role: "Marketing Coordinator", photo: { src: "/images/team/michelle-taylor.avif", alt: "Michelle Taylor" } },
  { name: "Arshia Esmaeili", role: "Sales and Marketing Specialist", photo: { src: "/images/team/arshia-esmaeili.avif", alt: "Arshia Esmaeili" } },
];
