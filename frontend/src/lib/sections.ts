import "server-only";

import { axiosClient } from "@/lib/axios";
import type { ApiSection } from "@/types/apiSections";

export async function getSections(): Promise<ApiSection[]> {
  const response = await axiosClient.get<ApiSection[]>("/api/sections");

  return response.data;
}

export async function reorderSections(sectionIds: string[]): Promise<void> {
  await axiosClient.put("/api/admin/sections/reorder", {
    sectionIds,
  });
}

export async function saveSectionsLayout(
  sections: { id: string; isVisible: boolean }[],
): Promise<void> {
  await axiosClient.put("/api/admin/sections/layout", { sections });
}
