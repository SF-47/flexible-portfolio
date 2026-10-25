"use client";

import { useContext } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ImagePlus } from "lucide-react";

import { MediaContext } from "@/components/admin/content/MediaContext";
import { getMediaUrl } from "@/lib/mediaUrl";

// The icon library is large, so the glyph loads on demand (same as the icon picker).
const IconGlyph = dynamic(
  () => import("@/components/admin/content/fields/IconGlyph"),
  { ssr: false, loading: () => <span className="inline-block h-5 w-5" /> },
);

// A small image preview from the Media Library (or a placeholder).
export function Thumb({
  mediaId,
  alt,
}: {
  mediaId: number | null;
  alt: string;
}) {
  const { media } = useContext(MediaContext);
  const url = getMediaUrl(mediaId, media);

  return (
    <span className="relative flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-admin-bg">
      {url ? (
        <Image src={url} alt={alt} fill sizes="64px" className="object-cover" />
      ) : (
        <ImagePlus size={18} className="text-admin-faint" aria-hidden="true" />
      )}
    </span>
  );
}

export function IconBadge({ name }: { name: string | null }) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-admin-bg text-admin-accent">
      {name ? (
        <IconGlyph name={name} size={22} />
      ) : (
        <span className="text-xs text-admin-faint">—</span>
      )}
    </span>
  );
}
