"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

import CatalogHeader from "@/components/admin/catalog/CatalogHeader";
import { IconBadge, Thumb } from "@/components/admin/catalog/Thumb";
import IconField from "@/components/admin/content/fields/IconField";
import ImageField from "@/components/admin/content/fields/ImageField";
import {
  TextareaField,
  TextField,
} from "@/components/admin/content/fields/TextField";
import { MediaContext } from "@/components/admin/content/MediaContext";
import ListRow from "@/components/admin/navigation/ListRow";
import StickyActionBar from "@/components/admin/StickyActionBar";
import { MAX_SERVICES, ServiceItemSchema } from "@/schemas/catalogSchemas";
import type { AdminCompanyService } from "@/types/companyService";
import type { MediaAsset } from "@/types/media";

type ServiceRow = {
  key: string;
  id: number | null;
  updatedAt: string | null;
  title: string;
  description: string;
  iconName: string | null;
  imageMediaId: number | null;
  isActive: boolean;
};

function toRows(items: AdminCompanyService[]): ServiceRow[] {
  return items.map((item) => ({
    key: `saved-${item.id}`,
    id: item.id,
    updatedAt: item.updatedAt,
    title: item.title,
    description: item.description,
    iconName: item.iconName,
    imageMediaId: item.imageMediaId,
    isActive: item.isActive,
  }));
}

// The key is only for React and drag-and-drop; it is never sent to the API.
function withoutKeys(rows: ServiceRow[]) {
  return rows.map((row) => {
    const { key: _key, ...rest } = row;
    void _key;

    return rest;
  });
}

function rowError(row: ServiceRow): string | null {
  const result = ServiceItemSchema.safeParse(row);

  if (result.success) return null;

  const issue = result.error.issues[0];

  return `${issue.path[0] === "description" ? "Description" : issue.path[0] === "title" ? "Title" : "This service"}: ${issue.message}.`;
}

export default function ServicesManager({
  initialServices,
  initialMedia,
}: {
  initialServices: AdminCompanyService[];
  initialMedia: MediaAsset[];
}) {
  const [media, setMedia] = useState(initialMedia);
  const [rows, setRows] = useState(() => toRows(initialServices));
  const [saved, setSaved] = useState(rows);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const counter = useRef(0);

  const isDirty =
    deletedIds.length > 0 ||
    JSON.stringify(withoutKeys(rows)) !== JSON.stringify(withoutKeys(saved));
  const hasErrors = rows.some((row) => rowError(row) !== null);
  const atLimit = rows.length >= MAX_SERVICES;

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!isDirty) return;

    function warn(event: BeforeUnloadEvent) {
      event.preventDefault();
    }

    window.addEventListener("beforeunload", warn);

    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  function update(key: string, changes: Partial<ServiceRow>) {
    setRows((previous) =>
      previous.map((row) => (row.key === key ? { ...row, ...changes } : row)),
    );
    setFeedback(null);
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= rows.length || from === to) return;

    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setRows(next);
    setFeedback(null);
  }

  function add() {
    counter.current += 1;
    const key = `new-${counter.current}`;

    setRows((previous) => [
      ...previous,
      {
        key,
        id: null,
        updatedAt: null,
        title: "",
        description: "",
        iconName: null,
        imageMediaId: null,
        isActive: true,
      },
    ]);
    setEditingKey(key);
    setFeedback(null);
  }

  function remove(row: ServiceRow) {
    // Deleting a service never deletes the image file it used.
    if (
      !window.confirm(
        `Delete the service “${row.title.trim() || "Untitled"}”? Its image stays in the Media Library. The change is saved when you click Save Changes.`,
      )
    ) {
      return;
    }

    setRows((previous) => previous.filter((item) => item.key !== row.key));
    if (row.id !== null) setDeletedIds((previous) => [...previous, row.id!]);
    setFeedback(null);
  }

  function reset() {
    if (isSaving) return;

    setRows(saved);
    setDeletedIds([]);
    setEditingKey(null);
    setFeedback(null);
  }

  async function save() {
    if (!isDirty || hasErrors || isSaving) return;

    setIsSaving(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: withoutKeys(rows).map((row) => ({
            ...row,
            title: row.title.trim(),
            description: row.description.trim(),
          })),
          deletedIds,
        }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // Keep every change so nothing typed is lost.
        setFeedback({
          type: "error",
          message: data?.message ?? "Could not save the services.",
        });
        return;
      }

      const fresh = toRows(data);
      setRows(fresh);
      setSaved(fresh);
      setDeletedIds([]);
      setEditingKey(null);
      setFeedback({ type: "success", message: "Services saved." });
    } catch {
      setFeedback({
        type: "error",
        message: "Network error. Could not reach the server.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <MediaContext.Provider
      value={{
        media,
        onUploaded: (asset) => setMedia((previous) => [asset, ...previous]),
      }}
    >
      <div className="mx-auto max-w-5xl space-y-8">
        <CatalogHeader
          title="Service Cards"
          description="Add, edit, reorder and hide the services shown on your website. Drag a row to reorder it."
          count={rows.length}
          max={MAX_SERVICES}
        />

        <section className="rounded-xl border border-admin-border bg-admin-surface">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-admin-border p-6">
            <h2 className="text-xl font-bold">Services</h2>

            <button
              type="button"
              onClick={add}
              disabled={isSaving || atLimit}
              className="flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={17} />
              Add Service
            </button>
          </div>

          {atLimit && (
            <p className="border-b border-admin-border px-6 py-3 text-sm text-admin-muted">
              You have reached the maximum of {MAX_SERVICES} services. Delete
              one to add another.
            </p>
          )}

          {rows.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-admin-muted">
              No services yet. Click “Add Service”.
            </p>
          ) : (
            <ul className="divide-y divide-admin-border">
              {rows.map((row, index) => (
                <ListRow
                  key={row.key}
                  listId="services"
                  name={`${row.title || "new"} service`}
                  index={index}
                  count={rows.length}
                  disabled={isSaving}
                  isVisible={row.isActive}
                  onToggleVisible={() =>
                    update(row.key, { isActive: !row.isActive })
                  }
                  editing={editingKey === row.key}
                  onToggleEdit={() =>
                    setEditingKey(editingKey === row.key ? null : row.key)
                  }
                  onMove={move}
                  onDelete={() => remove(row)}
                  error={rowError(row)}
                  summary={
                    <div className="flex min-w-0 items-center gap-4">
                      <IconBadge name={row.iconName} />
                      <Thumb
                        mediaId={row.imageMediaId}
                        alt={row.title || "Service image"}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">
                          {row.title || "Untitled service"}
                        </p>
                        <p className="line-clamp-2 text-sm text-admin-muted">
                          {row.description || "No description yet"}
                        </p>
                        {!row.isActive && (
                          <p className="text-xs font-medium text-amber-700">
                            Hidden — not shown on the website
                          </p>
                        )}
                      </div>
                    </div>
                  }
                >
                  <TextField
                    label="Title"
                    value={row.title}
                    onChange={(title) => update(row.key, { title })}
                  />
                  <TextareaField
                    label="Description"
                    rows={3}
                    value={row.description}
                    onChange={(description) => update(row.key, { description })}
                  />
                  <IconField
                    label="Icon (optional)"
                    value={row.iconName ?? ""}
                    onChange={(iconName) => update(row.key, { iconName })}
                  />
                  <ImageField
                    label="Image (optional)"
                    value={row.imageMediaId}
                    onChange={(imageMediaId) =>
                      update(row.key, { imageMediaId })
                    }
                  />
                </ListRow>
              ))}
            </ul>
          )}
        </section>

        <StickyActionBar
          visible={isDirty || feedback !== null}
          saving={isSaving}
          saveDisabled={!isDirty || hasErrors}
          resetDisabled={!isDirty}
          onReset={reset}
          onSave={save}
          message={
            <>
              {isDirty && (
                <p className="text-amber-700">
                  {hasErrors
                    ? "Fix the highlighted problems before saving."
                    : deletedIds.length > 0
                      ? `You have unsaved changes (${deletedIds.length} to delete).`
                      : "You have unsaved changes."}
                </p>
              )}
              {feedback && (
                <p
                  className={
                    feedback.type === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }
                >
                  {feedback.message}
                </p>
              )}
            </>
          }
        />
      </div>
    </MediaContext.Provider>
  );
}
