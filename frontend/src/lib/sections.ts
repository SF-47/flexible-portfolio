import "server-only";

import { axiosClient } from "@/lib/axios";
import type { ApiSection } from "@/types/apiSections";

export async function getSections(): Promise<ApiSection[]> {
  const response = await axiosClient.get<ApiSection[]>("/api/sections");

  return response.data;
}

export async function saveSectionsLayout(
  sections: { id: string; isVisible: boolean }[],
): Promise<void> {
  await axiosClient.put("/api/admin/sections/layout", { sections });
}

// Admin write. Only called from the guarded server action in
// app/admin/content/actions.ts; the API has no authentication yet.
export async function updateSectionContent(
  id: string,
  contentJson: string,
  expectedUpdatedAt: string,
): Promise<ApiSection> {
  const response = await axiosClient.put<ApiSection>(
    `/api/admin/sections/${encodeURIComponent(id)}/content`,
    { contentJson, expectedUpdatedAt },
  );

  return response.data;
}
