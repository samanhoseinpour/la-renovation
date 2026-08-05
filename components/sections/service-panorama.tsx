import {
  ServicePanoramaRail,
  type PanoramaItem,
} from "@/components/sections/service-panorama-rail";
import { blurProps } from "@/content/blur";
import type { Service } from "@/content/services";

/**
 * Server shell for the services index panorama: resolves each division
 * photo's blur-up here so the client rail never imports the server-only blur
 * map — the compare-gallery pattern.
 */
export function ServicePanorama({ services }: { services: Service[] }) {
  const items: PanoramaItem[] = services.map((service) => ({
    service,
    blur: blurProps(service.image.src),
  }));

  return <ServicePanoramaRail items={items} />;
}
