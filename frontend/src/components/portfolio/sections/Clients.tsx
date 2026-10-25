import { Building2 } from "lucide-react";
import { IconByName } from "@/lib/icons";
import type { ClientsContent } from "@/types/sectionContent";
import Reveal from "@/components/portfolio/Reveal";

type ClientsProps = {
  content: ClientsContent;
};

export default function Clients({ content }: ClientsProps) {
  return (
    <section
      id="clients"
      className="bg-brand-background px-8 py-16 md:py-24 text-brand-text md:px-20"
    >
      <Reveal className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent-text">
            {content.label}
          </p>

          <h2 className="mb-5 text-4xl font-bold md:text-5xl">
            {content.title}
          </h2>

          <p className="mx-auto max-w-2xl leading-8 text-brand-muted">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
          {content.items.map((client, index) => {
            return (
              <div
                key={index}
                className="group flex min-h-44 flex-col items-center justify-center gap-5 rounded-lg border border-brand-border bg-brand-surface p-6 text-center transition duration-300 hover:border-brand-accent hover:bg-brand-background hover:shadow-lg"
              >
                <IconByName
                  icon={client.icon}
                  fallback={Building2}
                  size={42}
                  strokeWidth={1.5}
                  className="text-brand-muted transition group-hover:text-brand-accent-text"
                />

                <h3 className="text-sm font-bold tracking-wide text-brand-muted md:text-base">
                  {client.name}
                </h3>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
