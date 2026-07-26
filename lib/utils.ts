import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Register the custom type scale (globals.css @theme sizes + the text-eyebrow
// utility) as font-size classes. Without this, tailwind-merge files unknown
// text-* utilities under text color, and any later color class in the same
// cn() call silently deletes the size.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display-1", "display-2", "h1", "h2", "h3", "lead", "eyebrow"] },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
