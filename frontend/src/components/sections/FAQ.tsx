import { HelpCircle, Plus } from "lucide-react";

const questions = [
  {
    id: 1,
    question: "What types of construction projects do you handle?",
    answer:
      "We specialize in residential, commercial, and industrial construction, as well as renovation and engineering services.",
  },
  {
    id: 2,
    question: "How can I request a project quotation?",
    answer:
      "Contact our team with your project requirements, location, and estimated timeline. We will review the details and discuss the next steps.",
  },
  {
    id: 3,
    question: "Do you provide architectural design services?",
    answer:
      "Yes. Our team supports project planning, architectural design, engineering coordination, and construction execution.",
  },
  {
    id: 4,
    question: "How long does a typical construction project take?",
    answer:
      "Project duration depends on the size, complexity, approvals, and scope of work. We provide an estimated schedule during planning.",
  },
  {
    id: 5,
    question: "Can you manage an entire project from start to finish?",
    answer:
      "Yes. We offer comprehensive project management covering planning, coordination, construction, and final delivery.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="bg-brand-background px-8 py-24 text-brand-text md:px-20"
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent-text">
            Common Questions
          </p>

          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            Frequently Asked Questions
          </h2>

          <p className="mb-8 leading-8 text-brand-muted">
            Find answers to common questions about our services, project
            process, and construction solutions.
          </p>

          <div className="flex items-center gap-4 rounded-lg bg-brand-surface p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-accent/15 text-brand-accent-text">
              <HelpCircle size={25} />
            </div>

            <div>
              <p className="font-bold">Have another question?</p>
              <a
                href="#contact"
                className="text-sm font-semibold text-brand-accent-text hover:underline"
              >
                Contact our team →
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((item) => (
            <details
              key={item.id}
              className="group rounded-lg border border-brand-border bg-brand-surface open:border-brand-accent"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 [&::-webkit-details-marker]:hidden">
                <h3 className="font-semibold">{item.question}</h3>

                <Plus
                  size={20}
                  className="shrink-0 text-brand-accent-text transition group-open:rotate-45"
                />
              </summary>

              <p className="border-t border-brand-border px-6 pb-6 pt-4 leading-7 text-brand-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
