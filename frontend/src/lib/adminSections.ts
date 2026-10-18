import "server-only";

import { axiosClient } from "@/lib/axios";
import type { ApiSection } from "@/types/apiSections";

export async function getAdminSections(): Promise<ApiSection[]> {
  const response = await axiosClient.get<ApiSection[]>("/api/admin/sections");

  return response.data;
}
