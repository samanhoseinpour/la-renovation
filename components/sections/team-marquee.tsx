import {
  TeamMarqueeRail,
  type MarqueeMember,
} from "@/components/sections/team-marquee-rail";
import { blurProps } from "@/content/blur";
import type { SectionIntro } from "@/content/home";
import type { TeamMember } from "@/content/team";

/**
 * Server shell for the roster filmstrip: pairs each member with the resolved
 * blur-up for their portrait so the client rail never imports the server-only
 * blur map — the compare-gallery pattern.
 */
export function TeamMarquee({
  intro,
  members,
}: {
  intro: SectionIntro;
  members: TeamMember[];
}) {
  const rail: MarqueeMember[] = members.map((member) => ({
    ...member,
    photoBlur: member.photo ? blurProps(member.photo.src) : {},
  }));

  return <TeamMarqueeRail intro={intro} members={rail} />;
}
