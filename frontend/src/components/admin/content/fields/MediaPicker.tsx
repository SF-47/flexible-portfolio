"use client";

import { useContext, useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";

import MediaUploadForm from "@/components/admin/media/MediaUploadForm";
import { MediaContext } from "@/components/admin/content/MediaContext";
import { getMediaUrl } from "@/lib/mediaUrl";

// A modal list of the Media Library images, with an upload form. It uses the native
// <dialog> element, so Esc, focus trapping and the backdrop work out of the box.
export default function MediaPicker({
  open,
  selectedId,
  onSelect,
  onClose,
}: {
  open: boolean;
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onClose: () => void;
}) {
  const { media, onUploaded } = useContext(MediaContext);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-labelledby="media-picker-title"
      className="m-auto w-[min(92vw,48rem)] rounded-xl border border-admin-border bg-admin-surface p-0 text-admin-text backdrop:bg-slate-950/50"
    >
      {open && (
        <div className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <h2 id="media-picker-title" className="text-lg font-bold">
              Choose an image
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-2 text-admin-muted hover:bg-admin-bg"
            >
              <X size={20} />
            </button>
          </div>

          {media.length === 0 ? (
            <p className="text-sm text-admin-muted">
              The Media Library is empty. Upload an image below.
            </p>
          ) : (
            <ul className="grid max-h-80 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
              {media.map((asset) => {
                const url = getMediaUrl(asset.id, media);
                const selected = asset.id === selectedId;

                return (
                  <li key={asset.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(asset.id)}
                      aria-pressed={selected}
                      className={`block w-full overflow-hidden rounded-lg border text-left transition ${
                        selected
                          ? "border-amber-400 ring-2 ring-amber-400/40"
                          : "border-admin-border hover:border-admin-faint"
                      }`}
                    >
                      <span className="relative block h-24 bg-admin-bg">
                        {url && (
                          <Image
                            src={url}
                            alt={asset.altText ?? ""}
                            fill
                            sizes="200px"
                            className="object-cover"
                          />
                        )}
                      </span>
                      <span className="block truncate px-2 py-1.5 text-xs font-medium">
                        {asset.originalFileName}
                      </span>
                      {asset.altText && (
                        <span className="block truncate px-2 pb-1.5 text-xs text-admin-muted">
                          {asset.altText}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <MediaUploadForm
            onUploaded={(asset) => {
              onUploaded(asset);
              onSelect(asset.id);
            }}
          />

          {selectedId !== null && (
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="text-sm font-semibold text-red-700 hover:underline"
            >
              Use no image
            </button>
          )}
        </div>
      )}
    </dialog>
  );
}
