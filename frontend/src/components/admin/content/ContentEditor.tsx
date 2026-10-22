"use client";

import { useEffect, useState, useTransition } from "react";
import { ChevronDown, RotateCcw, Save } from "lucide-react";

import { saveSectionContent } from "@/app/admin/content/actions";
import { MediaContext } from "@/components/admin/content/MediaContext";
import ItemsEditor from "@/components/admin/content/ItemsEditor";
import TextFieldsEditor from "@/components/admin/content/TextFieldsEditor";
import {
  parseContent,
  sameContent,
  type Content,
} from "@/components/admin/content/contentJson";
import {
  emptyContent,
  sectionForms,
} from "@/components/admin/content/sectionForms";
import DeviceSwitcher from "@/components/admin/preview/DeviceSwitcher";
import {
  devices,
  PreviewFrame,
  type Device,
} from "@/components/admin/preview/PreviewFrame";
import { sectionSchemas } from "@/schemas/sectionSchemas";
import type { ApiSection } from "@/types/apiSections";
import type { MediaAsset } from "@/types/media";

// The last saved version of a section. updatedAt is sent back with every save so the
// API can refuse to overwrite a change made somewhere else.
type Baseline = { contentJson: string; updatedAt: string };

type Feedback = { sectionId: string; ok: boolean; message: string };

export default function ContentEditor({
  sections,
  media,
  initialType,
}: {
  sections: ApiSection[];
  media: MediaAsset[];
  initialType?: string;
}) {
  const [selectedType, setSelectedType] = useState(
    sections.some((section) => section.type === initialType)
      ? (initialType ?? "")
      : (sections[0]?.type ?? ""),
  );
  const [deviceId, setDeviceId] = useState<Device["id"]>("desktop");

  // Saved content per section id. It starts as what the server sent and moves
  // forward each time a save succeeds.
  const [baselines, setBaselines] = useState<Record<string, Baseline>>(() =>
    Object.fromEntries(
      sections.map((section) => [
        section.id,
        { contentJson: section.contentJson, updatedAt: section.updatedAt },
      ]),
    ),
  );

  // Unsaved edits per section id. Switching sections keeps them.
  const [drafts, setDrafts] = useState<Record<string, Content>>({});

  const [mediaList, setMediaList] = useState(media);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSaving, startSaving] = useTransition();

  const selected = sections.find((section) => section.type === selectedType);
  const form = selected ? sectionForms[selected.type] : undefined;
  const baseline = selected ? baselines[selected.id] : undefined;
  const device = devices.find((item) => item.id === deviceId) ?? devices[0];

  const saved = baseline ? parseContent(baseline.contentJson) : null;
  const draft = selected ? (drafts[selected.id] ?? saved) : null;
  const isDirty = selected !== undefined && drafts[selected.id] !== undefined;

  const validation =
    selected && draft ? sectionSchemas[selected.type].safeParse(draft) : null;
  const issues = validation && !validation.success ? validation.error.issues : [];

  const canSave = isDirty && draft !== null && issues.length === 0 && !isSaving;

  // What the iframe shows: the draft while editing, otherwise the saved content.
  const previewJson = draft ? JSON.stringify(draft) : baseline?.contentJson;

  const hasAnyDraft = Object.keys(drafts).length > 0;

  // Ask before the page is closed or reloaded with unsaved edits.
  useEffect(() => {
    if (!hasAnyDraft) return;

    function warn(event: BeforeUnloadEvent) {
      event.preventDefault();
    }

    window.addEventListener("beforeunload", warn);

    return () => window.removeEventListener("beforeunload", warn);
  }, [hasAnyDraft]);

  function changeDraft(next: Content) {
    if (!selected) return;

    const id = selected.id;

    setFeedback(null);

    setDrafts((previous) => {
      const rest = { ...previous };

      // Editing back to the saved content is no longer a change.
      if (saved && sameContent(next, saved)) {
        delete rest[id];
      } else {
        rest[id] = next;
      }

      return rest;
    });
  }

  function resetChanges() {
    if (!selected) return;

    const id = selected.id;

    setFeedback(null);

    setDrafts((previous) => {
      const rest = { ...previous };
      delete rest[id];
      return rest;
    });
  }

  function handleSave() {
    if (!selected || !baseline || !draft || !canSave) return;

    const id = selected.id;
    const contentJson = JSON.stringify(draft);

    setFeedback(null);

    startSaving(async () => {
      const result = await saveSectionContent(
        id,
        contentJson,
        baseline.updatedAt,
      );

      if (result.ok) {
        setBaselines((previous) => ({
          ...previous,
          [id]: {
            contentJson: result.section.contentJson,
            updatedAt: result.section.updatedAt,
          },
        }));

        setDrafts((previous) => {
          const rest = { ...previous };
          delete rest[id];
          return rest;
        });

        setFeedback({ sectionId: id, ok: true, message: "Content saved." });
      } else {
        setFeedback({ sectionId: id, ok: false, message: result.message });
      }
    });
  }

  const currentFeedback =
    feedback && feedback.sectionId === selected?.id ? feedback : null;

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-admin-text">
          Content Management
        </h1>

        <p className="mt-2 text-admin-muted">
          Select a website section, edit its content, and preview the changes.
        </p>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-6">
          {/* Section Selector */}
          <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
            <h2 className="mb-5 text-lg font-bold">Select Section</h2>

            <div className="relative">
              <label htmlFor="content-section" className="sr-only">
                Section to edit
              </label>

              <select
                id="content-section"
                value={selectedType}
                onChange={(event) => {
                  setFeedback(null);
                  setSelectedType(event.target.value);
                }}
                className="w-full appearance-none rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 pr-10 text-sm font-semibold text-amber-900 outline-none focus:ring-2 focus:ring-amber-400"
              >
                {sections.length === 0 && (
                  <option value="">No sections yet</option>
                )}

                {sections.map((section) => (
                  <option key={section.id} value={section.type}>
                    {section.name}
                    {drafts[section.id] ? " (unsaved changes)" : ""}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-amber-800"
              />
            </div>
          </section>

          {/* Content Editor */}
          <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
            <h2 className="mb-6 text-lg font-bold">
              {selected?.name ?? "Section"} Content
            </h2>

            {!selected || !form ? (
              <p className="text-sm text-admin-muted">
                Select a section to edit it.
              </p>
            ) : draft === null ? (
              <div role="alert" className="space-y-3 rounded-lg bg-red-50 p-4">
                <p className="text-sm text-red-700">
                  The saved content of this section is not valid JSON, so it
                  cannot be edited. You can start again from empty content.
                </p>

                <button
                  type="button"
                  onClick={() => changeDraft(emptyContent(form))}
                  className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-100"
                >
                  Start from empty content
                </button>
              </div>
            ) : (
              <MediaContext.Provider
                value={{
                  media: mediaList,
                  onUploaded: (asset) =>
                    setMediaList((previous) => [asset, ...previous]),
                }}
              >
                <fieldset disabled={isSaving} className="min-w-0 space-y-8">
                  <legend className="sr-only">
                    {selected.name} content fields
                  </legend>

                  {form.note && (
                    <p className="rounded-lg bg-admin-subtle p-3 text-sm text-admin-muted">
                      {form.note}
                    </p>
                  )}

                  {form.fields.length > 0 && (
                    <TextFieldsEditor
                      fields={form.fields}
                      content={draft}
                      onChange={changeDraft}
                    />
                  )}

                  {form.lists?.map((list) => (
                    <ItemsEditor
                      key={list.key}
                      list={list}
                      content={draft}
                      onChange={changeDraft}
                    />
                  ))}
                </fieldset>
              </MediaContext.Provider>
            )}

            {/* Validation, status and actions */}
            {selected && draft !== null && (
              <div className="mt-6 space-y-3">
                {issues.length > 0 && (
                  <div
                    role="alert"
                    className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                  >
                    <p className="font-semibold">Fix these before saving:</p>
                    <ul className="mt-1 list-disc pl-5">
                      {issues.slice(0, 5).map((issue, index) => (
                        <li key={index}>
                          {issue.path.length > 0
                            ? `${issue.path.join(" › ")}: `
                            : ""}
                          {issue.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {isDirty && !currentFeedback && (
                  <p className="text-xs text-amber-700">
                    You have unsaved changes.
                  </p>
                )}

                {currentFeedback && (
                  <p
                    role={currentFeedback.ok ? "status" : "alert"}
                    className={`text-sm ${
                      currentFeedback.ok ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {currentFeedback.message}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={resetChanges}
                    disabled={!isDirty || isSaving}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-admin-border px-4 py-3 text-sm font-semibold transition hover:bg-admin-bg disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!canSave}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save size={16} />
                    {isSaving ? "Saving…" : "Save Content"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Real Section Preview */}
        <section className="flex min-h-162.5 min-w-0 flex-col overflow-hidden rounded-xl border border-admin-border bg-admin-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-admin-border px-5 py-4">
            <div>
              <h2 className="font-bold">{selected?.name ?? "Section"} Preview</h2>

              <p className="text-xs text-admin-muted">
                Live preview of your changes, before saving
              </p>
            </div>

            <DeviceSwitcher
              value={deviceId}
              onChange={setDeviceId}
              variant="pills"
            />
          </div>

          <div className="flex min-h-137.5 flex-1 flex-col">
            {selected ? (
              <PreviewFrame
                key={selected.id}
                section={selected}
                device={device}
                draftContentJson={previewJson}
              />
            ) : (
              <p className="p-6 text-sm text-admin-muted">
                Select a section to preview it.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
