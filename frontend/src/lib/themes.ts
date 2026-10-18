import "server-only";

import { axiosClient } from "@/lib/axios";
import type { Theme } from "@/types/theme";

export async function getActiveTheme(): Promise<Theme> {
  const response = await axiosClient.get<Theme>("/api/themes/active");

  return response.data;
}
