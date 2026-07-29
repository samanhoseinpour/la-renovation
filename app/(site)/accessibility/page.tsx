import type { Metadata } from "next";

import { LegalArticle } from "@/components/sections/legal-article";
import { PageHeader } from "@/components/sections/page-header";
import { accessibilityStatement } from "@/content/legal";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "How this site works with a keyboard, a screen reader, and reduced motion, and where it still falls short.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader eyebrow="Access" title={accessibilityStatement.title} />
      <LegalArticle doc={accessibilityStatement} />
    </>
  );
}
