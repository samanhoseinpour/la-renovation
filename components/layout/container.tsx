import type { ComponentProps, ElementType } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = ComponentProps<"div"> & {
  /** Render as a different element (e.g. `header`, `nav`, `footer`). */
  as?: ElementType;
  /** Narrow measure for long-form prose. */
  width?: "default" | "prose" | "full";
};

/**
 * Owns the page shell: max width and horizontal gutters. This is the only
 * place gutters are defined; pages must never hand-write `px-4 md:px-8`,
 * or the site drifts out of alignment one section at a time.
 */
export function Container({
  as: Comp = "div",
  width = "default",
  className,
  ...props
}: ContainerProps) {
  return (
    <Comp
      className={cn(
        "mx-auto w-full px-gutter",
        width === "default" && "max-w-shell",
        width === "prose" && "max-w-[68ch]",
        className,
      )}
      {...props}
    />
  );
}
