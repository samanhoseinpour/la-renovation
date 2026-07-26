import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

type PageHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
};

/** Shared intro block. Every top-level page opens with one. */
export function PageHeader({ eyebrow, title, lead }: PageHeaderProps) {
  return (
    <Section size="sm" className="border-b border-border">
      <Container>
        <p className="text-eyebrow text-muted-foreground">{eyebrow}</p>
        <h1 className="mt-6 max-w-4xl text-display-2 text-balance">
          {title}
        </h1>
        {lead && (
          <p className="mt-8 max-w-xl text-lead text-muted-foreground">{lead}</p>
        )}
      </Container>
    </Section>
  );
}
