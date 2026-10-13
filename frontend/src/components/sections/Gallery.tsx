import Image from "next/image";
import { Images } from "lucide-react";

const gallery = [
  {
    id: 1,
    title: "Modern Residential Architecture",
    category: "Residential",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
    featured: true,
  },
  {
    id: 2,
    title: "Contemporary Office Interior",
    category: "Commercial",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85",
    featured: false,
  },
  {
    id: 3,
    title: "Architectural Exterior",
    category: "Architecture",
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1000&q=85",
    featured: false,
  },
  {
    id: 4,
    title: "Modern Living Space",
    category: "Interior Design",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
    featured: false,
  },
  {
    id: 5,
    title: "Commercial Architecture",
    category: "Construction",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85",
    featured: false,
  },
];

export default function Gallery() {
  return (
    <section
      id="gallery"
      className="bg-brand-surface px-8 py-24 text-brand-text md:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent-text">
              Visual Showcase
            </p>

            <h2 className="mb-5 text-4xl font-bold md:text-5xl">Our Gallery</h2>

            <p className="leading-8 text-brand-muted">
              Explore our collection of architectural designs, construction
              details, and completed spaces.
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-brand-accent/15 text-brand-accent-text">
            <Images size={26} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden rounded-lg bg-brand-surface-strong ${
                item.featured ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div
                className={`relative ${
                  item.featured ? "h-80 md:h-full md:min-h-120" : "h-64"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes={
                    item.featured
                      ? "(max-width: 768px) 100vw, 66vw"
                      : "(max-width: 768px) 100vw, 33vw"
                  }
                  className="object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-accent">
                    {item.category}
                  </p>

                  <h3 className="text-xl font-bold">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
