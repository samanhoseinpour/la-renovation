import type { Metadata } from "next";

import { LegalArticle } from "@/components/sections/legal-article";
import { PageHeader } from "@/components/sections/page-header";
import { termsOfUse } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "How this site may be used, and why nothing on it is an offer, a quote, or a substitute for a signed contract.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title={termsOfUse.title} />
      <LegalArticle doc={termsOfUse} />
    </>
  );
}
