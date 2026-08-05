import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

// display "browser" on purpose: this is a marketing site, not an installable
// app, and pretending otherwise just gets visitors a chromeless dead end.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#F3F3F1",
    theme_color: "#F3F3F1",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
