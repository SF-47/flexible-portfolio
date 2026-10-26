import { ClipboardList } from "lucide-react";
import { IconByName } from "@/lib/ui/icons";
import type { ProcessContent } from "@/types/sectionContent";
import Reveal from "@/components/portfolio/Reveal";

type ProcessProps = {
  content: ProcessContent;
};

export default function Process({ content }: ProcessProps) {
  return (
    <section
      id="process"
      className="bg-brand-primary px-8 py-16 md:py-24 text-brand-on-primary md:px-20"
    >
      <Reveal className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent">
            {content.label}
          </p>

          <h2 className="mb-5 text-4xl font-bold md:text-5xl">{content.title}</h2>

          <p className="leading-8 opacity-75">
            {content.description}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.steps.map((step, index) => {

            return (
              <div
                key={index}
                className="relative rounded-lg border border-current/15 p-8 transition duration-300 hover:border-brand-accent"
              >
                <span className="absolute right-6 top-5 text-5xl font-black opacity-25">
                  {step.number}
                </span>

                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-lg bg-brand-accent text-brand-on-accent">
                  <IconByName icon={step.icon} fallback={ClipboardList} size={26} />
                </div>

                <p className="mb-3 text-sm font-bold tracking-widest text-brand-accent">
                  STEP {step.number}
                </p>

                <h3 className="mb-4 text-xl font-bold">{step.title}</h3>

                <p className="leading-7 opacity-75">{step.description}</p>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
