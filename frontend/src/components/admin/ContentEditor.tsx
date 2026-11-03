"use client";

import type { ApiSection } from "@/types/apiSections";
import type { SectionType } from "@/types/section";
import { useState } from "react";
import DeviceSwitcher from "@/components/admin/preview/DeviceSwitcher";
import { devices, PreviewFrame } from "@/components/admin/preview/PreviewFrame";
import {
  CatalogContext,
  type CatalogSummary,
} from "@/components/admin/content/CatalogContext";
import { MediaContext } from "@/components/admin/content/MediaContext";
import { LinkTargetsContext } from "@/components/admin/content/LinkTargetsContext";
import Combobox from "@/components/admin/Combobox";
import StickyActionBar from "@/components/admin/StickyActionBar";
import SectionForm from "@/components/admin/content/SectionForm";
import { sectionSchemas } from "@/schemas/sectionSchemas";
import type { MediaAsset } from "@/types/media";

function parseContent(json: string): Record<string, unknown> | null {
  try {
    const value: unknown = JSON.parse(json);

    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return null;
    }

    return value as Record<string, unknown>;
  } catch {
    return null;
  }
}

type Content = Record<string, unknown>;

type Baseline = {
  contentJson: string;
  updatedAt: string;
};

export default function ContentEditor({
  sections,
  media: initialMedia,
  catalog,
}: {
  sections: ApiSection[];
  media: MediaAsset[];
  catalog: CatalogSummary;
}) {
  const [media, setMedia] = useState(initialMedia);
  // Bumped after an upload so the preview iframe reloads and knows the new image.
  const [mediaVersion, setMediaVersion] = useState(0);

  const [selectedType, setSelectedType] = useState<SectionType | "">(
    sections[0]?.type ?? "",
  );
  const [baselines, setBaselines] = useState<Record<string, Baseline>>(() =>
    Object.fromEntries(
      sections.map((section) => [
        section.id,
        {
          contentJson: section.contentJson,
          updatedAt: section.updatedAt,
        },
      ]),
    ),
  );

  const [drafts, setDrafts] = useState<Record<string, Content>>({});

  const selected = sections.find((section) => section.type === selectedType);

  const baseline = selected ? baselines[selected.id] : undefined;

  const saved = baseline ? parseContent(baseline.contentJson) : null;

  const draft = selected ? (drafts[selected.id] ?? saved) : null;

  const isDirty =
    draft !== null &&
    saved !== null &&
    JSON.stringify(draft) !== JSON.stringify(saved);
  const validation =
    selected && draft ? sectionSchemas[selected.type].safeParse(draft) : null;
  const isValid = validation?.success === true;
  const firstIssue =
    validation && !validation.success ? validation.error.issues[0] : null;

  const [isSaving, setIsSaving] = useState(false);
  // Feedback belongs to the section it was produced for.
  const [feedback, setFeedback] = useState<{
    sectionId: string;
    type: "success" | "error";
    message: string;
  } | null>(null);
  const visibleFeedback =
    feedback && selected && feedback.sectionId === selected.id
      ? feedback
      : null;
  const [deviceId, setDeviceId] = useState("desktop");
  const device = devices.find((item) => item.id === deviceId) ?? devices[0];

  // Changes one top-level property; every other property is kept as it is.
  function updateValue(field: string, value: unknown) {
    if (!selected) return;

    const sectionId = selected.id;

    setDrafts((previous) => {
      const current = previous[sectionId] ?? saved;
      if (!current) return previous;

      const next = { ...current, [field]: value };
      const updated = { ...previous };

      if (saved && JSON.stringify(next) === JSON.stringify(saved)) {
        delete updated[sectionId];
      } else {
        updated[sectionId] = next;
      }

      return updated;
    });
  }

  function updateField(field: string, value: string) {
    updateValue(field, value);
  }

  function resetChanges() {
    if (!selected) return;

    const sectionId = selected.id;

    setDrafts((previous) => {
      const updated = { ...previous };
      delete updated[sectionId];
      return updated;
    });
    setFeedback(null);
  }

  async function handleSave() {
    if (!selected || !draft || !baseline) return;
    if (!isDirty || !isValid || isSaving) return;

    const sectionId = selected.id;
    const sentJson = JSON.stringify(draft);

    setIsSaving(true);
    setFeedback(null);

    try {
      const response = await fetch(`/api/admin/sections/${sectionId}/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentJson: sentJson,
          expectedUpdatedAt: baseline.updatedAt,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // Keep the draft; a 409 is never retried automatically.
        setFeedback({
          sectionId,
          type: "error",
          message: data?.message ?? "Could not save the content.",
        });
        return;
      }

      setBaselines((previous) => ({
        ...previous,
        [sectionId]: {
          contentJson: data.contentJson,
          updatedAt: data.updatedAt,
        },
      }));

      // Only drop the draft if it is still what we sent; edits made while the
      // request was pending stay as unsaved changes.
      setDrafts((previous) => {
        if (JSON.stringify(previous[sectionId]) !== sentJson) return previous;

        const updated = { ...previous };
        delete updated[sectionId];
        return updated;
      });
      setFeedback({
        sectionId,
        type: "success",
        message: "Content saved successfully.",
      });
    } catch {
      setFeedback({
        sectionId,
        type: "error",
        message: "Network error. Could not reach the server.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const previewJson = draft ? JSON.stringify(draft) : undefined;

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
      <div className="min-w-0 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-admin-text">
            Content Management
          </h1>
          <p className="mt-2 text-admin-muted">
            Select a section to manage its content.
          </p>
        </div>

        <section className="max-w-md rounded-xl border border-admin-border bg-admin-surface p-6">
          <h2 className="mb-4 text-lg font-bold">Select Section</h2>

          <Combobox
            ariaLabel="Section"
            value={selectedType}
            onChange={(value) => {
              const next = sections.find((section) => section.type === value);

              if (next) setSelectedType(next.type);
            }}
            options={sections.map((section) => ({
              value: section.type,
              label: section.name,
            }))}
          />
        </section>

        {selected && draft && (
          <LinkTargetsContext.Provider value={sections}>
            <CatalogContext.Provider value={catalog}>
              <MediaContext.Provider
                value={{
                  media,
                  onUploaded: (asset) => {
                    setMedia((previous) => [asset, ...previous]);
                    setMediaVersion((previous) => previous + 1);
                  },
                }}
              >
                <section className="max-w-md space-y-4 rounded-xl border border-admin-border bg-admin-surface p-6">
                  <h2 className="text-lg font-bold">{selected.name} Content</h2>

                  <SectionForm
                    key={selected.id}
                    type={selected.type}
                    draft={draft}
                    updateField={updateField}
                    updateValue={updateValue}
                  />
                </section>
              </MediaContext.Provider>
            </CatalogContext.Provider>
          </LinkTargetsContext.Provider>
        )}

        <StickyActionBar
          className="max-w-md"
          visible={isDirty || visibleFeedback !== null}
          saving={isSaving}
          saveDisabled={!isDirty || !isValid}
          resetDisabled={!isDirty}
          saveLabel="Save Content"
          onReset={resetChanges}
          onSave={handleSave}
          message={
            <>
              {isDirty && firstIssue && (
                <p role="alert" className="text-red-700">
                  Cannot save yet: {firstIssue.path.join(" › ") || "content"} —{" "}
                  {firstIssue.message}
                </p>
              )}
              {isDirty && !firstIssue && (
                <p className="text-amber-700">You have unsaved changes.</p>
              )}
              {visibleFeedback && (
                <p
                  className={
                    visibleFeedback.type === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }
                >
                  {visibleFeedback.message}
                </p>
              )}
            </>
          }
        />
      </div>

      <section className="flex min-h-[650px] min-w-0 flex-col overflow-hidden rounded-xl border border-admin-border bg-admin-surface xl:sticky xl:top-20 xl:h-[calc(100vh-7rem)]">
        <div className="flex items-center justify-between gap-3 border-b border-admin-border p-4">
          <h2 className="font-bold">{selected?.name ?? "Section"} Preview</h2>

          <DeviceSwitcher
            value={device.id}
            onChange={setDeviceId}
            variant="pills"
          />
        </div>

        <div className="flex min-h-[550px] flex-1 flex-col xl:min-h-0">
          {selected ? (
            <PreviewFrame
              key={`${selected.id}-${mediaVersion}`}
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
  );
}
