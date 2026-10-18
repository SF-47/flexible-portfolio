import Image from "next/image";

import type { AboutContent } from "@/types/sectionContent";
import type { MediaAsset } from "@/types/media";
import { getMediaUrl } from "@/lib/mediaUrl";

const fallbackImage = "/images/about.jpg";

type AboutProps = {
  content: AboutContent;
  media: MediaAsset[];
};

export default function About({ content, media }: AboutProps) {
  const imageUrl = getMediaUrl(content.imageMediaId, media) ?? fallbackImage;

  return (
    <section
      id="about"
      className="bg-brand-background px-8 py-16 md:py-24 text-brand-text md:px-20"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent-text">
            {content.label}
          </p>

          <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
            {content.title}
          </h2>

          <p className="mb-5 leading-8 text-brand-muted">
            {content.description}
          </p>

          <p className="mb-8 leading-8 text-brand-muted">
            {content.secondDescription}
          </p>

          <a
            href={content.linkUrl}
            className="inline-block border-b-2 border-brand-accent pb-2 font-semibold transition hover:text-brand-accent-text"
          >
            {content.linkText} →
          </a>
        </div>

        <div className="relative h-87.5 overflow-hidden rounded-lg md:h-125">
          <Image
            src={imageUrl}
            alt={content.imageAlt || "About our company"}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
