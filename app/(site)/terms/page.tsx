import type { Metadata } from "next";

import { LegalArticle } from "@/components/sections/legal-article";
import { PageHeader } from "@/components/sections/page-header";
import { termsOfUse } from "@/content/legal";
import { breadcrumbNode, JsonLd, webPageNode } from "@/lib/seo";

const description =
  "How this site may be used, and why nothing on it is an offer, a quote, or a substitute for a signed contract.";

export const metadata: Metadata = {
  title: "Terms of use",
  description,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <JsonLd
        graph={[
          webPageNode({ path: "/terms", title: "Terms of use", description }),
          breadcrumbNode("/terms", [
            { name: "Home", path: "/" },
            { name: "Terms of use" },
          ]),
        ]}
      />
      <PageHeader eyebrow="Legal" title={termsOfUse.title} />
      <LegalArticle doc={termsOfUse} />
    </>
  );
}
