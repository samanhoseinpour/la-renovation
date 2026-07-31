import { ArrowLink } from "@/components/layout/arrow-link";
import { Reveal } from "@/components/motion/reveal";
import type { Faq } from "@/content/faq";
import type { SectionIntro } from "@/content/home";

/**
 * Adapted from @shadcnblocks/faq15: kept the open Q&A grid with no
 * accordions; dropped the icons and centered title for the house intro
 * column, and the answers render in full — same no-truncation stance as
 * FaqList, in a compact two-column treatment FaqList doesn't use.
 */
export function FaqTeaser({
  intro,
  faqs,
}: {
  intro: SectionIntro;
  faqs: Faq[];
}) {
  return (
    <div className="grid gap-14 lg:grid-cols-3 lg:gap-20">
      <Reveal>
        <h2 className="text-eyebrow text-muted-foreground">{intro.eyebrow}</h2>
        <p className="mt-6 max-w-xs text-h2 text-balance">{intro.heading}</p>
        {intro.link && (
          <div className="mt-8">
            <ArrowLink href={intro.link.href}>{intro.link.label}</ArrowLink>
          </div>
        )}
      </Reveal>

      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:col-span-2">
        {faqs.map((faq, index) => (
          <Reveal key={faq.question} delay={Math.min(index * 0.05, 0.2)}>
            <div className="border-t border-border pt-6">
              <h3 className="text-base font-medium text-balance">{faq.question}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
