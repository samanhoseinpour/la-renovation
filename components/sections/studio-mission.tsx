import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";

type Statement = { title: string; body: string };

type StudioMissionProps = {
  id?: string;
  mission: Statement;
  vision: Statement;
};

/**
 * Adapted from @shadcnblocks/about18: kept the narrow-label-beside-oversized-
 * statement grid and the rhythm between two stacked statements; dropped the
 * two stock photo bands and the fixed "Our mission"/"What drives us" copy in
 * favor of a mission/vision pair, and replaced the container/py-32 wrapper
 * and hardcoded foreground/40 opacity text with Section/Container and
 * semantic tokens.
 */
export function StudioMission({ id, mission, vision }: StudioMissionProps) {
  return (
    // scroll-mt-16 clears the h-16 sticky header on anchor navigation — same
    // 64px as the Lenis `anchors: { offset: -64 }` and the header's
    // IntersectionObserver rootMargin (components/motion/smooth-scroll.tsx,
    // components/site/site-header.tsx).
    <Section id={id} size="default" className="scroll-mt-16">
      <Container>
        <Reveal>
          <div className="grid gap-6 border-t border-border pt-10 lg:grid-cols-7 lg:gap-12">
            <p className="text-eyebrow text-muted-foreground lg:col-span-2">
              Mission
            </p>
            <div className="max-w-2xl space-y-6 lg:col-span-4 lg:col-start-4">
              <h2 className="text-h2 text-balance">{mission.title}</h2>
              <p className="text-lead text-muted-foreground">
                {mission.body}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-20 grid gap-6 border-t border-border pt-10 lg:grid-cols-7 lg:gap-12">
            <p className="text-eyebrow text-muted-foreground lg:col-span-2">
              Vision
            </p>
            <div className="max-w-2xl space-y-6 lg:col-span-4 lg:col-start-4">
              <h2 className="text-h2 text-balance">{vision.title}</h2>
              <p className="text-lead text-muted-foreground">{vision.body}</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
