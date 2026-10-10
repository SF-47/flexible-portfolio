import { stats } from "@/data/portfolio";

export default function Stats() {
  return (
    <section className="bg-brand-accent px-8 py-16 text-slate-950 md:px-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.id} className="text-center">
            <h3 className="text-4xl font-bold md:text-5xl">{stat.value}</h3>

            <p className="mt-3 text-sm font-medium md:text-base">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
