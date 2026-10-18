import { ArrowUpRight, PhoneCall, MoveUpRight } from "lucide-react";
import type { CTAContent } from "@/types/sectionContent";

type CTAProps = {
  content: CTAContent;
};

export default function CTA({ content }: CTAProps) {
  return (
    <section
      id="cta"
      className="bg-brand-accent px-8 py-20 text-brand-on-accent md:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-current/25">
                <MoveUpRight size={20} />
              </span>

              <span className="text-sm font-bold uppercase tracking-widest">
                {content.label}
              </span>
            </div>

            <h2 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
              {content.title}
            </h2>

            <p className="max-w-2xl text-lg leading-8 opacity-80">
              {content.description}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-4">
            <a
              href={content.primaryButtonLink}
              className="inline-flex items-center gap-3 rounded-lg bg-brand-primary px-7 py-4 font-bold text-brand-on-primary transition hover:opacity-90"
            >
              {content.primaryButtonText}
              <ArrowUpRight size={20} />
            </a>

            <a
              href={content.secondaryButtonLink}
              className="inline-flex items-center gap-3 rounded-lg border-2 border-current px-7 py-4 font-bold transition hover:bg-black/10"
            >
              <PhoneCall size={19} />
              {content.secondaryButtonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
