import {
  Upload,
  Search,
  ImageIcon,
  Grid2X2,
  List,
  MoreHorizontal,
  HardDrive,
} from "lucide-react";

const media = [
  {
    id: 1,
    name: "about.jpg",
    type: "JPG Image",
    size: "1.4 MB",
    src: "/images/about.jpg",
  },
  {
    id: 2,
    name: "project-1.jpg",
    type: "JPG Image",
    size: "2.1 MB",
    src: "/images/project-1.jpg",
  },
  {
    id: 3,
    name: "project-2.jpg",
    type: "JPG Image",
    size: "1.8 MB",
    src: "/images/project-2.jpg",
  },
  {
    id: 4,
    name: "project-3.jpg",
    type: "JPG Image",
    size: "2.5 MB",
    src: "/images/project-3.jpg",
  },
];

export default function MediaPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="mt-2 text-slate-500">
            Manage website photos, logos, and other assets.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-3 font-semibold">
          <Upload size={18} />
          Upload Media
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <ImageIcon className="mb-4 text-amber-600" />
          <p className="text-3xl font-bold">{media.length}</p>
          <p className="mt-1 text-sm text-slate-500">Total Files</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <HardDrive className="mb-4 text-amber-600" />
          <p className="text-3xl font-bold">7.8 MB</p>
          <p className="mt-1 text-sm text-slate-500">Storage Used</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <ImageIcon className="mb-4 text-amber-600" />
          <p className="text-3xl font-bold">JPG</p>
          <p className="mt-1 text-sm text-slate-500">File Format</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-6">
          <h2 className="text-xl font-bold">All Media</h2>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-slate-400">
              <Search size={18} />
              <span className="text-sm">Search files...</span>
            </div>
            <Grid2X2 size={19} className="text-amber-600" />
            <List size={19} className="text-slate-400" />
          </div>
        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-4">
          {media.map((file) => (
            <div
              key={file.id}
              className="overflow-hidden rounded-xl border border-slate-200"
            >
              <div className="flex h-44 items-center justify-center bg-slate-100">
                <img
                  src={file.src}
                  alt={file.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between gap-2 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{file.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {file.type} · {file.size}
                  </p>
                </div>
                <MoreHorizontal size={20} className="shrink-0 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
