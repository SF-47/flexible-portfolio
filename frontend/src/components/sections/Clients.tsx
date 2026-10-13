
import {
  Building2,
  Landmark,
  Factory,
  Hotel,
  Warehouse,
  BriefcaseBusiness,
} from "lucide-react";

const clients = [
  { name: "Urban Development", icon: Building2 },
  { name: "Capital Group", icon: Landmark },
  { name: "Industrial Solutions", icon: Factory },
  { name: "Grand Hospitality", icon: Hotel },
  { name: "Logistics Partners", icon: Warehouse },
  { name: "Business Alliance", icon: BriefcaseBusiness },
];

export default function Clients() {
  return (
    <section
      id="clients"
      className="bg-brand-background px-8 py-24 text-brand-text md:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent-text">
            Our Network
          </p>

          <h2 className="mb-5 text-4xl font-bold md:text-5xl">
            Clients & Partners
          </h2>

          <p className="mx-auto max-w-2xl leading-8 text-brand-muted">
            We value the relationships we build with organizations that
            share our commitment to quality and excellence.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
          {clients.map((client) => {
            const Icon = client.icon;

            return (
              <div
                key={client.name}
                className="group flex min-h-44 flex-col items-center justify-center gap-5 rounded-lg border border-brand-border bg-brand-surface p-6 text-center transition duration-300 hover:border-brand-accent hover:bg-brand-background hover:shadow-lg"
              >
                <Icon
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
      </div>
    </section>
  );
}
