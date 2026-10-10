import {
  House,
  Building2,
  DraftingCompass,
  Hammer,
  ClipboardCheck,
  HardHat,
} from "lucide-react";

import { services } from "@/data/portfolio";

const serviceIcons = {
  House,
  Building2,
  DraftingCompass,
  Hammer,
  ClipboardCheck,
  HardHat,
};

export default function Services() {
  return (
    <section
      id="services"
      className="bg-slate-100 px-8 py-24 text-brand-text md:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent-text">
            What We Do
          </p>

          <h2 className="mb-5 text-4xl font-bold md:text-5xl">Our Services</h2>

          <p className="leading-8 text-slate-600">
            We offer comprehensive construction and engineering solutions
            tailored to meet the needs of every project.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon =
              serviceIcons[service.icon as keyof typeof serviceIcons];

            return (
              <div
                key={service.id}
                className="group rounded-lg border border-slate-200 bg-brand-background p-8 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-lg bg-brand-accent/15 text-brand-accent-text">
                  <Icon size={28} />
                </div>

                <h3 className="mb-4 text-xl font-bold">{service.title}</h3>

                <p className="leading-7 text-slate-600">
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
