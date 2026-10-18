import "server-only";

import { axiosClient } from "@/lib/axios";
import type { NavigationItem } from "@/types/navigation";

export async function getNavigation(): Promise<NavigationItem[]> {
  const response = await axiosClient.get<NavigationItem[]>("/api/navigation");

  return response.data;
}
