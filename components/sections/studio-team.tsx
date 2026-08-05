import { UserRound } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { blurProps } from "@/content/blur";
import type { TeamMember } from "@/content/team";

type StudioTeamProps = {
  id?: string;
  members: TeamMember[];
};

/**
 * Adapted from @shadcnblocks/team6: kept the eyebrow-plus-heading intro over
 * a four-across card grid; swapped its circular avatars for full-bleed 3:4
 * next/image frames, dropped the department badges and the "Explore
 * Careers" band (returned later as careers-band.tsx), and replaced its
 * gradient surface and py-24/container shell with Section/Container and
 * semantic tokens.
 */
export function StudioTeam({ id, members }: StudioTeamProps) {
  return (
    // scroll-mt-16 clears the h-16 sticky header on anchor navigation — same
    // 64px as the Lenis `anchors: { offset: -64 }` and the header's
    // IntersectionObserver rootMargin (components/motion/smooth-scroll.tsx,
    // components/site/site-header.tsx).
    <Section id={id} size="default" className="scroll-mt-16">
      <Container>
        <h2 className="text-eyebrow text-muted-foreground">Team</h2>

        <div className="mt-14 grid gap-x-6 gap-y-12 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
          {members.map((member, index) => (
            <Reveal key={member.name} delay={Math.min(index * 0.05, 0.2)}>
              <div>
                <div className="relative flex aspect-3/4 items-center justify-center overflow-hidden rounded-2xl bg-secondary">
                  {member.photo ? (
                    <Image
                      src={member.photo.src}
                      alt={member.photo.alt}
                      {...blurProps(member.photo.src)}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    // Decorative stand-in until a portrait lands; the name
                    // below is the card's accessible label.
                    <UserRound
                      aria-hidden
                      strokeWidth={1.25}
                      className="size-20 text-muted-foreground/50"
                    />
                  )}
                </div>
                <h3 className="mt-4 text-h4">{member.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {member.role}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
