"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Star } from "lucide-react";

import CatalogHeader from "@/components/admin/catalog/CatalogHeader";
import { Thumb } from "@/components/admin/catalog/Thumb";
import ImageField from "@/components/admin/content/fields/ImageField";
import {
  TextareaField,
  TextField,
} from "@/components/admin/content/fields/TextField";
import { MediaContext } from "@/components/admin/content/MediaContext";
import ListRow from "@/components/admin/navigation/ListRow";
import StickyActionBar from "@/components/admin/StickyActionBar";
import {
  MAX_PROJECTS,
  ProjectItemSchema,
  slugify,
} from "@/schemas/catalogSchemas";
import type { MediaAsset } from "@/types/media";
import type { AdminProject } from "@/types/project";

type ProjectRow = {
  key: string;
  id: number | null;
  updatedAt: string | null;
  title: string;
  slug: string;
  description: string;
  fullDescription: string;
  category: string;
  location: string;
  completionDate: string;
  featuredImageId: number | null;
  isFeatured: boolean;
  // A new project's slug follows its title until the admin edits the slug. The slug of
  // an existing project is never changed automatically.
  slugTouched: boolean;
};

function toRows(items: AdminProject[]): ProjectRow[] {
  return items.map((item) => ({
    key: `saved-${item.id}`,
    id: item.id,
    updatedAt: item.updatedAt,
    title: item.title,
    slug: item.slug,
    description: item.description ?? "",
    fullDescription: item.fullDescription ?? "",
    category: item.category ?? "",
    location: item.location ?? "",
    completionDate: item.completionDate ?? "",
    featuredImageId: item.featuredImageId,
    isFeatured: item.isFeatured,
    slugTouched: true,
  }));
}

// The key and the slug flag are only for the editor; they are never sent to the API.
function comparable(rows: ProjectRow[]) {
  return rows.map((row) => {
    const { key: _key, slugTouched: _touched, ...rest } = row;
    void _key;
    void _touched;

    return rest;
  });
}

function payload(row: ProjectRow) {
  const { key: _key, slugTouched: _touched, ...rest } = row;
  void _key;
  void _touched;
  const blank = (value: string) => (value.trim() === "" ? null : value.trim());

  return {
    ...rest,
    title: row.title.trim(),
    slug: row.slug.trim(),
    description: blank(row.description),
    fullDescription: blank(row.fullDescription),
    category: blank(row.category),
    location: blank(row.location),
    completionDate: row.completionDate === "" ? null : row.completionDate,
  };
}

const fieldNames: Record<string, string> = {
  title: "Title",
  slug: "URL name",
  description: "Short description",
  fullDescription: "Full description",
  category: "Category",
  location: "Location",
  completionDate: "Completion date",
};

function rowError(row: ProjectRow, rows: ProjectRow[]): string | null {
  const result = ProjectItemSchema.safeParse(payload(row));

  if (!result.success) {
    const issue = result.error.issues[0];

    return `${fieldNames[String(issue.path[0])] ?? "This project"}: ${issue.message}.`;
  }

  const duplicate = rows.some(
    (other) => other.key !== row.key && other.slug.trim() === row.slug.trim(),
  );

  return duplicate
    ? `URL name: “${row.slug.trim()}” is already used by another project.`
    : null;
}

const inputClass =
  "w-full rounded-lg border border-admin-border bg-admin-subtle px-4 py-3 text-sm";

export default function ProjectsManager({
  initialProjects,
  initialMedia,
}: {
  initialProjects: AdminProject[];
  initialMedia: MediaAsset[];
}) {
  const [media, setMedia] = useState(initialMedia);
  const [rows, setRows] = useState(() => toRows(initialProjects));
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
    JSON.stringify(comparable(rows)) !== JSON.stringify(comparable(saved));
  const hasErrors = rows.some((row) => rowError(row, rows) !== null);
  const atLimit = rows.length >= MAX_PROJECTS;

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!isDirty) return;

    function warn(event: BeforeUnloadEvent) {
      event.preventDefault();
    }

    window.addEventListener("beforeunload", warn);

    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  function update(key: string, changes: Partial<ProjectRow>) {
    setRows((previous) =>
      previous.map((row) => (row.key === key ? { ...row, ...changes } : row)),
    );
    setFeedback(null);
  }

  function changeTitle(row: ProjectRow, title: string) {
    update(row.key, {
      title,
      ...(row.slugTouched ? {} : { slug: slugify(title) }),
    });
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
        slug: "",
        description: "",
        fullDescription: "",
        category: "",
        location: "",
        completionDate: "",
        featuredImageId: null,
        isFeatured: false,
        slugTouched: false,
      },
    ]);
    setEditingKey(key);
    setFeedback(null);
  }

  function remove(row: ProjectRow) {
    // Deleting a project never deletes the image file it used.
    if (
      !window.confirm(
        `Delete the project “${row.title.trim() || "Untitled"}”? Its page will no longer exist and its image stays in the Media Library. The change is saved when you click Save Changes.`,
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
      const response = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: rows.map(payload), deletedIds }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // Keep every change so nothing typed is lost.
        setFeedback({
          type: "error",
          message: data?.message ?? "Could not save the projects.",
        });
        return;
      }

      const fresh = toRows(data);
      setRows(fresh);
      setSaved(fresh);
      setDeletedIds([]);
      setEditingKey(null);
      setFeedback({ type: "success", message: "Projects saved." });
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
          title="Project Cards"
          description="Add, edit, reorder and feature the projects shown on your website. Drag a row to reorder it."
          count={rows.length}
          max={MAX_PROJECTS}
        />

        <section className="rounded-xl border border-admin-border bg-admin-surface">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-admin-border p-6">
            <h2 className="text-xl font-bold">Projects</h2>

            <button
              type="button"
              onClick={add}
              disabled={isSaving || atLimit}
              className="flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={17} />
              Add Project
            </button>
          </div>

          {atLimit && (
            <p className="border-b border-admin-border px-6 py-3 text-sm text-admin-muted">
              You have reached the maximum of {MAX_PROJECTS} projects. Delete
              one to add another.
            </p>
          )}

          {rows.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-admin-muted">
              No projects yet. Click “Add Project”.
            </p>
          ) : (
            <ul className="divide-y divide-admin-border">
              {rows.map((row, index) => (
                <ListRow
                  key={row.key}
                  listId="projects"
                  name={`${row.title || "new"} project`}
                  index={index}
                  count={rows.length}
                  disabled={isSaving}
                  isVisible
                  extraActions={
                    <button
                      type="button"
                      onClick={() =>
                        update(row.key, { isFeatured: !row.isFeatured })
                      }
                      disabled={isSaving}
                      aria-pressed={row.isFeatured}
                      aria-label={`${row.title || "New"} project: ${row.isFeatured ? "featured" : "not featured"}. Click to change.`}
                      className={`mx-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium disabled:opacity-40 ${
                        row.isFeatured
                          ? "bg-amber-100 text-amber-900"
                          : "bg-admin-bg text-admin-muted hover:bg-admin-border"
                      }`}
                    >
                      <Star
                        size={13}
                        fill={row.isFeatured ? "currentColor" : "none"}
                        aria-hidden="true"
                      />
                      {row.isFeatured ? "Featured" : "Not featured"}
                    </button>
                  }
                  editing={editingKey === row.key}
                  onToggleEdit={() =>
                    setEditingKey(editingKey === row.key ? null : row.key)
                  }
                  onMove={move}
                  onDelete={() => remove(row)}
                  error={rowError(row, rows)}
                  summary={
                    <div className="flex min-w-0 items-center gap-4">
                      <Thumb
                        mediaId={row.featuredImageId}
                        alt={row.title || "Project image"}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">
                          {row.title || "Untitled project"}
                        </p>
                        <p className="truncate text-sm text-admin-muted">
                          {[row.category, row.location]
                            .filter(Boolean)
                            .join(" · ") || "No category or location"}
                        </p>
                        <p className="truncate text-xs text-admin-faint">
                          /projects/{row.slug || "…"}
                        </p>
                      </div>
                    </div>
                  }
                >
                  <TextField
                    label="Title"
                    value={row.title}
                    onChange={(title) => changeTitle(row, title)}
                  />

                  <div>
                    <label
                      htmlFor={`slug-${row.key}`}
                      className="mb-2 block text-sm font-medium"
                    >
                      URL name
                    </label>
                    <input
                      id={`slug-${row.key}`}
                      type="text"
                      value={row.slug}
                      onChange={(event) =>
                        update(row.key, {
                          slug: event.target.value.toLowerCase(),
                          slugTouched: true,
                        })
                      }
                      className={inputClass}
                    />
                    <p className="mt-1 text-xs text-admin-muted">
                      The project page address: /projects/
                      {row.slug || "your-project"}.{" "}
                      {row.id !== null
                        ? "Changing it breaks links that use the old address."
                        : "It is suggested from the title."}
                    </p>
                  </div>

                  <TextareaField
                    label="Short description (optional)"
                    rows={3}
                    value={row.description}
                    onChange={(description) => update(row.key, { description })}
                  />
                  <TextareaField
                    label="Full description (optional)"
                    rows={6}
                    value={row.fullDescription}
                    onChange={(fullDescription) =>
                      update(row.key, { fullDescription })
                    }
                  />
                  <TextField
                    label="Category (optional)"
                    value={row.category}
                    onChange={(category) => update(row.key, { category })}
                  />
                  <TextField
                    label="Location (optional)"
                    value={row.location}
                    onChange={(location) => update(row.key, { location })}
                  />

                  <div>
                    <label
                      htmlFor={`date-${row.key}`}
                      className="mb-2 block text-sm font-medium"
                    >
                      Completion date (optional)
                    </label>
                    <input
                      id={`date-${row.key}`}
                      type="date"
                      value={row.completionDate}
                      onChange={(event) =>
                        update(row.key, { completionDate: event.target.value })
                      }
                      className={inputClass}
                    />
                  </div>

                  <ImageField
                    label="Featured image (optional)"
                    value={row.featuredImageId}
                    onChange={(featuredImageId) =>
                      update(row.key, { featuredImageId })
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
