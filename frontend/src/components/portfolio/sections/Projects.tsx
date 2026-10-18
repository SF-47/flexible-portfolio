import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ProjectsContent } from "@/types/sectionContent";

// Placeholders until media fetching exists and featuredImageId can be resolved.
const fallbackImages = [
  "/images/project-1.jpg",
  "/images/project-2.jpg",
  "/images/project-3.jpg",
  "/images/project-4.jpg",
  "/images/project-5.jpg",
];

// Mirrors ProjectResponse; supplied by the Projects API.
type Project = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  location: string | null;
  completionDate: string | null;
  featuredImageId: number | null;
  isFeatured: boolean;
  sortOrder: number;
};

type ProjectsProps = {
  content: ProjectsContent;
  projects: Project[];
};

export default function Projects({ content, projects }: ProjectsProps) {
  return (
    <section
      id="projects"
      className="bg-brand-background px-8 py-24 text-brand-text md:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent-text">
            {content.label}
          </p>

          <h2 className="text-4xl font-bold md:text-5xl">
            {content.title}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <article key={project.id} className="group">
              <div className="relative h-80 overflow-hidden rounded-lg bg-brand-surface-strong">
                <Image
                  src={fallbackImages[index % fallbackImages.length]}
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
                {project.category && (
                  <p className="mb-2 text-sm font-semibold text-brand-accent-text">
                    {project.category}
                  </p>
                )}

                <h3 className="text-2xl font-bold">
                  {project.title}
                </h3>

                {project.location && (
                  <p className="mt-2 text-brand-muted">
                    {project.location}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
