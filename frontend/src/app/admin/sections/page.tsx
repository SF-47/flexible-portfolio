import {
  ArrowDown,
  ArrowUp,
  Eye,
  Plus,
  GripVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import { mockSections } from "@/components/admin/mockData";

type Section = {
  id: string;
  name: string;
  type: string;
  visible: boolean;
};

const sections: Section[] = mockSections;

export default function SectionsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Website Sections</h1>
          <p className="mt-2 text-admin-muted">
            Organize and customize your portfolio sections.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-3 font-semibold text-slate-950">
          <Plus size={18} />
          Add Section
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-surface shadow-sm">
        <div className="border-b border-admin-border px-6 py-5">
          <h2 className="text-lg font-bold">All Sections</h2>
        </div>

        <div className="divide-y divide-admin-border">
          {sections.length === 0 && (
            <p className="px-6 py-10 text-center text-sm text-admin-muted">
              No sections yet.
            </p>
          )}

          {sections.map((section, index) => (
            <div
              key={section.id}
              className="flex flex-wrap items-center justify-between gap-4 px-6 py-5"
            >
              <div className="flex items-center gap-4">
                <GripVertical size={20} className="text-admin-faint" />

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-admin-bg font-semibold text-admin-muted">
                  {index + 1}
                </div>

                <div>
                  <h3 className="font-semibold">{section.name}</h3>
                  <p className="text-sm text-admin-muted">
                    {section.type} Section
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    section.visible
                      ? "bg-green-100 text-green-700"
                      : "bg-admin-bg text-admin-muted"
                  }`}
                >
                  {section.visible ? "Visible" : "Hidden"}
                </span>

                <button
                  aria-label="Edit section"
                  className="rounded-lg p-2 text-admin-muted hover:bg-admin-bg"
                >
                  <Pencil size={18} />
                </button>

                <button
                  aria-label="Toggle visibility"
                  className="rounded-lg p-2 text-admin-muted hover:bg-admin-bg"
                >
                  <Eye size={18} />
                </button>

                <button
                  aria-label="Move section up"
                  className="rounded-lg p-2 text-admin-muted hover:bg-admin-bg"
                >
                  <ArrowUp size={18} />
                </button>

                <button
                  aria-label="Move section down"
                  className="rounded-lg p-2 text-admin-muted hover:bg-admin-bg"
                >
                  <ArrowDown size={18} />
                </button>

                <button
                  aria-label="Delete section"
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
