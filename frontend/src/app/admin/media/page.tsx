import {
  Upload,
  Search,
  ImageIcon,
  Grid2X2,
  List,
  MoreHorizontal,
  HardDrive,
} from "lucide-react";

import { mockMedia, mockMediaSummary } from "@/components/admin/mockData";

type MediaFile = {
  id: number;
  name: string;
  type: string;
  size: string;
  src: string;
};

const media: MediaFile[] = mockMedia;

export default function MediaPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="mt-2 text-admin-muted">
            Manage website photos, logos, and other assets.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-3 font-semibold">
          <Upload size={18} />
          Upload Media
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-admin-border bg-admin-surface p-5">
          <ImageIcon className="mb-4 text-admin-accent" />
          <p className="text-3xl font-bold">{media.length}</p>
          <p className="mt-1 text-sm text-admin-muted">Total Files</p>
        </div>

        <div className="rounded-xl border border-admin-border bg-admin-surface p-5">
          <HardDrive className="mb-4 text-admin-accent" />
          <p className="text-3xl font-bold">{mockMediaSummary.storageUsed}</p>
          <p className="mt-1 text-sm text-admin-muted">Storage Used</p>
        </div>

        <div className="rounded-xl border border-admin-border bg-admin-surface p-5">
          <ImageIcon className="mb-4 text-admin-accent" />
          <p className="text-3xl font-bold">{mockMediaSummary.format}</p>
          <p className="mt-1 text-sm text-admin-muted">File Format</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-admin-border bg-admin-surface">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-admin-border p-6">
          <h2 className="text-xl font-bold">All Media</h2>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-admin-border px-3 py-2 text-admin-faint">
              <Search size={18} />
              <span className="text-sm">Search files...</span>
            </div>
            <Grid2X2 size={19} className="text-admin-accent" />
            <List size={19} className="text-admin-faint" />
          </div>
        </div>

        {media.length === 0 && (
          <p className="p-10 text-center text-sm text-admin-muted">
            No media files yet.
          </p>
        )}

        <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-4">
          {media.map((file) => (
            <div
              key={file.id}
              className="overflow-hidden rounded-xl border border-admin-border"
            >
              <div className="flex h-44 items-center justify-center bg-admin-bg">
                <img
                  src={file.src}
                  alt={file.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between gap-2 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{file.name}</p>
                  <p className="mt-1 text-xs text-admin-muted">
                    {file.type} · {file.size}
                  </p>
                </div>
                <MoreHorizontal size={20} className="shrink-0 text-admin-faint" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
