import {
  ShieldCheck,
  Award,
  Clock3,
  Users,
  BadgeCheck,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import type { WhyChooseUsContent } from "@/types/sectionContent";
import Reveal from "@/components/portfolio/Reveal";

const icons: Record<string, LucideIcon> = {
  ShieldCheck,
  Award,
  Clock3,
  Users,
  BadgeCheck,
  Lightbulb,
};

type WhyChooseUsProps = {
  content: WhyChooseUsContent;
};

export default function WhyChooseUs({ content }: WhyChooseUsProps) {
  return (
    <section
      id="why-choose-us"
      className="bg-brand-primary px-8 py-16 md:py-24 text-brand-on-primary md:px-20"
    >
      <Reveal className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent">
            {content.label}
          </p>

          <h2 className="mb-5 text-4xl font-bold md:text-5xl">{content.title}</h2>

          <p className="leading-8 opacity-75">
            {content.description}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.items.map((advantage) => {
            const Icon = icons[advantage.icon] ?? BadgeCheck;

            return (
              <div
                key={advantage.title}
                className="group rounded-lg border border-current/15 p-8 transition duration-300 hover:-translate-y-2 hover:border-brand-accent"
              >
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-lg bg-brand-accent text-brand-on-accent">
                  <Icon size={27} />
                </div>

                <h3 className="mb-4 text-xl font-bold">{advantage.title}</h3>

                <p className="leading-7 opacity-75">{advantage.description}</p>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
