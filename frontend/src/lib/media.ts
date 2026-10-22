import "server-only";

import { axiosClient } from "@/lib/axios";
import type { MediaAsset } from "@/types/media";

export async function getMedia(): Promise<MediaAsset[]> {
  const response = await axiosClient.get<MediaAsset[]>("/api/media");

  return response.data;
}

// Admin write. Only called from the guarded server action in
// app/admin/content/actions.ts; the API has no authentication yet.
export async function uploadMedia(
  file: File,
  altText: string,
): Promise<MediaAsset> {
  const body = new FormData();

  body.append("file", file, file.name);
  body.append("altText", altText);

  const response = await axiosClient.post<MediaAsset>(
    "/api/admin/media",
    body,
  );

  return response.data;
}
