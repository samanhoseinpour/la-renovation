"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ChevronLeft, ChevronRight, XIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import type { SiteImage } from "@/content/images";
import { cn } from "@/lib/utils";

type GalleryLightboxProps = {
  images: SiteImage[];
};

/**
 * Photo grid plus full-screen viewer in one client component — the pair
 * shares the active index, which is exactly the state the compare pair's
 * stateless leaves never needed. The grid carries over from the server-era
 * ProjectGallery (@shadcnblocks/gallery34 ancestry): the first image takes
 * the full row when the count is odd, so a set of three reads as one wide
 * shot plus a pair.
 *
 * The viewer is built straight on Base UI's Dialog, like the sheet: modal
 * by default, so the focus trap and document scroll lock come free, and
 * data-lenis-prevent keeps Lenis off the open surface. The entrance is
 * opacity-only, so the global reduced-motion clamp already makes it
 * instant. While open, every slide stays mounted and stacked invisibly —
 * visibility, not display, so next/image fetches them all and arrow
 * navigation swaps with nothing left to load. `active` survives close so
 * the exit fade never flashes back to the first slide.
 */
export function GalleryLightbox({ images }: GalleryLightboxProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const triggerRef = useRef<HTMLElement | null>(null);
  const count = images.length;
  const many = count > 1;
  const oddCount = count % 2 === 1;

  const step = (dir: 1 | -1) =>
    setActive((i) => (i + dir + count) % count);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {images.map((image, i) => {
          const fullWidth = oddCount && i === 0;

          return (
            <Reveal key={i} className={fullWidth ? "lg:col-span-2" : undefined}>
              <button
                type="button"
                // The accessible name comes from the image alt inside; the
                // cursor is the only visual hint the grid is now interactive.
                className="relative block aspect-4/3 w-full cursor-zoom-in overflow-hidden rounded-2xl bg-secondary outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                onClick={(event) => {
                  triggerRef.current = event.currentTarget;
                  setActive(i);
                  setOpen(true);
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={
                    fullWidth ? "100vw" : "(min-width: 1024px) 50vw, 100vw"
                  }
                  className="object-cover"
                />
              </button>
            </Reveal>
          );
        })}
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-background/95 transition-opacity duration-[250ms] ease-editorial data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-sm" />
          <Dialog.Popup
            // Focus returns to the exact thumbnail that opened the viewer.
            finalFocus={triggerRef}
            // Keep Lenis from hijacking wheel/touch on the open viewer.
            data-lenis-prevent=""
            onKeyDown={(event) => {
              if (!many) return;
              if (event.key === "ArrowRight") step(1);
              if (event.key === "ArrowLeft") step(-1);
            }}
            className="fixed inset-0 z-50 flex flex-col gap-4 p-4 transition-opacity duration-[250ms] ease-editorial data-ending-style:opacity-0 data-starting-style:opacity-0 md:p-6"
          >
            <Dialog.Title className="sr-only">
              {images[active].alt}
            </Dialog.Title>

            <div className="flex justify-end">
              <Dialog.Close
                render={<Button variant="ghost" size="icon-lg" />}
              >
                <XIcon />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </div>

            <div className="relative min-h-0 flex-1">
              {images.map((image, i) => (
                <div
                  key={i}
                  className={cn("absolute inset-0", i !== active && "invisible")}
                  aria-hidden={i !== active || undefined}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="100vw"
                    quality={90}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                {many && (
                  <p className="text-eyebrow text-muted-foreground">
                    {active + 1} / {count}
                  </p>
                )}
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {images[active].alt}
                </p>
              </div>
              {many && (
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    aria-label="Previous image"
                    onClick={() => step(-1)}
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    aria-label="Next image"
                    onClick={() => step(1)}
                  >
                    <ChevronRight />
                  </Button>
                </div>
              )}
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
