import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow,translate,opacity] duration-200 ease-editorial outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px active:shadow-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      // Hover shifts on solid variants are opaque color-mixes, never opacity
      // modifiers: a /80-style fade composites toward the page background,
      // which lightens the pill and (on brand, 4.70:1) drops below AA.
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_12%)] hover:shadow-sm",
        outline:
          "border-border bg-background shadow-xs hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
        brand:
          "bg-brand text-brand-foreground shadow-xs hover:bg-[color-mix(in_oklch,var(--brand),black_8%)] hover:shadow-sm aria-expanded:bg-[color-mix(in_oklch,var(--brand),black_8%)]",
      },
      size: {
        // Pill geometry: fully round ends need more horizontal padding than
        // base-nova's rounded rects. Inside a button-group the pill flattens
        // back to rounded-lg so segments can join.
        // pointer-coarse lifts every shipped size to a >=44px touch target
        // (WCAG 2.5.5) while desktop density stays as designed.
        default:
          "h-8 gap-1.5 px-3.5 pointer-coarse:h-11 pointer-coarse:px-5 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 px-2.5 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-3 text-[0.8rem] pointer-coarse:h-11 pointer-coarse:px-4 in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-4 pointer-coarse:h-11 pointer-coarse:px-5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        // Editorial CTA scale. base-nova's stock sizes top out at h-9, which
        // reads correctly in dense UI and far too small under a 96px display
        // heading. `xl` is the hero/primary-action size.
        xl: "h-12 gap-2 px-7 text-base has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-8 pointer-coarse:size-11",
        "icon-xs":
          "size-6 in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 pointer-coarse:size-11 in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9 pointer-coarse:size-11",
        "icon-xl": "size-12 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
