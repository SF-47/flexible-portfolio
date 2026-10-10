import { siteConfig } from "@/data/siteConfig";

export default function Hero() {
  return (
    <section
      id="home"
      className="flex min-h-[calc(100vh-88px)] items-center px-8 py-20 md:px-20"
    >
      <div className="max-w-3xl">
        <p className="mb-6 text-sm font-semibold tracking-[0.3em] text-brand-accent">
          {siteConfig.company.tagline}
        </p>

        <h2 className="text-5xl font-bold leading-tight md:text-7xl">
          {siteConfig.hero.title}
        </h2>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-slate-300">
          {siteConfig.company.description}
        </p>

        <a
          href={siteConfig.hero.buttonLink}
          className="mt-10 inline-block bg-brand-accent px-8 py-4 font-semibold text-brand-on-accent transition hover:opacity-85"
        >
          {siteConfig.hero.buttonText} →
        </a>
      </div>
    </section>
  );
}
