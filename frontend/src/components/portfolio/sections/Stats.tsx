import type { StatsContent } from "@/types/sectionContent";
import Reveal from "@/components/portfolio/Reveal";

type StatsProps = {
  content: StatsContent;
};

export default function Stats({ content }: StatsProps) {
  return (
    <section className="bg-brand-accent px-8 py-16 text-brand-on-accent md:px-20">
      <Reveal className="mx-auto grid max-w-7xl grid-cols-2 gap-10 lg:grid-cols-4">
        {content.items.map((stat) => (
          <div key={stat.label} className="text-center">
            <h3 className="text-4xl font-bold md:text-5xl">{stat.value}</h3>

            <p className="mt-3 text-sm font-medium md:text-base">
              {stat.label}
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
