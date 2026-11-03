import "server-only";

import { adminClient, adminRead } from "@/lib/api/admin/client";
import type { DashboardStats } from "@/types/dashboardStats";

export async function getDashboardStats(): Promise<DashboardStats> {
  return adminRead(async () => {
    const response = await adminClient.get<DashboardStats>(
      "/api/admin/dashboard/stats",
    );

    return response.data;
  });
}
