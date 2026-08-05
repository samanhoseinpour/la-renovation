import "server-only";

import { blurMap } from "./blur-map.generated";
import type { BlurProps } from "./images";

/**
 * Blur-up props for any manifest src, local path or Unsplash URL. Spread onto
 * a next/image; sources missing from the generated map degrade to no
 * placeholder. Server-only on purpose: importing the generated map from a
 * client component would compile every data URI into the shared client
 * bundle, while server rendering already inlines each image's own entry into
 * the HTML. Client components receive resolved BlurProps through their server
 * shells instead. Regenerate the map with `npm run images:placeholders`.
 */
export function blurProps(src: string): BlurProps {
  const key = src.startsWith("/")
    ? src
    : /images\.unsplash\.com\/(photo-[A-Za-z0-9_-]+)/.exec(src)?.[1];
  const blurDataURL = key ? blurMap[key] : undefined;
  return blurDataURL ? { placeholder: "blur", blurDataURL } : {};
}
