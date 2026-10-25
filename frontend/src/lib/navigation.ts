import "server-only";

import { axiosClient } from "@/lib/axios";
import type { AdminNavigationItem, NavigationItem } from "@/types/navigation";

export async function getNavigation(): Promise<NavigationItem[]> {
  const response = await axiosClient.get<NavigationItem[]>("/api/navigation");

  return response.data;
}

export async function getAdminNavigation(): Promise<AdminNavigationItem[]> {
  const response = await axiosClient.get<AdminNavigationItem[]>(
    "/api/admin/navigation",
  );

  return response.data;
}
