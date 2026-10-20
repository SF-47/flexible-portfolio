import type { HeroContent } from "@/types/sectionContent";
import type { MediaAsset } from "@/types/media";
import { getMediaUrl } from "@/lib/mediaUrl";
import HeroFrame from "./HeroFrame";
import Reveal from "@/components/portfolio/Reveal";

type HeroProps = {
  content: HeroContent;
  media: MediaAsset[];
};

export default function Hero({ content, media }: HeroProps) {
  const imageUrl = getMediaUrl(content.imageMediaId ?? null, media);

  return (
    <HeroFrame imageUrl={imageUrl}>
      <Reveal className="relative z-10 max-w-3xl">
        <p className="mb-6 text-sm font-semibold tracking-[0.3em] text-brand-accent">
          {content.tagline}
        </p>

        <h2 className="text-5xl font-bold leading-tight md:text-7xl">
          {content.title}
        </h2>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-current/80">
          {content.description}
        </p>

        <a
          href={content.buttonLink}
          className="mt-10 inline-block bg-brand-accent px-8 py-4 font-semibold text-brand-on-accent transition hover:opacity-85"
        >
          {content.buttonText} →
        </a>
      </Reveal>
    </HeroFrame>
  );
}
