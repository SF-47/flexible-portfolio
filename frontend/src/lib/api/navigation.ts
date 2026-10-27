import "server-only";

import { adminClient, adminRead } from "@/lib/api/admin/client";
import { axiosClient } from "@/lib/api/client";
import type { AdminNavigationItem, NavigationItem } from "@/types/navigation";

export async function getNavigation(): Promise<NavigationItem[]> {
  const response = await axiosClient.get<NavigationItem[]>("/api/navigation");

  return response.data;
}

export async function getAdminNavigation(): Promise<AdminNavigationItem[]> {
  return adminRead(async () => {
    const response = await adminClient.get<AdminNavigationItem[]>(
      "/api/admin/navigation",
    );

    return response.data;
  });
}
