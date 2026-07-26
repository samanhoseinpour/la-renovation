import type { NavPanelKey } from "@/lib/site";

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
        meta: `${project.neighborhood} · ${project.year}`,
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
        meta: `${service.duration} · ${service.startingAtShort}`,
        image: service.image,
      })),
    },
  };
}
