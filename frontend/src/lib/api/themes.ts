import "server-only";

import { adminClient } from "@/lib/api/admin/client";
import { axiosClient } from "@/lib/api/client";
import type { Theme, ThemeConfig } from "@/types/theme";

export async function getThemes(): Promise<Theme[]> {
  const response = await axiosClient.get<Theme[]>("/api/themes");
  return response.data;
}

export async function getActiveTheme(): Promise<Theme> {
  const response = await axiosClient.get<Theme>("/api/themes/active");
  return response.data;
}

// Admin writes: sent with the administrator's session cookie, only called from the
// server actions in app/admin/(Dashboard)/appearance/actions.ts.
export async function updateTheme(
  id: number,
  config: ThemeConfig,
): Promise<Theme> {
  const response = await adminClient.put<Theme>(
    `/api/admin/themes/${id}`,
    config,
  );
  return response.data;
}

export async function activateTheme(id: number): Promise<Theme> {
  const response = await adminClient.put<Theme>(
    `/api/admin/themes/${id}/activate`,
  );
  return response.data;
}
