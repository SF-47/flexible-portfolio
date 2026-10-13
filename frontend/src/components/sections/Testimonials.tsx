
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ahmad Hassan",
    role: "Residential Client",
    initials: "AH",
    rating: 5,
    message:
      "The team demonstrated exceptional professionalism throughout our residential project. Their attention to detail and communication made the entire process smooth.",
  },
  {
    id: 2,
    name: "Omar Khalil",
    role: "Business Owner",
    initials: "OK",
    rating: 5,
    message:
      "From planning to final delivery, the quality of work exceeded our expectations. We appreciated their commitment to deadlines and transparency.",
  },
  {
    id: 3,
    name: "Karim Mansour",
    role: "Property Developer",
    initials: "KM",
    rating: 5,
    message:
      "A reliable construction partner with excellent technical knowledge. The team understood our requirements and delivered impressive results.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="bg-brand-surface px-8 py-24 text-brand-text md:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent-text">
            Client Feedback
          </p>

          <h2 className="mb-5 text-4xl font-bold md:text-5xl">
            What Our Clients Say
          </h2>

          <p className="mx-auto max-w-2xl leading-8 text-brand-muted">
            Building strong relationships is just as important as building
            exceptional spaces.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="flex flex-col rounded-lg border border-brand-border bg-brand-background p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <Quote
                size={40}
                className="mb-6 text-brand-accent-text"
              />

              <div className="mb-5 flex gap-1 text-brand-accent-text">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Star key={index} size={17} fill="currentColor" />
                ))}
              </div>

              <p className="mb-8 flex-1 leading-8 text-brand-muted">
                &ldquo;{testimonial.message}&rdquo;
              </p>

              <div className="flex items-center gap-4 border-t border-brand-border pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary font-bold text-brand-on-primary">
                  {testimonial.initials}
                </div>

                <div>
                  <h3 className="font-bold">{testimonial.name}</h3>
                  <p className="text-sm text-brand-muted">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
