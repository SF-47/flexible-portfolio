"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

import { MediaContext } from "@/components/admin/content/MediaContext";
import MediaPicker from "./MediaPicker";
import { getMediaUrl } from "@/lib/mediaUrl";

// An image field: shows the chosen MediaAsset and opens the picker. The value is the
// MediaAsset id (or null), exactly what ContentJson stores as imageMediaId.
export default function ImageField({
  label,
  value,
  onChange,
  fit = "cover",
  hint,
}: {
  label: string;
  value: number | null;
  onChange: (id: number | null) => void;
  // "contain" shows the whole image without cropping (used for logos).
  fit?: "cover" | "contain";
  hint?: string;
}) {
  const { media } = useContext(MediaContext);
  const [pickerOpen, setPickerOpen] = useState(false);

  const asset =
    value === null ? undefined : media.find((item) => item.id === value);
  const url = value === null ? null : getMediaUrl(value, media);

  return (
    <div>
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <div className="rounded-lg border border-admin-border bg-admin-subtle p-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-admin-bg">
            {url ? (
              <Image
                src={url}
                alt={asset?.altText ?? ""}
                fill
                sizes="96px"
                className={
                  fit === "contain" ? "object-contain p-1" : "object-cover"
                }
              />
            ) : (
              <ImagePlus
                size={22}
                className="text-admin-faint"
                aria-hidden="true"
              />
            )}
          </div>

          <div className="min-w-0 flex-1 text-xs text-admin-muted">
            {value === null && <p>No image selected.</p>}
            {value !== null && asset && (
              <>
                <p className="truncate font-medium text-admin-text">
                  {asset.originalFileName}
                </p>
                {asset.altText && (
                  <p className="truncate">Alt: {asset.altText}</p>
                )}
              </>
            )}
            {value !== null && !asset && (
              <p role="alert" className="text-red-700">
                Image #{value} was not found in the Media Library.
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="rounded-lg border border-admin-border px-3 py-1.5 text-xs font-semibold hover:bg-admin-bg"
          >
            {value === null ? "Choose image" : "Replace image"}
          </button>

          {value !== null && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
            >
              <X size={14} />
              Remove
            </button>
          )}
        </div>

        {hint && <p className="mt-3 text-xs text-admin-muted">{hint}</p>}

        <MediaPicker
          open={pickerOpen}
          selectedId={value}
          onSelect={(id) => {
            onChange(id);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      </div>
    </div>
  );
}
