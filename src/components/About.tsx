import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";

export default function About() {
  return (
    <section id="about" className="bg-brand-background px-8 py-24 text-brand-text md:px-20">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent-text">
            {siteConfig.about.label}
          </p>

          <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
            {siteConfig.about.title}
          </h2>

          <p className="mb-5 leading-8 text-slate-600">
            {siteConfig.about.description}
          </p>

          <p className="mb-8 leading-8 text-slate-600">
            {siteConfig.about.secondDescription}
          </p>

          <a
            href="#services"
            className="inline-block border-b-2 border-brand-accent pb-2 font-semibold transition hover:text-brand-accent-text"
          >
            Discover Our Services →
          </a>
        </div>

        <div className="relative h-87.5 overflow-hidden rounded-lg md:h-125">
          <Image
            src={siteConfig.about.image}
            alt="Construction project"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
