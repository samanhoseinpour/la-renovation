import { cn } from "@/lib/utils";

/**
 * Adapted from @shadcnblocks/testimonial10: kept the single oversized centered
 * quote on whitespace; dropped the avatar and author row and the quotation
 * marks (these are house statements, not testimonials, so a plain paragraph
 * rather than a blockquote); swapped its fixed sizes for the house type scale
 * inside a page-owned Section/Container shell.
 */
export function StatementBand({
  eyebrow,
  statement,
}: {
  eyebrow?: string;
  statement: string;
}) {
  return (
    <div className="text-center">
      {eyebrow && (
        <h2 className="text-eyebrow text-muted-foreground">{eyebrow}</h2>
      )}
      <p
        className={cn(
          "mx-auto max-w-4xl text-h2 text-balance",
          eyebrow && "mt-10",
        )}
      >
        {statement}
      </p>
    </div>
  );
}
