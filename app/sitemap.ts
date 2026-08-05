import type { MetadataRoute } from "next";

import { siteImages } from "@/content/images";
import { getAllProjects } from "@/content/projects";
import { getAllServices } from "@/content/services";
import { published, site } from "@/lib/site";

/**
 * Only stable self-hosted originals belong in the image extension: never
 * `/_next/image` variants (optimizer config churn mints new URLs, and image
 * reindexing is slow enough that churn costs real traffic) and never the
 * gated demo projects' remote placeholders. Google reads nothing but
 * `<image:loc>` since 2022, so a bare URL list is the whole feature.
 */
const selfHostedImages = (sources: readonly string[]) =>
  sources
    .filter((src) => src.startsWith("/images/"))
    .map((src) => `${site.url}${src}`);

// No lastModified anywhere on purpose: nothing here tracks real content
// dates, and a synthetic build timestamp erodes crawler trust more than
// omission does.
export default function sitemap(): MetadataRoute.Sitemap {
  // `satisfies` keeps changeFrequency as its literal type; a bare array literal
  // would widen it to `string` and fail the MetadataRoute.Sitemap contract.
  const staticPages = [
    // Trailing slash: metadataBase + `canonical: "/"` resolves the home page to
    // `${site.url}/`, and the sitemap has to name the same URL as the canonical.
    {
      url: `${site.url}/`,
      changeFrequency: "monthly",
      priority: 1,
      images: selfHostedImages([
        siteImages.homeHero.src,
        ...siteImages.homeIntro.map((image) => image.src),
        siteImages.homeCoverage.src,
      ]),
    },
    { url: `${site.url}/projects`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/services`, changeFrequency: "yearly", priority: 0.8 },
    {
      url: `${site.url}/about`,
      changeFrequency: "yearly",
      priority: 0.6,
      images: selfHostedImages(siteImages.about.map((image) => image.src)),
    },
    { url: `${site.url}/contact`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/careers`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/accessibility`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/sitemap`, changeFrequency: "yearly", priority: 0.3 },
  ] satisfies MetadataRoute.Sitemap;

  // /projects stays out of the XML while the portfolio is unpublished; a
  // filter (not a conditional spread inside the literal) keeps `satisfies`
  // narrowing changeFrequency.
  const staticRoutes: MetadataRoute.Sitemap = staticPages.filter(
    (entry) => published.projects || entry.url !== `${site.url}/projects`,
  );

  const projectRoutes: MetadataRoute.Sitemap = getAllProjects().map(
    (project) => ({
      url: `${site.url}/projects/${project.slug}`,
      changeFrequency: "yearly",
      priority: 0.7,
      images: selfHostedImages([
        project.image.src,
        ...project.gallery.map((image) => image.src),
      ]),
    }),
  );

  const serviceRoutes: MetadataRoute.Sitemap = getAllServices().map(
    (service) => ({
      url: `${site.url}/services/${service.slug}`,
      changeFrequency: "yearly",
      priority: 0.6,
      images: selfHostedImages([
        service.image.src,
        ...service.rowImages.map((image) => image.src),
      ]),
    }),
  );

  return [...staticRoutes, ...projectRoutes, ...serviceRoutes];
}
