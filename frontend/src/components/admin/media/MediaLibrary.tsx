"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { HardDrive, ImageIcon, Search, Upload } from "lucide-react";

import MediaDetailsDialog from "@/components/admin/media/MediaDetailsDialog";
import MediaUploadForm from "@/components/admin/media/MediaUploadForm";
import Modal from "@/components/admin/media/Modal";
import { formatBytes, formatName } from "@/components/admin/media/mediaFormat";
import { getMediaUrl } from "@/lib/ui/mediaUrl";
import type { AdminMediaAsset } from "@/types/media";

export default function MediaLibrary({
  initialMedia,
}: {
  initialMedia: AdminMediaAsset[];
}) {
  const [items, setItems] = useState(initialMedia);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const text = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      text
        ? items.filter(
            (item) =>
              item.originalFileName.toLowerCase().includes(text) ||
              (item.altText ?? "").toLowerCase().includes(text),
          )
        : items,
    [items, text],
  );

  const selected = items.find((item) => item.id === selectedId) ?? null;
  const totalBytes = items.reduce((sum, item) => sum + item.fileSizeBytes, 0);
  const usedCount = items.filter((item) => item.usedIn.length > 0).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="mt-2 text-admin-muted">
            Manage website photos, logos, and other assets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setNotice(null);
            setUploadOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-3 font-semibold text-slate-950"
        >
          <Upload size={18} />
          Upload Image
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-admin-border bg-admin-surface p-5">
          <ImageIcon className="mb-4 text-admin-accent" />
          <p className="text-3xl font-bold">{items.length}</p>
          <p className="mt-1 text-sm text-admin-muted">Total Files</p>
        </div>

        <div className="rounded-xl border border-admin-border bg-admin-surface p-5">
          <HardDrive className="mb-4 text-admin-accent" />
          <p className="text-3xl font-bold">{formatBytes(totalBytes)}</p>
          <p className="mt-1 text-sm text-admin-muted">Storage Used</p>
        </div>

        <div className="rounded-xl border border-admin-border bg-admin-surface p-5">
          <ImageIcon className="mb-4 text-admin-accent" />
          <p className="text-3xl font-bold">
            {usedCount} / {items.length}
          </p>
          <p className="mt-1 text-sm text-admin-muted">Images In Use</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-admin-border bg-admin-surface">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-admin-border p-6">
          <h2 className="text-xl font-bold">All Media</h2>

          <label className="flex items-center gap-2 rounded-lg border border-admin-border px-3 py-2">
            <Search size={18} className="text-admin-faint" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search images by file name or alt text"
              placeholder="Search files..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-56 bg-transparent text-sm outline-none"
            />
          </label>
        </div>

        {notice && (
          <p
            role="status"
            className="px-6 pt-4 text-sm font-medium text-green-700"
          >
            {notice}
          </p>
        )}

        {visible.length === 0 && (
          <p className="p-10 text-center text-sm text-admin-muted">
            {items.length === 0
              ? "No media files yet. Upload your first image."
              : "No images match your search."}
          </p>
        )}

        <ul className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-4">
          {visible.map((file) => {
            const url = getMediaUrl(file.id, items);
            const used = file.usedIn.length > 0;

            return (
              <li key={file.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(file.id)}
                  aria-label={`Open details for ${file.originalFileName}`}
                  className="block w-full overflow-hidden rounded-xl border border-admin-border text-left transition hover:border-admin-faint"
                >
                  <span className="relative flex h-44 items-center justify-center bg-admin-bg">
                    {url && (
                      <Image
                        src={url}
                        alt={file.altText ?? ""}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    )}
                    <span
                      className={`absolute right-2 top-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        used
                          ? "bg-amber-100 text-amber-900"
                          : "bg-admin-surface text-admin-muted"
                      }`}
                    >
                      {used ? "In use" : "Unused"}
                    </span>
                  </span>

                  <span className="block min-w-0 space-y-1 p-4">
                    <span className="block truncate text-sm font-semibold">
                      {file.originalFileName}
                    </span>
                    <span className="block text-xs text-admin-muted">
                      {formatName(file)} · {formatBytes(file.fileSizeBytes)}
                    </span>
                    {file.altText && (
                      <span className="block truncate text-xs text-admin-muted">
                        Alt: {file.altText}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload an image"
      >
        <MediaUploadForm
          idPrefix="library-upload"
          onUploaded={(asset) => {
            // The new image is unused until a section, the logo, etc. picks it.
            setItems((previous) => [{ ...asset, usedIn: [] }, ...previous]);
            setUploadOpen(false);
            setNotice(`“${asset.originalFileName}” was uploaded.`);
          }}
        />
      </Modal>

      <MediaDetailsDialog
        asset={selected}
        onClose={() => setSelectedId(null)}
        onChanged={(asset) =>
          setItems((previous) =>
            previous.map((item) => (item.id === asset.id ? asset : item)),
          )
        }
        onDeleted={(id) => {
          setItems((previous) => previous.filter((item) => item.id !== id));
          setNotice("The image was deleted.");
        }}
      />
    </div>
  );
}
