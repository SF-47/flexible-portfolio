"use client";

import { useState } from "react";
import { Save, ImagePlus, ChevronDown } from "lucide-react";

import PreviewPanel from "@/components/admin/preview/PreviewPanel";
import { mockContentSections } from "@/components/admin/mockData";

type SectionOption = {
  id: string;
  name: string;
  heading: string;
  description: string;
};

const sections: SectionOption[] = mockContentSections;

export default function ContentPage() {
  const [selectedSection, setSelectedSection] = useState(sections[0]?.id ?? "");

  const selected = sections.find((section) => section.id === selectedSection);
  const selectedName = selected?.name ?? "Section";

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
                value={selectedSection}
                onChange={(event) => setSelectedSection(event.target.value)}
                className="w-full appearance-none rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 pr-10 text-sm font-semibold text-amber-900 outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="" className="bg-admin-surface text-admin-text">
                  {sections.length === 0 ? "No sections yet" : "Select a section"}
                </option>

                {sections.map((section) => (
                  <option
                    key={section.id}
                    value={section.id}
                    className="bg-admin-surface text-admin-text"
                  >
                    {section.name}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-amber-800"
              />
            </div>
          </section>

          <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
            <h2 className="mb-6 text-lg font-bold">{selectedName} Content</h2>

            <div key={selectedSection} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Section Heading
                </label>
                <input
                  type="text"
                  readOnly
                  defaultValue={selected?.heading ?? ""}
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
                  defaultValue={selected?.description ?? ""}
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
                <h3 className="text-3xl font-bold">{selected.heading}</h3>
                <p className="mt-4 max-w-xl text-admin-muted">
                  {selected.description}
                </p>
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
