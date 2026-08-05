import type { Metadata } from "next";

import { LegalArticle } from "@/components/sections/legal-article";
import { PageHeader } from "@/components/sections/page-header";
import { accessibilityStatement } from "@/content/legal";
import { breadcrumbNode, JsonLd, webPageNode } from "@/lib/seo";

const description =
  "How this site works with a keyboard, a screen reader, and reduced motion, and where it still falls short.";

export const metadata: Metadata = {
  title: "Accessibility",
  description,
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            path: "/accessibility",
            title: "Accessibility",
            description,
          }),
          breadcrumbNode("/accessibility", [
            { name: "Home", path: "/" },
            { name: "Accessibility" },
          ]),
        ]}
      />
      <PageHeader eyebrow="Access" title={accessibilityStatement.title} />
      <LegalArticle doc={accessibilityStatement} />
    </>
  );
}
