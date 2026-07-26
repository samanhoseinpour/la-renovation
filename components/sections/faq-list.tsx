import { Reveal } from "@/components/motion/reveal";
import type { Faq } from "@/content/studio";

/**
 * Adapted from @shadcnblocks/faq5: kept the numbered-list treatment (no
 * accordion — every answer stays readable and findable), dropped its centered
 * badge header and narrow column for full-width hairline rows: index and
 * question left, answer right on large screens.
 */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div>
      {faqs.map((faq, index) => (
        <Reveal key={faq.question} delay={Math.min(index * 0.05, 0.2)}>
          <div className="grid gap-4 border-t border-border py-8 lg:grid-cols-12 lg:gap-8 lg:py-10">
            <div className="flex gap-6 lg:col-span-6">
              <span className="text-eyebrow pt-1.5 text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-h3 text-balance">{faq.question}</h3>
            </div>
            <p className="max-w-xl text-muted-foreground lg:col-span-5 lg:col-start-8">
              {faq.answer}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
