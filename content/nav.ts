import type { NavPanelKey } from "@/lib/site";

import { siteImages } from "./images";
import type { SiteImage } from "./images";
import { getAllProjects } from "./projects";
import { getAllServices } from "./services";

export type NavPanelItem = {
  href: string;
  index: string;
  title: string;
  /** Pre-composed meta line — the separator and phrasing are copy decisions. */
  meta: string;
  image: SiteImage;
};

export type NavPanel = {
  allLabel: string;
  allHref: string;
  items: NavPanelItem[];
};

export type NavPanels = Record<NavPanelKey, NavPanel>;

/**
 * Lean projection of projects/services for the navigation surfaces (mega
 * panels, mobile accordion). Only these fields cross into client components —
 * bodies, galleries and fact rows stay on the server.
 */
export function getNavPanels(): NavPanels {
  return {
    projects: {
      allLabel: "All projects",
      allHref: "/projects",
      items: getAllProjects().map((project) => ({
        href: `/projects/${project.slug}`,
        index: project.index,
        title: project.title,
        meta: `${project.neighborhood} · ${project.scope}`,
        image: project.image,
      })),
    },
    services: {
      allLabel: "All services",
      allHref: "/services",
      items: getAllServices().map((service) => ({
        href: `/services/${service.slug}`,
        index: service.index,
        title: service.title,
        meta: service.scope,
        image: service.image,
      })),
    },
    about: {
      allLabel: "About the company",
      allHref: "/about",
      items: [
        { href: "/about#story", index: "01", title: "Our story", meta: "Built to close the seams", image: siteImages.about[0] },
        { href: "/about#mission", index: "02", title: "Mission & vision", meta: "One roof, one schedule", image: siteImages.about[1] },
        { href: "/about#team", index: "03", title: "Team", meta: "The people running the divisions", image: siteImages.about[2] },
        { href: "/about#approach", index: "04", title: "Approach", meta: "How projects are priced and run", image: siteImages.about[3] },
        { href: "/about#commitments", index: "05", title: "Commitments", meta: "Safety, quality, communication", image: siteImages.about[4] },
      ],
    },
  };
}
