import {
  MessagesSquare,
  PencilRuler,
  ClipboardList,
  HardHat,
  ClipboardCheck,
  KeyRound,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Initial Consultation",
    description:
      "We discuss your vision, requirements, budget, and project objectives.",
    icon: MessagesSquare,
  },
  {
    number: "02",
    title: "Design & Planning",
    description:
      "Our specialists develop concepts, plans, and technical solutions.",
    icon: PencilRuler,
  },
  {
    number: "03",
    title: "Project Preparation",
    description:
      "We organize schedules, resources, materials, and project requirements.",
    icon: ClipboardList,
  },
  {
    number: "04",
    title: "Construction",
    description:
      "Our experienced teams execute the project with precision and care.",
    icon: HardHat,
  },
  {
    number: "05",
    title: "Quality Inspection",
    description:
      "We review the completed work to ensure it meets our quality standards.",
    icon: ClipboardCheck,
  },
  {
    number: "06",
    title: "Project Handover",
    description:
      "We deliver the completed project and provide final documentation.",
    icon: KeyRound,
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="bg-brand-primary px-8 py-24 text-brand-on-primary md:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent">
            Our Workflow
          </p>

          <h2 className="mb-5 text-4xl font-bold md:text-5xl">How We Work</h2>

          <p className="leading-8 opacity-75">
            Our structured approach ensures clarity, collaboration, and quality
            throughout every stage of your project.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-lg border border-current/15 p-8 transition duration-300 hover:border-brand-accent"
              >
                <span className="absolute right-6 top-5 text-5xl font-black opacity-25">
                  {step.number}
                </span>

                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-lg bg-brand-accent text-brand-on-accent">
                  <Icon size={26} />
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
      </div>
    </section>
  );
}
