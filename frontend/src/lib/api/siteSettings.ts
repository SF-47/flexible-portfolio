import "server-only";

import { axiosClient } from "@/lib/api/client";
import type { SiteSettings } from "@/types/siteSettings";

export async function getSiteSettings(): Promise<SiteSettings> {
  const response = await axiosClient.get<SiteSettings>("/api/site-settings");

  return response.data;
}
