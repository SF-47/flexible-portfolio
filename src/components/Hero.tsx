
export default function Hero() {
  return (
    <section
      id="home"
      className="flex min-h-[calc(100vh-88px)] items-center px-8 py-20 md:px-20"
    >
      <div className="max-w-3xl">
        <p className="mb-6 text-sm font-semibold tracking-[0.3em] text-amber-400">
          CONSTRUCTION & ENGINEERING
        </p>

        <h2 className="text-5xl font-bold leading-tight md:text-7xl">
          Building the Future, Together.
        </h2>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-slate-300">
          We deliver modern construction solutions with quality,
          precision, and trust.
        </p>

        <a
          href="#projects"
          className="mt-10 inline-block bg-amber-400 px-8 py-4 font-semibold text-slate-950 transition hover:bg-amber-300"
        >
          Explore Our Projects →
        </a>
      </div>
    </section>
  );
}
