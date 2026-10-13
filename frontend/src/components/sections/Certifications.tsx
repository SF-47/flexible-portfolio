import {
  Award,
  ShieldCheck,
  Medal,
  BadgeCheck,
  FileCheck2,
  Trophy,
} from "lucide-react";

const certifications = [
  {
    id: 1,
    title: "Quality Management",
    subtitle: "Quality Standards",
    description:
      "A strong focus on consistent processes and quality across all projects.",
    icon: BadgeCheck,
  },
  {
    id: 2,
    title: "Safety Excellence",
    subtitle: "Workplace Safety",
    description:
      "Commitment to safe working environments and responsible practices.",
    icon: ShieldCheck,
  },
  {
    id: 3,
    title: "Engineering Expertise",
    subtitle: "Professional Standards",
    description: "Technical knowledge and professional engineering practices.",
    icon: Award,
  },
  {
    id: 4,
    title: "Project Excellence",
    subtitle: "Industry Recognition",
    description:
      "Dedication to delivering successful and high-quality projects.",
    icon: Trophy,
  },
  {
    id: 5,
    title: "Reliable Execution",
    subtitle: "Operational Excellence",
    description: "Structured project management and disciplined delivery.",
    icon: Medal,
  },
  {
    id: 6,
    title: "Quality Assurance",
    subtitle: "Project Verification",
    description: "Thorough reviews and inspections throughout construction.",
    icon: FileCheck2,
  },
];

export default function Certifications() {
  return (
    <section
      id="certifications"
      className="bg-brand-background px-8 py-24 text-brand-text md:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent-text">
            Our Standards
          </p>

          <h2 className="mb-5 text-4xl font-bold md:text-5xl">
            Certifications & Recognition
          </h2>

          <p className="leading-8 text-brand-muted">
            We believe in maintaining high professional standards, responsible
            practices, and continuous improvement.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((certification) => {
            const Icon = certification.icon;

            return (
              <div
                key={certification.id}
                className="group rounded-lg border border-brand-border bg-brand-surface p-8 transition duration-300 hover:-translate-y-2 hover:border-brand-accent hover:shadow-lg"
              >
                <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-brand-accent/30 bg-brand-accent/10 text-brand-accent-text">
                  <Icon size={30} strokeWidth={1.5} />
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
      </div>
    </section>
  );
}
