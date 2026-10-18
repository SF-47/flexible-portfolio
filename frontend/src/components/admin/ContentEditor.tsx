"use client";

import { useState } from "react";
import { Save, ImagePlus, ChevronDown } from "lucide-react";

import PreviewPanel from "@/components/admin/preview/PreviewPanel";
import type { ApiSection } from "@/types/apiSections";

// Pulls the common heading and description out of a section's JSON content.
function readText(section: ApiSection | undefined) {
  const empty = { heading: "", description: "" };

  if (!section) return empty;

  try {
    const content: unknown = JSON.parse(section.contentJson);

    if (typeof content !== "object" || content === null) return empty;

    const { title, description } = content as Record<string, unknown>;

    return {
      heading: typeof title === "string" ? title : "",
      description: typeof description === "string" ? description : "",
    };
  } catch {
    return empty;
  }
}

export default function ContentEditor({
  sections,
  initialType,
}: {
  sections: ApiSection[];
  initialType?: string;
}) {
  // The section chosen on the Sections page (?section=<type>) is loaded first.
  const [selectedType, setSelectedType] = useState(
    sections.some((section) => section.type === initialType)
      ? (initialType ?? "")
      : (sections[0]?.type ?? ""),
  );

  const selected = sections.find((section) => section.type === selectedType);
  const selectedName = selected?.name ?? "Section";
  const { heading, description } = readText(selected);

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-admin-text">
          Content Management
        </h1>
        <p className="mt-2 text-admin-muted">
          Select a website section and preview its appearance.
        </p>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-6">
          <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
            <h2 className="mb-5 text-lg font-bold">Select Section</h2>

            <div className="relative">
              <select
                value={selectedType}
                onChange={(event) => setSelectedType(event.target.value)}
                className="w-full appearance-none rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 pr-10 text-sm font-semibold text-amber-900 outline-none focus:ring-2 focus:ring-amber-400"
              >
                {sections.length === 0 && (
                  <option value="" className="bg-admin-surface text-admin-text">
                    No sections yet
                  </option>
                )}

                {sections.map((section) => (
                  <option
                    key={section.id}
                    value={section.type}
                    className="bg-admin-surface text-admin-text"
                  >
                    {section.name}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-amber-800"
              />
            </div>
          </section>

          <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
            <h2 className="mb-6 text-lg font-bold">{selectedName} Content</h2>

            <div key={selectedType} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Section Heading
                </label>
                <input
                  type="text"
                  readOnly
                  defaultValue={heading}
                  className="w-full rounded-lg border border-admin-border bg-admin-subtle px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Section Description
                </label>
                <textarea
                  rows={5}
                  readOnly
                  defaultValue={description}
                  className="w-full resize-none rounded-lg border border-admin-border bg-admin-subtle px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Section Image
                </label>
                <div className="flex h-28 items-center justify-center rounded-lg border-2 border-dashed border-admin-border bg-admin-subtle">
                  <ImagePlus size={27} className="text-admin-faint" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 py-3 font-semibold text-slate-950">
              <Save size={17} />
              Save Content
            </div>
          </section>
        </div>

        <PreviewPanel
          title={`${selectedName} Preview`}
          description="Preview of the selected website section"
        >
          <div className="rounded-lg bg-admin-surface px-8 py-16">
            {selected ? (
              <>
                <h3 className="text-3xl font-bold">
                  {heading || selectedName}
                </h3>
                {description && (
                  <p className="mt-4 max-w-xl text-admin-muted">
                    {description}
                  </p>
                )}
              </>
            ) : (
              <p className="text-center text-sm text-admin-muted">
                Select a section to preview it.
              </p>
            )}
          </div>
        </PreviewPanel>
      </div>
    </div>
  );
}
