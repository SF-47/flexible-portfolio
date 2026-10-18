import "server-only";

import { axiosClient } from "@/lib/axios";
import type { MediaAsset } from "@/types/media";

export async function getMedia(): Promise<MediaAsset[]> {
  const response = await axiosClient.get<MediaAsset[]>("/api/media");

  return response.data;
}