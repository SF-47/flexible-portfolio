import { BadgeCheck } from "lucide-react";
import { IconByName } from "@/lib/ui/icons";
import type { CertificationsContent } from "@/types/sectionContent";
import Reveal from "@/components/portfolio/Reveal";

type CertificationsProps = {
  content: CertificationsContent;
};

export default function Certifications({ content }: CertificationsProps) {
  return (
    <section
      id="certifications"
      className="bg-brand-background px-8 py-16 md:py-24 text-brand-text md:px-20"
    >
      <Reveal className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent-text">
            {content.label}
          </p>

          <h2 className="mb-5 text-4xl font-bold md:text-5xl">
            {content.title}
          </h2>

          <p className="leading-8 text-brand-muted">
            {content.description}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.items.map((certification, index) => {

            return (
              <div
                key={index}
                className="group rounded-lg border border-brand-border bg-brand-surface p-8 transition duration-300 hover:-translate-y-2 hover:border-brand-accent hover:shadow-lg"
              >
                <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-brand-accent/30 bg-brand-accent/10 text-brand-accent-text">
                  <IconByName icon={certification.icon} fallback={BadgeCheck} size={30} strokeWidth={1.5} />
                </div>

                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-accent-text">
                  {certification.subtitle}
                </p>

                <h3 className="mb-4 text-xl font-bold">
                  {certification.title}
                </h3>

                <p className="leading-7 text-brand-muted">
                  {certification.description}
                </p>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
