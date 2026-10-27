import type { Metadata } from "next";
import ContentEditor from "@/components/admin/ContentEditor";
import { getAdminSections } from "@/lib/api/admin/sections";
import { getAdminCompanyServices } from "@/lib/api/companyServices";
import { getMedia } from "@/lib/api/media";
import { getAdminProjects } from "@/lib/api/projects";
import { requireAdminSession } from "@/lib/api/admin/client";

export const metadata: Metadata = { title: "Content Editor" };
// It reads the admin endpoints, so it is rendered per request, not at build time.
export const dynamic = "force-dynamic";

export default async function ContentPage() {
  await requireAdminSession();

  const [sections, media, services, projects] = await Promise.all([
    getAdminSections(),
    getMedia(),
    getAdminCompanyServices(),
    getAdminProjects(),
  ]);

  return (
    <ContentEditor
      sections={sections}
      media={media}
      catalog={{
        services: services.map(({ id, title, isActive }) => ({
          id,
          title,
          isActive,
        })),
        projects: projects.map(({ id, title, isFeatured }) => ({
          id,
          title,
          isFeatured,
        })),
      }}
    />
  );
}
