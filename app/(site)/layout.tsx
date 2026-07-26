import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getNavPanels } from "@/content/nav";

// Nothing here reads a dynamic API, so every route under this layout prerenders
// at build time — including the footer's `new Date().getFullYear()`, which would
// otherwise stay on the build year until the next deploy. A day is plenty for
// copy that changes once a year.
export const revalidate = 86400;

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Marketing pages only — /styleguide keeps native scroll on purpose. */}
      <SmoothScroll />
      <SiteHeader panels={getNavPanels()} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
