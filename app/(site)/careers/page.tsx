import type { Metadata } from "next";

import { CareersOverview } from "@/components/sections/careers-overview";
import { PageHeader } from "@/components/sections/page-header";
import { careersIntro, careersValues, generalApplication } from "@/content/careers";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "No openings are listed right now, but we read every introduction from people in the trades and in preconstruction.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Working here"
        title="We build it ourselves. That takes people."
        lead={careersIntro}
      />

      {/* No section heading between the h1 and the values: CareersOverview's
          value titles and application heading are this page's h2 outline. */}
      <CareersOverview
        values={careersValues}
        application={generalApplication}
        email={site.contact.email}
      />
    </>
  );
}
