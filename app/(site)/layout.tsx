import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { BackToTop } from "@/components/site/back-to-top";
import { ScrollProgress } from "@/components/site/scroll-progress";
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
      <ScrollProgress />
      <SiteHeader panels={getNavPanels()} />
      {/* id + tabIndex make main the back-to-top focus target; scroll-mt-16
          keeps the 64px header contract on native-scroll paths; plain
          outline-none so the programmatic focus never rings the whole page. */}
      <main id="main" tabIndex={-1} className="flex-1 scroll-mt-16 outline-none">
        {children}
      </main>
      <SiteFooter />
      <BackToTop />
    </>
  );
}
