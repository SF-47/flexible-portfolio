
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/portfolio";

export default function Projects() {
  return (
    <section
      id="projects"
      className="bg-brand-background px-8 py-24 text-brand-text md:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent-text">
            Our Portfolio
          </p>

          <h2 className="text-4xl font-bold md:text-5xl">
            Featured Projects
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article key={project.id} className="group">
              <div className="relative h-80 overflow-hidden rounded-lg bg-slate-200">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute right-4 bottom-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand-accent text-brand-on-accent">
                  <ArrowUpRight size={22} />
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold text-brand-accent-text">
                  {project.category}
                </p>

                <h3 className="text-2xl font-bold">
                  {project.title}
                </h3>

                <p className="mt-2 text-slate-500">
                  {project.location}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
