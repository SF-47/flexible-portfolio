export type MediaAsset = {
  id: number;
  originalFileName: string;
  url: string;
  contentType: string;
  fileSizeBytes: number;
  altText: string | null;
  createdAt: string;
};
// What the admin API returns: the shared fields plus where the image is used
// (an empty list means the image is unused and can be deleted).
export type AdminMediaAsset = MediaAsset & {
  usedIn: string[];
};
