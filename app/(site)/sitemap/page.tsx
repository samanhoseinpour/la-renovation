import type { Metadata } from "next";

import { PageHeader } from "@/components/sections/page-header";
import { SitemapDirectory } from "@/components/sections/sitemap-directory";
import { getSitemapGroups, sitemapHeader } from "@/content/sitemap";

export const metadata: Metadata = {
  title: "Sitemap",
  description: sitemapHeader.lead,
  alternates: { canonical: "/sitemap" },
};

export default function SitemapPage() {
  return (
    <>
      <PageHeader
        eyebrow={sitemapHeader.eyebrow}
        title={sitemapHeader.title}
        lead={sitemapHeader.lead}
      />
      <SitemapDirectory groups={getSitemapGroups()} />
    </>
  );
}
