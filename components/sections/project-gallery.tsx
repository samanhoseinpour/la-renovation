import { GalleryLightbox } from "@/components/sections/gallery-lightbox";
import { blurProps } from "@/content/blur";

type ProjectGalleryProps = {
  images: { src: string; alt: string }[];
};

/**
 * Server shell for the project photo grid. The grid itself moved into the
 * GalleryLightbox client leaf when every photo became a full-screen viewer
 * trigger; keeping this section means pages still import a server component
 * and the client boundary stays at the leaf — the compare-gallery pattern.
 * Blur-ups resolve here so the leaf never touches the server-only map.
 */
export function ProjectGallery({ images }: ProjectGalleryProps) {
  return (
    <GalleryLightbox
      images={images.map((image) => ({ ...image, blur: blurProps(image.src) }))}
    />
  );
}
