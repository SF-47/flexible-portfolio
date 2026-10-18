import {
  House,
  Building2,
  DraftingCompass,
  Hammer,
  ClipboardCheck,
  HardHat,
  type LucideIcon,
} from "lucide-react";

import type { ServicesContent } from "@/types/sectionContent";

const serviceIcons: Record<string, LucideIcon> = {
  House,
  Building2,
  DraftingCompass,
  Hammer,
  ClipboardCheck,
  HardHat,
};

// Mirrors CompanyServiceResponse; supplied by the Company Services API.
type CompanyService = {
  id: number;
  title: string;
  description: string;
  iconName: string | null;
  imageMediaId: number | null;
  sortOrder: number;
};

type ServicesProps = {
  content: ServicesContent;
  services: CompanyService[];
};

export default function Services({ content, services }: ServicesProps) {
  return (
    <section
      id="services"
      className="bg-brand-surface px-8 py-24 text-brand-text md:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent-text">
            {content.label}
          </p>

          <h2 className="mb-5 text-4xl font-bold md:text-5xl">{content.title}</h2>

          <p className="leading-8 text-brand-muted">
            {content.description}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon =
              (service.iconName ? serviceIcons[service.iconName] : undefined) ??
              HardHat;

            return (
              <div
                key={service.id}
                className="group rounded-lg border border-brand-border bg-brand-background p-8 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-lg bg-brand-accent/15 text-brand-accent-text">
                  <Icon size={28} />
                </div>

                <h3 className="mb-4 text-xl font-bold">{service.title}</h3>

                <p className="leading-7 text-brand-muted">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
