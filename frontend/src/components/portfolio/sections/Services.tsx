import Image from "next/image";
import type { MediaAsset } from "@/types/media";
import { getMediaUrl } from "@/lib/mediaUrl";
import type { CompanyService } from "@/types/companyService";
import { HardHat } from "lucide-react";
import { IconByName } from "@/lib/icons";

import type { ServicesContent } from "@/types/sectionContent";
import Reveal from "@/components/portfolio/Reveal";

type ServicesProps = {
  content: ServicesContent;
  services: CompanyService[];
  media: MediaAsset[];
};

export default function Services({ content, services, media }: ServicesProps) {
  return (
    <section
      id="services"
      className="bg-brand-surface px-8 py-16 md:py-24 text-brand-text md:px-20"
    >
      <Reveal className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-accent-text">
            {content.label}
          </p>

          <h2 className="mb-5 text-4xl font-bold md:text-5xl">{content.title}</h2>

          <p className="leading-8 text-brand-muted">
            {content.description}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const imageUrl = getMediaUrl(service.imageMediaId, media);

            return (
              <div
                key={service.id}
                className="group rounded-lg border border-brand-border bg-brand-background p-8 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-lg bg-brand-accent/15 text-brand-accent-text">
                  <IconByName icon={service.iconName} fallback={HardHat} size={28} />
                </div>

                {imageUrl && (
                  <div className="relative mb-6 aspect-video overflow-hidden rounded-lg bg-brand-surface-strong">
                    <Image
                      src={imageUrl}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                )}

                <h3 className="mb-4 text-xl font-bold">{service.title}</h3>

                <p className="leading-7 text-brand-muted">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
