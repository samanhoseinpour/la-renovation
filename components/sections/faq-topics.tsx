import { FaqList } from "@/components/sections/faq-list";
import type { FaqTopic } from "@/content/faq";

/**
 * Adapted from @shadcnblocks/faq12: kept the sticky topic rail beside the
 * grouped question list; dropped the IntersectionObserver scroll-spy (the rail
 * is plain #anchors — Lenis already owns smooth scroll and the anchor offset),
 * the accordions (answers stay open, same reasoning as FaqList) and the card
 * surfaces with their hardcoded panel colors. Each group delegates to FaqList,
 * so the hairline rows, per-topic numbering and Reveal stagger live in one
 * place. The rail is a plain list rather than a second <nav> landmark: naming
 * one would mean inventing copy here, and the group headings already carry the
 * structure for assistive tech.
 *
 * The rail is gated at xl rather than the block's md. FaqList turns on its
 * question/answer split at lg, and a 200px track beside it squeezes the answer
 * column to roughly 33 characters through the 1024-1280 band; below xl the
 * topics stack full-width and read exactly as they do on /services.
 */
export function FaqTopics({ topics }: { topics: FaqTopic[] }) {
  return (
    <div className="grid gap-10 xl:grid-cols-[200px_1fr] xl:gap-12">
      {/* top-24 parks the rail clear of the h-16 header; the group headings
          take scroll-mt-16 for the same 64px as the Lenis `anchors:
          { offset: -64 }` and the header's IntersectionObserver rootMargin
          (components/motion/smooth-scroll.tsx, components/site/site-header.tsx). */}
      {/* role="list": the list-style reset strips list semantics in VoiceOver */}
      <ul
        role="list"
        className="sticky top-24 hidden h-fit flex-col gap-4 xl:flex"
      >
        {topics.map((topic) => (
          <li key={topic.key}>
            <a
              href={`#${topic.key}`}
              className="block rounded-sm py-1 text-eyebrow text-muted-foreground outline-none transition-colors duration-200 ease-editorial hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {topic.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="space-y-16">
        {topics.map((topic) => (
          <section key={topic.key} aria-labelledby={topic.key}>
            <h2
              id={topic.key}
              className="scroll-mt-16 text-eyebrow text-muted-foreground"
            >
              {topic.label}
            </h2>
            <div className="mt-6">
              <FaqList faqs={topic.faqs} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
