"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import FieldInput from "@/components/admin/content/FieldInput";

import type { Content } from "./contentJson";
import { emptyItem, type ListDef } from "./sectionForms";

const MAX_ITEMS = 50;

const iconButton =
  "rounded p-1.5 text-admin-muted transition hover:bg-admin-bg disabled:cursor-not-allowed disabled:opacity-30";

// Keyboard users keep their place: after a move the focus follows the item.
function focusLater(id: string) {
  window.requestAnimationFrame(() => document.getElementById(id)?.focus());
}

// Edits an array of items (statistics, team members, FAQ entries, ...) with add,
// remove and reorder controls. Unknown properties of each item are kept.
export default function ItemsEditor({
  list,
  content,
  onChange,
}: {
  list: ListDef;
  content: Content;
  onChange: (content: Content) => void;
}) {
  const stored = content[list.key];
  const items: Content[] = (Array.isArray(stored) ? stored : []).map((item) =>
    typeof item === "object" && item !== null && !Array.isArray(item)
      ? (item as Content)
      : {},
  );

  const name = list.itemName.toLowerCase();

  function setItems(next: Content[]) {
    onChange({ ...content, [list.key]: next });
  }

  function updateItem(index: number, key: string, value: unknown) {
    setItems(
      items.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
  }

  function moveItem(index: number, direction: -1 | 1) {
    const target = index + direction;

    if (target < 0 || target >= items.length) return;

    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];

    setItems(next);

    const edgeReached = direction === -1 ? target === 0 : target === items.length - 1;
    const button = edgeReached ? (direction === -1 ? "down" : "up") : direction === -1 ? "up" : "down";

    focusLater(`${list.key}-${target}-${button}`);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
    focusLater(`${list.key}-add`);
  }

  function addItem() {
    setItems([...items, emptyItem(list, items.length)]);
    focusLater(`${list.key}-${items.length}-${list.fields[0].key}`);
  }

  return (
    <fieldset className="space-y-4">
      <legend className="mb-4 text-base font-bold">{list.title}</legend>

      {items.length === 0 && (
        <p className="text-sm text-admin-muted">No {list.title.toLowerCase()} yet.</p>
      )}

      {items.map((item, index) => {
        const itemLabel =
          list.labelKey && typeof item[list.labelKey] === "string"
            ? (item[list.labelKey] as string)
            : "";

        return (
          <div
            key={index}
            role="group"
            aria-label={`${list.itemName} ${index + 1}`}
            className="space-y-4 rounded-lg border border-admin-border p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="min-w-0 truncate text-sm font-semibold">
                {list.itemName} {index + 1}
                {itemLabel && (
                  <span className="font-normal text-admin-muted"> · {itemLabel}</span>
                )}
              </h3>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  id={`${list.key}-${index}-up`}
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveItem(index, -1)}
                  aria-label={`Move ${name} ${index + 1} up`}
                  className={iconButton}
                >
                  <ArrowUp size={16} />
                </button>

                <button
                  id={`${list.key}-${index}-down`}
                  type="button"
                  disabled={index === items.length - 1}
                  onClick={() => moveItem(index, 1)}
                  aria-label={`Move ${name} ${index + 1} down`}
                  className={iconButton}
                >
                  <ArrowDown size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  aria-label={`Remove ${name} ${index + 1}`}
                  className={`${iconButton} text-red-600 hover:bg-red-50`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {list.fields.map((field) => (
              <FieldInput
                key={field.key}
                id={`${list.key}-${index}-${field.key}`}
                field={field}
                value={item[field.key]}
                onChange={(value) => updateItem(index, field.key, value)}
              />
            ))}
          </div>
        );
      })}

      <button
        id={`${list.key}-add`}
        type="button"
        disabled={items.length >= MAX_ITEMS}
        onClick={addItem}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-admin-border px-4 py-3 text-sm font-semibold hover:bg-admin-bg disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus size={17} />
        Add {list.itemName}
      </button>
    </fieldset>
  );
}
