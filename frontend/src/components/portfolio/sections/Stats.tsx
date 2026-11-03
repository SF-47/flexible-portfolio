import type { StatsContent } from "@/types/sectionContent";
import Reveal from "@/components/portfolio/Reveal";

type StatsProps = {
  content: StatsContent;
};

export default function Stats({ content }: StatsProps) {
  return (
    <section
      id="stats"
      className="bg-brand-accent px-8 py-16 text-brand-on-accent md:px-20"
    >
      {/* Wrapping flex row: 2 per row on small screens, 4 from lg. A last row with
          fewer items is centered, and any number of statistics reflows by itself. */}
      <Reveal className="mx-auto flex max-w-7xl flex-wrap justify-center gap-10">
        {content.items.map((stat, index) => (
          <div
            key={index}
            className="w-[calc(50%-1.25rem)] text-center lg:w-[calc(25%-1.875rem)]"
          >
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
