import "server-only";

import { axiosClient } from "@/lib/axios";
import type { Project } from "@/types/project";

export async function getProjects(): Promise<Project[]> {
  const response = await axiosClient.get<Project[]>("/api/projects");

  return response.data;
}
