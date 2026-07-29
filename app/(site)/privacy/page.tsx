import type { Metadata } from "next";

import { LegalArticle } from "@/components/sections/legal-article";
import { PageHeader } from "@/components/sections/page-header";
import { privacyPolicy } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What this site collects, which is almost nothing, and what happens to anything you send through the contact form.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title={privacyPolicy.title} />
      <LegalArticle doc={privacyPolicy} />
    </>
  );
}
