import type { Metadata } from "next";

import ProjectsManager from "@/components/admin/catalog/ProjectsManager";
import { getMedia } from "@/lib/api/media";
import { getAdminProjects } from "@/lib/api/projects";

export const metadata: Metadata = { title: "Project Cards" };
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const [projects, media] = await Promise.all([getAdminProjects(), getMedia()]);

  return <ProjectsManager initialProjects={projects} initialMedia={media} />;
}
