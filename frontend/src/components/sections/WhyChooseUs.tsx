import {
  ShieldCheck,
  Award,
  Clock3,
  Users,
  BadgeCheck,
  Lightbulb,
} from "lucide-react";

const advantages = [
  {
    icon: ShieldCheck,
    title: "Safety First",
    description:
      "We maintain high safety standards across every stage of construction.",
  },
  {
    icon: Award,
    title: "Quality Craftsmanship",
    description:
      "Our commitment to quality ensures durable and exceptional results.",
  },
  {
    icon: Clock3,
    title: "On-Time Delivery",
    description:
      "We plan and execute projects efficiently to meet agreed timelines.",
  },
  {
    icon: Users,
    title: "Experienced Team",
    description:
      "Our professionals bring technical expertise and practical experience.",
  },
  {
    icon: BadgeCheck,
    title: "Trusted Partnerships",
    description:
      "We build long-term relationships through transparency and reliability.",
  },
  {
    icon: Lightbulb,
    title: "Innovative Solutions",
    description:
      "We combine modern methods and creative thinking to solve challenges.",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      className="bg-brand-primary px-8 py-24 text-brand-on-primary md:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent">
            Our Advantages
          </p>

          <h2 className="mb-5 text-4xl font-bold md:text-5xl">Why Choose Us</h2>

          <p className="leading-8 opacity-75">
            We deliver more than buildings. We create lasting value through
            expertise, dedication, and attention to detail.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((advantage) => {
            const Icon = advantage.icon;

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
      </div>
    </section>
  );
}
