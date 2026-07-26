import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";

type ProjectGalleryProps = {
  images: { src: string; alt: string }[];
};

/**
 * Adapted from @shadcnblocks/gallery34: kept only the photo-grid idea. Its
 * hover blur/scale layer, metadata chips and heart badge sell a portfolio
 * card, not a room — at this simplicity they added nothing, so the whole
 * framer-motion dependency was dropped and this stays a server component.
 * The first image takes the full row when the count is odd, so a set of
 * three reads as one wide shot plus a pair.
 */
export function ProjectGallery({ images }: ProjectGalleryProps) {
  const oddCount = images.length % 2 === 1;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {images.map((image, i) => {
        const fullWidth = oddCount && i === 0;

        return (
          <Reveal
            key={i}
            className={fullWidth ? "lg:col-span-2" : undefined}
          >
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-secondary">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={
                  fullWidth ? "100vw" : "(min-width: 1024px) 50vw, 100vw"
                }
                className="object-cover"
              />
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
