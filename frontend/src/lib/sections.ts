import "server-only";

import { axiosClient } from "@/lib/axios";
import type { ApiSection } from "@/types/apiSections";

export async function getSections(): Promise<ApiSection[]> {
  const response = await axiosClient.get<ApiSection[]>("/api/sections");

  return response.data;
}
