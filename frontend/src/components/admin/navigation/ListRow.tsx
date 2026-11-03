"use client";

import type { DragEvent, KeyboardEvent, ReactNode } from "react";
import { ArrowDown, ArrowUp, GripVertical, Pencil, Trash2 } from "lucide-react";

const iconButton =
  "rounded-md p-1.5 text-admin-muted transition hover:bg-admin-bg disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent";

// One row of an editable, reorderable list (navigation links, social links).
// Reordering works by dragging the grip, or by focusing the grip and pressing the
// Up / Down arrow keys. Rows can also show subtle Move up / Move down buttons.
export default function ListRow({
  listId,
  index,
  count,
  disabled,
  summary,
  isVisible,
  onToggleVisible,
  onRemove,
  extraActions,
  editing,
  onMove,
  error,
  children,
  showMoveButtons = true,
  onToggleEdit,
  onDelete,
  compact = false,
  name = "item",
}: {
  listId: string;
  index: number;
  count: number;
  disabled: boolean;
  summary: ReactNode;
  isVisible: boolean;
  // Omit to hide the Visible / Hidden switch.
  onToggleVisible?: () => void;
  // A plain "Remove from Menu" action (the record is kept, only hidden).
  onRemove?: () => void;
  // Extra controls shown before the Edit button (for example a Featured toggle).
  extraActions?: ReactNode;
  editing: boolean;
  onMove: (from: number, to: number) => void;
  error: string | null;
  children?: ReactNode;
  showMoveButtons?: boolean;
  // Omit these to hide the Edit / Delete buttons.
  onToggleEdit?: () => void;
  onDelete?: () => void;
  compact?: boolean;
  // Used in the accessible names of the icon-only buttons.
  name?: string;
}) {
  const dragType = `application/x-row-${listId}`;

  function handleDragStart(event: DragEvent) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(dragType, String(index));

    const row = event.currentTarget.closest("li");

    if (row) event.dataTransfer.setDragImage(row, 20, 20);
  }

  function handleDragOver(event: DragEvent) {
    // Only rows of this same list can be dropped here.
    if (event.dataTransfer.types.includes(dragType)) event.preventDefault();
  }

  function handleDrop(event: DragEvent) {
    const from = Number(event.dataTransfer.getData(dragType));

    if (Number.isInteger(from)) {
      event.preventDefault();
      onMove(from, index);
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    const to =
      event.key === "ArrowUp"
        ? index - 1
        : event.key === "ArrowDown"
          ? index + 1
          : null;

    if (disabled || to === null || to < 0 || to >= count) return;

    event.preventDefault();
    onMove(index, to);
    // The row is re-rendered in its new place; put the focus back on its grip.
    setTimeout(
      () =>
        document
          .querySelector<HTMLElement>(`[data-grip="${listId}-${to}"]`)
          ?.focus(),
      0,
    );
  }

  return (
    <li
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={compact ? "px-4 py-3" : "px-6 py-5"}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <button
            type="button"
            draggable={!disabled}
            onDragStart={handleDragStart}
            onKeyDown={handleKeyDown}
            data-grip={`${listId}-${index}`}
            aria-label={`Reorder item ${index + 1} of ${count}. Drag it, or use the Up and Down arrow keys.`}
            className="cursor-grab text-admin-faint"
          >
            <GripVertical size={20} />
          </button>

          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-admin-bg text-sm font-semibold">
            {index + 1}
          </span>

          <div className="min-w-0 flex-1">{summary}</div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {showMoveButtons && (
            <>
              <button
                type="button"
                onClick={() => onMove(index, index - 1)}
                disabled={disabled || index === 0}
                aria-label={`Move ${name} up`}
                className={iconButton}
              >
                <ArrowUp size={17} />
              </button>
              <button
                type="button"
                onClick={() => onMove(index, index + 1)}
                disabled={disabled || index === count - 1}
                aria-label={`Move ${name} down`}
                className={iconButton}
              >
                <ArrowDown size={17} />
              </button>
            </>
          )}

          {onToggleVisible && (
            <button
              type="button"
              onClick={onToggleVisible}
              disabled={disabled}
              aria-pressed={isVisible}
              aria-label={`${name}: ${isVisible ? "visible" : "hidden"}. Click to change.`}
              className="mx-2 rounded-full bg-admin-bg px-3 py-1 text-xs font-medium text-admin-muted hover:bg-admin-border disabled:opacity-40"
            >
              {isVisible ? "Visible" : "Hidden"}
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              aria-label={`Remove ${name} from the menu`}
              className="rounded-lg border border-admin-border px-3 py-1.5 text-xs font-semibold text-admin-muted hover:bg-admin-bg disabled:opacity-40"
            >
              Remove from Menu
            </button>
          )}

          {extraActions}

          {onToggleEdit && (
            <button
              type="button"
              onClick={onToggleEdit}
              disabled={disabled}
              aria-label={editing ? `Close editor for ${name}` : `Edit ${name}`}
              aria-expanded={editing}
              className={iconButton}
            >
              <Pencil size={18} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={disabled}
              aria-label={`Delete ${name}`}
              className={`${iconButton} text-red-500`}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {editing && children && (
        <div className="mt-5 space-y-4 rounded-lg border border-admin-border bg-admin-subtle p-4">
          {children}
        </div>
      )}
    </li>
  );
}
