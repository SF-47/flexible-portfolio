import type { MediaAsset } from "@/types/media";

export function getMediaUrl(
  mediaId: number | null,
  media: MediaAsset[],
): string | null {
  if (mediaId === null) return null;

  const asset = media.find((item) => item.id === mediaId);

  if (!asset) return null;

  // Only accept images stored under our upload directory.
  if (!/^\/uploads\/[a-zA-Z0-9/_-]+\.(jpg|jpeg|png|webp)$/i.test(asset.url)) {
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) return null;

  return new URL(asset.url, `${baseUrl.replace(/\/$/, "")}/`).href;
}
