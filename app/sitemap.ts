import type { MetadataRoute } from "next";

import { getAllProjects } from "@/content/projects";
import { getAllServices } from "@/content/services";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // `satisfies` keeps changeFrequency as its literal type; a bare array literal
  // would widen it to `string` and fail the MetadataRoute.Sitemap contract.
  const staticPages = [
    // Trailing slash: metadataBase + `canonical: "/"` resolves the home page to
    // `${site.url}/`, and the sitemap has to name the same URL as the canonical.
    { url: `${site.url}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/projects`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/services`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/about`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/contact`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/careers`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/accessibility`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/sitemap`, changeFrequency: "yearly", priority: 0.3 },
  ] satisfies MetadataRoute.Sitemap;

  const staticRoutes: MetadataRoute.Sitemap = staticPages.map((entry) => ({
    ...entry,
    lastModified,
  }));

  const projectRoutes: MetadataRoute.Sitemap = getAllProjects().map(
    (project) => ({
      url: `${site.url}/projects/${project.slug}`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.7,
    }),
  );

  const serviceRoutes: MetadataRoute.Sitemap = getAllServices().map(
    (service) => ({
      url: `${site.url}/services/${service.slug}`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    }),
  );

  return [...staticRoutes, ...projectRoutes, ...serviceRoutes];
}
