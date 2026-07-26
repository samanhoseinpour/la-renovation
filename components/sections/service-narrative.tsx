import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import type { Service } from "@/content/services";
import { cn } from "@/lib/utils";

/**
 * Adapted from @shadcnblocks/feature62: kept the three alternating image/text
 * rows; swapped its hardcoded demo copy for the service's body paragraphs
 * (one row per paragraph, paired with rowImages), its <img> for next/image,
 * and its bordered rounded-md media for rounded-3xl panels on bg-secondary.
 */
export function ServiceNarrative({ service }: { service: Service }) {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {service.body.map((paragraph, index) => {
        const image = service.rowImages[index];
        const reversed = index % 2 === 1;

        return (
          <Reveal key={paragraph.slice(0, 32)}>
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-x-20">
              <div
                className={cn(
                  "relative aspect-4/3 overflow-hidden rounded-3xl bg-secondary",
                  reversed && "lg:order-2",
                )}
              >
                {image && (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className={cn(reversed && "lg:order-1")}>
                <p className="text-eyebrow text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-6 max-w-xl text-lead text-muted-foreground">
                  {paragraph}
                </p>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
