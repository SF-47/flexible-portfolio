import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="bg-white px-8 py-24 text-slate-900 md:px-20">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-amber-600">
            About Us
          </p>

          <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
            Building Excellence for Over 20 Years
          </h2>

          <p className="mb-5 leading-8 text-slate-600">
            ATLAS Construction is a leading construction and engineering company
            committed to delivering high-quality projects that stand the test of
            time.
          </p>

          <p className="mb-8 leading-8 text-slate-600">
            From residential buildings to large-scale commercial developments,
            we combine innovation, expertise, and craftsmanship to bring every
            vision to life.
          </p>

          <a
            href="#services"
            className="inline-block border-b-2 border-amber-500 pb-2 font-semibold transition hover:text-amber-600"
          >
            Discover Our Services →
          </a>
        </div>

        <div className="relative h-87.5 overflow-hidden rounded-lg md:h-125">
          <Image
            src="/images/about.jpg"
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
