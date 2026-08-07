import { ArrowLink } from "@/components/layout/arrow-link";
import { TeamMarqueeLazy } from "@/components/sections/team-marquee-lazy";
import type { MarqueeMember } from "@/components/sections/team-marquee-rail";
import { blurProps } from "@/content/blur";
import type { SectionIntro } from "@/content/home";
import type { TeamMember } from "@/content/team";

/**
 * Server shell for the roster filmstrip. The intro and the sr-only roster
 * list render here so the section heading and every member name stay in
 * server HTML; the moving rail — react-fast-marquee and its measuring —
 * splits into its own chunk behind the lazy client wrapper and hydrates
 * after the rest of the page. Blur-ups resolve here so the client rail never
 * imports the server-only blur map (the compare-gallery pattern).
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

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <h2 className="text-eyebrow text-muted-foreground">{intro.eyebrow}</h2>
          <p className="mt-6 max-w-2xl text-h2 text-balance">{intro.heading}</p>
        </div>
        {intro.link && (
          <ArrowLink href={intro.link.href}>{intro.link.label}</ArrowLink>
        )}
      </div>

      {/* The moving rail is aria-hidden (autoFill clones cards), so this
          visually hidden list is what carries the roster. */}
      <ul role="list" className="sr-only">
        {members.map((member) => (
          <li key={member.name}>
            {member.name}, {member.role}
          </li>
        ))}
      </ul>

      <TeamMarqueeLazy members={rail} />
    </div>
  );
}
