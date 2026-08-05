import type { NavPanelKey } from "@/lib/site";

import { blurProps } from "./blur";
import { siteImages } from "./images";
import type { BlurProps, SiteImage } from "./images";
import { getAllProjects } from "./projects";
import { getAllServices } from "./services";

export type NavPanelItem = {
  href: string;
  index: string;
  title: string;
  /** Pre-composed meta line — the separator and phrasing are copy decisions. */
  meta: string;
  image: SiteImage;
  /** Resolved blur-up for `image`, computed here so the client menu never
      imports the server-only blur map. */
  imageBlur: BlurProps;
};

export type NavPanel = {
  allLabel: string;
  allHref: string;
  items: NavPanelItem[];
};

export type NavPanels = Record<NavPanelKey, NavPanel>;

/** Pairs a manifest image with its resolved blur-up for the client menu. */
const panelImage = (image: SiteImage) => ({
  image,
  imageBlur: blurProps(image.src),
});

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
        ...panelImage(project.image),
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
        ...panelImage(service.image),
      })),
    },
    about: {
      allLabel: "About the company",
      allHref: "/about",
      items: [
        { href: "/about#story", index: "01", title: "Our story", meta: "Built to close the seams", ...panelImage(siteImages.about[0]) },
        { href: "/about#mission", index: "02", title: "Mission & vision", meta: "One roof, one schedule", ...panelImage(siteImages.about[1]) },
        { href: "/about#team", index: "03", title: "Team", meta: "The people running the divisions", ...panelImage(siteImages.about[2]) },
        { href: "/about#approach", index: "04", title: "Approach", meta: "How projects are priced and run", ...panelImage(siteImages.about[3]) },
        { href: "/about#commitments", index: "05", title: "Commitments", meta: "Safety, quality, communication", ...panelImage(siteImages.about[4]) },
      ],
    },
  };
}
