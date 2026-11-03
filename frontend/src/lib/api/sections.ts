import "server-only";

import { adminClient } from "@/lib/api/admin/client";
import { axiosClient } from "@/lib/api/client";
import type { ApiSection } from "@/types/apiSections";

export async function getSections(): Promise<ApiSection[]> {
  const response = await axiosClient.get<ApiSection[]>("/api/sections");

  return response.data;
}

export async function saveSectionsLayout(
  sections: { id: string; isVisible: boolean }[],
): Promise<void> {
  await adminClient.put("/api/admin/sections/layout", { sections });
}
