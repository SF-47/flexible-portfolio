"use client";

import { useContext, useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

import { uploadImage } from "@/app/admin/content/actions";
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
  const [isUploading, startUpload] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleUpload(formData: FormData) {
    setError(null);

    startUpload(async () => {
      const result = await uploadImage(formData);

      if (result.ok) {
        onUploaded(result.media);
        onSelect(result.media.id);
      } else {
        setError(result.message);
      }
    });
  }

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

          <form
            action={handleUpload}
            className="space-y-3 rounded-lg border border-admin-border p-4"
          >
            <h3 className="text-sm font-semibold">Upload a new image</h3>

            <div>
              <label htmlFor="media-upload-file" className="mb-1 block text-xs font-medium">
                Image (JPG, PNG or WebP, up to 5 MB)
              </label>
              <input
                id="media-upload-file"
                name="file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
                className="block w-full text-sm"
              />
            </div>

            <div>
              <label htmlFor="media-upload-alt" className="mb-1 block text-xs font-medium">
                Alt text (describes the image for screen readers)
              </label>
              <input
                id="media-upload-alt"
                name="altText"
                type="text"
                maxLength={200}
                className="w-full rounded-lg border border-admin-border bg-admin-subtle px-3 py-2 text-sm"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isUploading}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
            >
              <Upload size={16} />
              {isUploading ? "Uploading…" : "Upload"}
            </button>
          </form>

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
