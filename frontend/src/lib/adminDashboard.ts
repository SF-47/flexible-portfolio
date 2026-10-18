import "server-only";

import { axiosClient } from "@/lib/axios";
import type { DashboardStats } from "@/types/dashboardStats";

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await axiosClient.get<DashboardStats>(
    "/api/admin/dashboard/stats",
  );

  return response.data;
}
