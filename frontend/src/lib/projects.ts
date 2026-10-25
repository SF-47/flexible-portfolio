import "server-only";

import { axiosClient } from "@/lib/axios";
import type { AdminProject, Project, ProjectDetail } from "@/types/project";

export async function getProjects(): Promise<Project[]> {
  const response = await axiosClient.get<Project[]>("/api/projects");

  return response.data;
}

export async function getAdminProjects(): Promise<AdminProject[]> {
  const response = await axiosClient.get<AdminProject[]>("/api/admin/projects");

  return response.data;
}

// The public project page; null when the slug is unknown.
export async function getProjectBySlug(
  slug: string,
): Promise<ProjectDetail | null> {
  // The slug is placed in a URL path, so only plain slugs are sent.
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || slug.length > 220) return null;

  const response = await axiosClient.get<ProjectDetail>(
    `/api/projects/slug/${slug}`,
    { validateStatus: (status) => status === 200 || status === 404 },
  );

  return response.status === 200 ? response.data : null;
}
