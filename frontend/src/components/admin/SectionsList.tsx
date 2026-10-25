"use client";

import {
  useState,
  useTransition,
  type DragEvent,
  type MouseEvent,
} from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, GripVertical, Pencil } from "lucide-react";
import StickyActionBar from "@/components/admin/StickyActionBar";

import { saveSections } from "@/app/admin/sections/actions";
import SectionPreviewPanel from "@/components/admin/preview/SectionPreviewPanel";
import { sectionDescriptions } from "@/lib/sectionDescriptions";
import type { ApiSection } from "@/types/apiSections";

type Filter = "all" | "visible" | "hidden";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "visible", label: "Visible" },
  { value: "hidden", label: "Hidden" },
];

const arrowButton =
  "shrink-0 rounded-md px-1.5 py-0.5 text-admin-muted transition hover:bg-admin-bg disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent";

const controlButton =
  "shrink-0 rounded-lg p-1.5 text-admin-muted transition hover:bg-admin-bg disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent";

// Controls inside a card must not trigger the card's own click (which opens the preview).
function stop(event: MouseEvent) {
  event.stopPropagation();
}

export default function SectionsList({ sections }: { sections: ApiSection[] }) {
  const [items, setItems] = useState(sections);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const selected = items.find((section) => section.id === selectedId) ?? null;

  const visibleCount = items.filter((section) => section.isVisible).length;
  const counts: Record<Filter, number> = {
    all: items.length,
    visible: visibleCount,
    hidden: items.length - visibleCount,
  };

  const hasChanges = items.some(
    (section, index) =>
      section.id !== sections[index]?.id ||
      section.isVisible !== sections[index]?.isVisible,
  );

  // Keep each section's real position in the full order, even when filtered.
  const cards = items
    .map((section, index) => ({ section, position: index + 1 }))
    .filter(({ section }) =>
      filter === "all" ? true : (filter === "visible") === section.isVisible,
    );

  // Moving is only meaningful against the full order, not a filtered subset.
  const canReorder = filter === "all";

  function handleSave() {
    setSaveError(null);
    setSaved(false);

    startSaving(async () => {
      const result = await saveSections(
        items.map(({ id, isVisible }) => ({ id, isVisible })),
      );

      if (result.ok) {
        setSaved(true);
      } else {
        setSaveError(result.message);
      }
    });
  }

  function toggleVisibility(id: string) {
    setItems((previous) =>
      previous.map((section) =>
        section.id === id
          ? { ...section, isVisible: !section.isVisible }
          : section,
      ),
    );
  }

  function moveItem(fromIndex: number, toIndex: number) {
    setItems((previous) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= previous.length ||
        toIndex >= previous.length
      ) {
        return previous;
      }

      const next = [...previous];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);

      return next;
    });
  }

  function endDrag() {
    setDraggedId(null);
    setOverId(null);
  }

  // Only the grip starts a drag, so the drag image is set to the whole card.
  function handleDragStart(event: DragEvent, id: string) {
    event.dataTransfer.effectAllowed = "move";
    // Firefox only starts a drag when some data is set.
    event.dataTransfer.setData("text/plain", id);

    const card = event.currentTarget.closest("li");

    if (card) {
      const box = card.getBoundingClientRect();

      event.dataTransfer.setDragImage(
        card,
        event.clientX - box.left,
        event.clientY - box.top,
      );
    }

    setDraggedId(id);
  }

  function handleDrop(event: DragEvent, targetId: string) {
    event.preventDefault();

    if (draggedId) {
      moveItem(
        items.findIndex((section) => section.id === draggedId),
        items.findIndex((section) => section.id === targetId),
      );
    }

    endDrag();
  }

  return (
    <>
      <div
        className={`flex flex-col transition-[margin] duration-300 sm:min-h-[calc(100svh-4rem-3rem)] lg:min-h-[calc(100svh-4rem-5rem)] ${
          selected ? "lg:mr-[calc(40vw-1.5rem)]" : ""
        }`}
      >
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Website Sections{" "}
              <span className="text-lg font-semibold text-admin-muted">
                ({items.length})
              </span>
            </h1>

            <p className="mt-1 text-sm text-admin-muted">
              Click a card to preview it. Drag cards or use the arrows to
              reorder.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter sections"
            className="flex rounded-lg border border-admin-border bg-admin-surface p-1 text-sm"
          >
            {filters.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={filter === value}
                onClick={() => setFilter(value)}
                className={`rounded-md px-3 py-1.5 font-medium transition ${
                  filter === value
                    ? "bg-amber-400 text-slate-950"
                    : "text-admin-muted hover:text-admin-text"
                }`}
              >
                {label}
                <span className="ml-1.5 text-xs opacity-70">
                  {counts[value]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {!canReorder && (
          <p className="mb-3 text-xs text-admin-muted">
            Show all sections to reorder them.
          </p>
        )}

        {cards.length === 0 && (
          <p className="rounded-xl border border-admin-border bg-admin-surface px-6 py-10 text-center text-sm text-admin-muted">
            No sections available.
          </p>
        )}

        <ul
          className={`grid grid-cols-1 gap-4 sm:flex-1 sm:auto-rows-fr sm:grid-cols-2 ${
            selected ? "lg:grid-cols-1" : "xl:grid-cols-3"
          }`}
        >
          {cards.map(({ section, position }) => {
            const isSelected = section.id === selectedId;
            const isDragged = section.id === draggedId;
            const isDropTarget =
              section.id === overId && draggedId !== null && !isDragged;

            return (
              <li
                key={section.id}
                onClick={() => setSelectedId(isSelected ? null : section.id)}
                onDragOver={(event) => {
                  if (draggedId) {
                    event.preventDefault();
                    setOverId(section.id);
                  }
                }}
                onDrop={(event) => handleDrop(event, section.id)}
                className={`flex min-h-16 cursor-pointer items-center gap-2 rounded-xl border bg-admin-surface px-3 py-2.5 shadow-sm transition ${
                  isSelected
                    ? "border-amber-400 ring-1 ring-amber-400/40"
                    : "border-admin-border hover:border-admin-faint"
                } ${isDragged ? "opacity-40" : ""} ${
                  isDropTarget
                    ? "border-dashed border-amber-400 bg-amber-50"
                    : ""
                }`}
              >
                {/* Drag handle: dragging only starts from here, not from the rest of the card. */}
                <span
                  draggable={canReorder}
                  onDragStart={(event) => handleDragStart(event, section.id)}
                  onDragEnd={endDrag}
                  onClick={stop}
                  title={canReorder ? "Drag to reorder" : undefined}
                  className={`-mx-1 shrink-0 rounded-md p-1 ${
                    canReorder
                      ? "cursor-grab text-admin-faint hover:bg-admin-bg hover:text-admin-muted active:cursor-grabbing"
                      : "text-admin-border"
                  }`}
                >
                  <GripVertical size={16} aria-hidden="true" />
                </span>

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-admin-bg text-sm font-bold text-admin-muted">
                  {position}
                </span>

                {/* A real button so the preview is also reachable with the keyboard. */}
                <button
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`Preview ${section.name}`}
                  className="min-w-0 flex-1 text-left"
                >
                  <span
                    className={`line-clamp-2 block text-[15px] leading-tight font-semibold ${
                      section.isVisible ? "" : "text-admin-muted"
                    }`}
                  >
                    {section.name}
                  </span>

                  <span className="mt-0.5 line-clamp-2 block text-xs text-admin-muted">
                    {sectionDescriptions[section.type] ??
                      `${section.type} section`}
                  </span>
                </button>

                <div className="flex shrink-0 items-center">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={section.isVisible}
                    aria-label={`${section.name}: visible on the website`}
                    onClick={(event) => {
                      stop(event);
                      toggleVisibility(section.id);
                    }}
                    title={
                      section.isVisible
                        ? "Shown on the website. Click to hide it."
                        : "Hidden from the website. Click to show it."
                    }
                    className="flex w-11 shrink-0 flex-col items-center gap-1 rounded-lg px-1 py-1 transition hover:bg-admin-bg"
                  >
                    <span
                      className={`relative h-5 w-9 rounded-full transition-colors ${
                        section.isVisible ? "bg-green-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                          section.isVisible ? "translate-x-4" : ""
                        }`}
                      />
                    </span>

                    <span
                      className={`text-[10px] leading-none font-medium ${
                        section.isVisible
                          ? "text-green-700"
                          : "text-admin-muted"
                      }`}
                    >
                      {section.isVisible ? "Visible" : "Hidden"}
                    </span>
                  </button>

                  <div className="flex shrink-0 flex-col">
                    <button
                      type="button"
                      onClick={(event) => {
                        stop(event);
                        moveItem(position - 1, position - 2);
                      }}
                      disabled={!canReorder || position === 1}
                      aria-label={`Move ${section.name} up`}
                      title="Move up"
                      className={arrowButton}
                    >
                      <ArrowUp size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        stop(event);
                        moveItem(position - 1, position);
                      }}
                      disabled={!canReorder || position === items.length}
                      aria-label={`Move ${section.name} down`}
                      title="Move down"
                      className={arrowButton}
                    >
                      <ArrowDown size={17} />
                    </button>
                  </div>

                  <Link
                    href={`/admin/content?section=${encodeURIComponent(section.type)}`}
                    onClick={stop}
                    aria-label={`Edit ${section.name}`}
                    title="Edit content"
                    className={controlButton}
                  >
                    <Pencil size={18} />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>

        <StickyActionBar
          className="mt-4"
          visible={hasChanges || saved}
          saving={isSaving}
          saveDisabled={!hasChanges}
          resetDisabled={!hasChanges}
          onReset={() => {
            setItems(sections);
            setSaveError(null);
          }}
          onSave={handleSave}
          message={
            saveError ? (
              <p role="alert" className="text-red-700">
                {saveError}
              </p>
            ) : hasChanges ? (
              <p className="text-amber-700">
                You have unsaved visibility and order changes.
              </p>
            ) : (
              <p className="text-green-700">
                Changes saved. The website now uses this order and visibility.
              </p>
            )
          }
        />
      </div>

      <SectionPreviewPanel
        section={selected}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
}
