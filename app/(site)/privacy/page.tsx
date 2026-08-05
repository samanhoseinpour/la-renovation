import type { Metadata } from "next";

import { LegalArticle } from "@/components/sections/legal-article";
import { PageHeader } from "@/components/sections/page-header";
import { privacyPolicy } from "@/content/legal";
import { breadcrumbNode, JsonLd, webPageNode } from "@/lib/seo";

const description =
  "What this site collects, which is almost nothing, and what happens to anything you send through the contact form.";

export const metadata: Metadata = {
  title: "Privacy policy",
  description,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        graph={[
          webPageNode({ path: "/privacy", title: "Privacy policy", description }),
          breadcrumbNode("/privacy", [
            { name: "Home", path: "/" },
            { name: "Privacy policy" },
          ]),
        ]}
      />
      <PageHeader eyebrow="Legal" title={privacyPolicy.title} />
      <LegalArticle doc={privacyPolicy} />
    </>
  );
}
