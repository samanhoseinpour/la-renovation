import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { blurProps } from "@/content/images";
import type { DeliveryModelCopy } from "@/content/services";

/**
 * Adapted from @shadcnblocks/feature374: kept the narrow copy column with a
 * side-rail list beside tall imagery; dropped the diagonal photo mask and
 * numbered rail chrome for two plain definition rows, and the page supplies
 * the Section/Container shell and heading like its /services neighbors.
 */
export function DeliveryModel({ copy }: { copy: DeliveryModelCopy }) {
  return (
    <div className="grid gap-14 lg:grid-cols-2 lg:gap-x-20">
      <div>
        <p className="max-w-xl text-lead text-muted-foreground">{copy.lead}</p>
        <div className="mt-12">
          {copy.columns.map((column, index) => (
            <Reveal key={column.title} delay={Math.min(index * 0.05, 0.2)}>
              <div className="border-t border-border py-8">
                <h3 className="text-h3">{column.title}</h3>
                <p className="mt-3 max-w-xl text-muted-foreground">{column.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-secondary lg:self-start">
        <Image
          src={copy.image.src}
          alt={copy.image.alt}
          {...blurProps(copy.image.src)}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
