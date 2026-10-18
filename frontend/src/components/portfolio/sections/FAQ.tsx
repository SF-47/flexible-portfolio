import { CircleHelp, HelpCircle, Plus, type LucideIcon } from "lucide-react";
import type { FAQContent } from "@/types/sectionContent";

const icons: Record<string, LucideIcon> = {
  HelpCircle,
  CircleHelp,
};

type FAQProps = {
  content: FAQContent;
};

export default function FAQ({ content }: FAQProps) {
  const HelpIcon = icons[content.helpIcon] ?? HelpCircle;

  return (
    <section
      id="faq"
      className="bg-brand-background px-8 py-24 text-brand-text md:px-20"
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent-text">
            {content.label}
          </p>

          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            {content.title}
          </h2>

          <p className="mb-8 leading-8 text-brand-muted">
            {content.description}
          </p>

          <div className="flex items-center gap-4 rounded-lg bg-brand-surface p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-accent/15 text-brand-accent-text">
              <HelpIcon size={25} />
            </div>

            <div>
              <p className="font-bold">{content.helpTitle}</p>
              <a
                href={content.helpLinkUrl}
                className="text-sm font-semibold text-brand-accent-text hover:underline"
              >
                {content.helpLinkText} →
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {content.items.map((item) => (
            <details
              key={item.question}
              className="group rounded-lg border border-brand-border bg-brand-surface open:border-brand-accent"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 [&::-webkit-details-marker]:hidden">
                <h3 className="font-semibold">{item.question}</h3>

                <Plus
                  size={20}
                  className="shrink-0 text-brand-accent-text transition group-open:rotate-45"
                />
              </summary>

              <p className="border-t border-brand-border px-6 pb-6 pt-4 leading-7 text-brand-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
