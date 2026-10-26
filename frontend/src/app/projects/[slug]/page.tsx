import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";

import SiteTheme from "@/components/SiteTheme";
import { getMedia } from "@/lib/api/media";
import { getMediaUrl } from "@/lib/ui/mediaUrl";
import { getProjectBySlug } from "@/lib/api/projects";
import { getSiteSettings } from "@/lib/api/siteSettings";
import { getActiveTheme } from "@/lib/api/themes";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [project, siteSettings] = await Promise.all([
    getProjectBySlug(slug),
    getSiteSettings(),
  ]);

  if (!project) return { title: "Project not found" };

  const description =
    project.description?.trim() ||
    `${project.title} by ${siteSettings.companyName}.`;

  return {
    title: `${project.title} | ${siteSettings.companyName}`,
    description,
    openGraph: {
      title: project.title,
      description,
      type: "article",
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const [siteSettings, activeTheme, media] = await Promise.all([
    getSiteSettings(),
    getActiveTheme(),
    getMedia(),
  ]);

  const imageUrl = getMediaUrl(project.featuredImageId, media);
  const logoUrl = getMediaUrl(siteSettings.logoMediaId, media);
  const paragraphs = (project.fullDescription ?? "")
    .split(/\n{2,}/)
    .map((text) => text.trim())
    .filter(Boolean);

  return (
    <SiteTheme theme={activeTheme}>
      <div className="min-h-screen bg-brand-background text-brand-text">
        <header className="bg-brand-primary px-8 py-5 text-brand-on-primary md:px-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <Link href="/" className="flex min-w-0 items-center">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={siteSettings.companyName}
                  width={192}
                  height={48}
                  className="h-auto max-h-12 w-auto max-w-40 object-contain md:max-w-48"
                />
              ) : (
                <span className="truncate text-2xl font-bold tracking-widest">
                  {siteSettings.companyName}
                </span>
              )}
            </Link>

            <Link
              href="/#projects"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold hover:text-brand-accent"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to portfolio
            </Link>
          </div>
        </header>

        <main className="px-8 py-12 md:px-20 md:py-16">
          <article className="mx-auto max-w-4xl">
            {imageUrl && (
              <div className="relative mb-10 aspect-video overflow-hidden rounded-lg bg-brand-surface-strong">
                <Image
                  src={imageUrl}
                  alt={project.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                />
              </div>
            )}

            {project.category && (
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-accent-text">
                {project.category}
              </p>
            )}

            <h1 className="text-4xl font-bold md:text-5xl">{project.title}</h1>

            {(project.location || project.completionDate) && (
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-brand-muted">
                {project.location && (
                  <li className="flex items-center gap-2">
                    <MapPin size={18} aria-hidden="true" />
                    {project.location}
                  </li>
                )}
                {project.completionDate && (
                  <li className="flex items-center gap-2">
                    <Calendar size={18} aria-hidden="true" />
                    Completed {formatDate(project.completionDate)}
                  </li>
                )}
              </ul>
            )}

            {project.description && (
              <p className="mt-8 text-xl leading-9">{project.description}</p>
            )}

            {paragraphs.length > 0 && (
              <div className="mt-8 space-y-6 leading-8 text-brand-muted">
                {paragraphs.map((text, index) => (
                  <p key={index} className="whitespace-pre-line">
                    {text}
                  </p>
                ))}
              </div>
            )}

            <div className="mt-14 flex flex-wrap gap-4">
              <Link
                href="/#projects"
                className="inline-flex items-center gap-2 rounded-lg border border-brand-border px-6 py-3 font-semibold hover:border-brand-accent"
              >
                <ArrowLeft size={18} aria-hidden="true" />
                All projects
              </Link>
              <Link
                href="/#contact"
                className="rounded-lg bg-brand-accent px-6 py-3 font-semibold text-brand-on-accent"
              >
                Start a project
              </Link>
            </div>
          </article>
        </main>
      </div>
    </SiteTheme>
  );
}
