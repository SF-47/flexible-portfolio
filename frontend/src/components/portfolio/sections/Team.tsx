import Image from "next/image";
import type { MediaAsset } from "@/types/media";
import { getMediaUrl } from "@/lib/ui/mediaUrl";
import { Mail, UserRound } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import type { TeamContent } from "@/types/sectionContent";
import Reveal from "@/components/portfolio/Reveal";

type TeamProps = {
  content: TeamContent;
  media: MediaAsset[];
};

export default function Team({ content, media }: TeamProps) {
  return (
    <section
      id="team"
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

        {/* Wrapping flex row: 1 per row on mobile, 2 from sm, 4 from lg. Cards keep one
            size and a last row with fewer cards is centered, for any number of members. */}
        <div className="flex flex-wrap justify-center gap-6">
          {content.members.map((member, index) => {
            const imageUrl = getMediaUrl(member.imageMediaId, media);

            return (
            <article
              key={index}
              className="group w-full overflow-hidden rounded-lg sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] bg-brand-background shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative flex aspect-4/4.5 items-center justify-center overflow-hidden bg-linear-to-br from-brand-surface-strong to-brand-border">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition group-hover:scale-110"
                  />
                ) : (
                  <UserRound
                    size={95}
                    strokeWidth={1}
                    className="text-brand-muted transition group-hover:scale-110"
                  />
                )}
              </div>

              <div className="p-6">
                <h3 className="mb-1 text-lg font-bold">{member.name}</h3>

                <p className="mb-4 text-sm font-semibold text-brand-accent-text">
                  {member.position}
                </p>

                <p className="mb-6 text-sm leading-7 text-brand-muted">
                  {member.description}
                </p>

                <div className="flex gap-3 border-t border-brand-border pt-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-surface text-brand-muted">
                    <FaLinkedin size={18} />
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-surface text-brand-muted">
                    <Mail size={18} />
                  </span>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
