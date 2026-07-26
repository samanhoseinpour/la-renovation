import type { ComponentProps, ElementType } from "react";

import { cn } from "@/lib/utils";

type SectionProps = ComponentProps<"section"> & {
  as?: ElementType;
  /** Vertical rhythm. Maps to the fluid --spacing-section-* steps. */
  size?: "sm" | "default" | "lg" | "none";
  /** Background treatment. `inverted` flips fg/bg and works in both themes. */
  surface?: "default" | "muted" | "card" | "inverted";
};

/**
 * Owns vertical rhythm. Pages compose Sections rather than picking their own
 * `py-*` values, so the whole site breathes on one scale.
 */
export function Section({
  as: Comp = "section",
  size = "default",
  surface = "default",
  className,
  ...props
}: SectionProps) {
  return (
    <Comp
      className={cn(
        size === "sm" && "py-section-sm",
        size === "default" && "py-section",
        size === "lg" && "py-section-lg",
        surface === "muted" && "bg-muted",
        surface === "card" && "bg-card",
        surface === "inverted" && "bg-foreground text-background",
        className,
      )}
      {...props}
    />
  );
}
