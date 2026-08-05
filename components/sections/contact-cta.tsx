import { ContactCtaPanel } from "@/components/sections/contact-cta-panel";
import { blurProps } from "@/content/blur";
import { siteImages } from "@/content/images";
import type { CtaCopy } from "@/content/office";

/**
 * Server shell for the closing CTA panel: resolves the shared photograph and
 * its blur-up here so the client panel never imports the server-only blur
 * map — the compare-gallery pattern. Per-page copy still arrives from
 * content/office.ts via each route.
 */
export function ContactCta({ copy }: { copy: CtaCopy }) {
  return (
    <ContactCtaPanel
      copy={copy}
      image={siteImages.contactCta}
      blur={blurProps(siteImages.contactCta.src)}
    />
  );
}
