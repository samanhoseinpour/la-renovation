import type { Metadata } from "next";

import { PageHeader } from "@/components/sections/page-header";
import { SitemapDirectory } from "@/components/sections/sitemap-directory";
import { getSitemapGroups, sitemapHeader } from "@/content/sitemap";
import { breadcrumbNode, JsonLd, webPageNode } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sitemap",
  description: sitemapHeader.lead,
  alternates: { canonical: "/sitemap" },
};

export default function SitemapPage() {
  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            path: "/sitemap",
            title: "Sitemap",
            description: sitemapHeader.lead,
            type: "CollectionPage",
          }),
          breadcrumbNode("/sitemap", [
            { name: "Home", path: "/" },
            { name: "Sitemap" },
          ]),
        ]}
      />
      <PageHeader
        eyebrow={sitemapHeader.eyebrow}
        title={sitemapHeader.title}
        lead={sitemapHeader.lead}
      />
      <SitemapDirectory groups={getSitemapGroups()} />
    </>
  );
}
