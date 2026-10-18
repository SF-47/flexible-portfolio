import Image from "next/image";
import { Images, type LucideIcon } from "lucide-react";
import type { GalleryContent } from "@/types/sectionContent";
import type { MediaAsset } from "@/types/media";
import { getMediaUrl } from "@/lib/mediaUrl";
import Reveal from "@/components/portfolio/Reveal";

const icons: Record<string, LucideIcon> = {
  Images,
};

// Images shown when a gallery item has no configured media asset.
const fallbackImages = [
  "/images/project-1.jpg",
  "/images/project-2.jpg",
  "/images/project-3.jpg",
  "/images/project-4.jpg",
  "/images/project-5.jpg",
];

type GalleryProps = {
  content: GalleryContent;
  media: MediaAsset[];
};

export default function Gallery({ content, media }: GalleryProps) {
  const GalleryIcon = icons[content.icon] ?? Images;

  return (
    <section
      id="gallery"
      className="bg-brand-surface px-8 py-16 md:py-24 text-brand-text md:px-20"
    >
      <Reveal className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent-text">
              {content.label}
            </p>

            <h2 className="mb-5 text-4xl font-bold md:text-5xl">{content.title}</h2>

            <p className="leading-8 text-brand-muted">
              {content.description}
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-brand-accent/15 text-brand-accent-text">
            <GalleryIcon size={26} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, index) => (
            <div
              key={item.title}
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
                  src={getMediaUrl(item.imageMediaId, media) ?? fallbackImages[index % fallbackImages.length]}
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
      </Reveal>
    </section>
  );
}
