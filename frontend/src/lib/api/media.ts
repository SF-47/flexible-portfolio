import "server-only";

import { axiosClient } from "@/lib/api/client";
import type { AdminMediaAsset, MediaAsset } from "@/types/media";

export async function getMedia(): Promise<MediaAsset[]> {
  const response = await axiosClient.get<MediaAsset[]>("/api/media");

  return response.data;
}

// Admin read: every image with the places that use it.
export async function getAdminMedia(): Promise<AdminMediaAsset[]> {
  const response = await axiosClient.get<AdminMediaAsset[]>("/api/admin/media");

  return response.data;
}
