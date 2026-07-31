import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Rethemed from the stock base-nova navigation menu for the full-bleed mega
 * menu: eyebrow triggers without a chevron, a hairline edge-to-edge popup
 * instead of the floating card, and granular part exports (sheet.tsx style) so
 * the site composition controls the Portal/Backdrop/Positioner assembly.
 */
function NavigationMenu({
  className,
  ...props
}: NavigationMenuPrimitive.Root.Props) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn("relative flex max-w-max items-center", className)}
      {...props}
    />
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn("flex list-none items-center", className)}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative flex", className)}
      {...props}
    />
  )
}

// Shared by triggers and the plain links beside them (About, Contact) so the
// whole row keeps the eyebrow voice of the retired SiteNav.
const navigationMenuTriggerStyle = cva(
  "text-eyebrow inline-flex select-none items-center rounded-sm text-muted-foreground transition-colors duration-200 ease-editorial outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:text-foreground"
)

function NavigationMenuTrigger({
  className,
  ...props
}: NavigationMenuPrimitive.Trigger.Props) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    />
  )
}

function NavigationMenuContent({
  className,
  ...props
}: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "h-full transition-[opacity,translate] duration-[350ms] ease-editorial data-starting-style:opacity-0 data-ending-style:opacity-0 data-starting-style:data-[activation-direction=left]:-translate-x-6 data-starting-style:data-[activation-direction=right]:translate-x-6 data-ending-style:data-[activation-direction=left]:translate-x-6 data-ending-style:data-[activation-direction=right]:-translate-x-6",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuPortal({ ...props }: NavigationMenuPrimitive.Portal.Props) {
  return <NavigationMenuPrimitive.Portal data-slot="navigation-menu-portal" {...props} />
}

function NavigationMenuBackdrop({
  className,
  ...props
}: NavigationMenuPrimitive.Backdrop.Props) {
  return (
    <NavigationMenuPrimitive.Backdrop
      data-slot="navigation-menu-backdrop"
      // Purely visual: dismissal is document-level in Base UI, so the scrim
      // never intercepts — the user can interact with the page through it.
      className={cn(
        "pointer-events-none fixed inset-0 z-30 bg-black/10 dark:bg-black/45 transition-opacity duration-[350ms] ease-editorial data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-150 supports-backdrop-filter:backdrop-blur-xs",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuPositioner({
  className,
  ...props
}: NavigationMenuPrimitive.Positioner.Props) {
  return (
    <NavigationMenuPrimitive.Positioner
      data-slot="navigation-menu-positioner"
      className={cn(
        "isolate z-40 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-[350ms] ease-editorial data-instant:transition-none",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuPopup({
  className,
  ...props
}: NavigationMenuPrimitive.Popup.Props) {
  return (
    <NavigationMenuPrimitive.Popup
      data-slot="navigation-menu-popup"
      // Guards short viewports; Lenis must not hijack the panel's own scroll.
      // scrollbar-none keeps that overflow path but suppresses the bar — the
      // page scrollbar is the only one on screen while the panel is open.
      data-lenis-prevent=""
      // bg-background (not popover): in dark mode the panel must read as an
      // extension of the header surface, separated by the hairline alone.
      className={cn(
        "relative h-(--popup-height) max-h-(--available-height) w-(--popup-width) overflow-y-auto scrollbar-none border-b border-border bg-background text-foreground transition-[opacity,translate,width,height] duration-[350ms] ease-editorial outline-none data-starting-style:-translate-y-2 data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-150 data-ending-style:ease-exit",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <NavigationMenuPrimitive.Viewport
      data-slot="navigation-menu-viewport"
      className={cn("relative size-full overflow-hidden", className)}
      {...props}
    />
  )
}

function NavigationMenuLink({
  className,
  ...props
}: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "rounded-sm transition-colors duration-200 ease-editorial outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  )
}

export {
  NavigationMenu,
  NavigationMenuBackdrop,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPopup,
  NavigationMenuPortal,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
}
