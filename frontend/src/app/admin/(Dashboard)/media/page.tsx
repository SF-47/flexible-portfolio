import type { Metadata } from "next";

import MediaLibrary from "@/components/admin/media/MediaLibrary";
import { getAdminMedia } from "@/lib/api/media";
import { requireAdminSession } from "@/lib/api/admin/client";

export const metadata: Metadata = { title: "Media Library" };
export const dynamic = "force-dynamic";

export default async function MediaPage() {
  await requireAdminSession();

  const media = await getAdminMedia();

  return <MediaLibrary initialMedia={media} />;
}
