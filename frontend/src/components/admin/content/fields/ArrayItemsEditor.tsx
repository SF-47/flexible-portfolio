import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import type { Item } from "@/components/admin/content/forms/types";

const smallButton =
  "inline-flex items-center gap-1 rounded-lg border border-admin-border px-2.5 py-1.5 text-xs font-semibold hover:bg-admin-bg disabled:cursor-not-allowed disabled:opacity-40";

// A list of collapsible cards. With fixed set, the number of items cannot change
// (testimonials, FAQ): there are no add, remove or reorder controls.
export default function ArrayItemsEditor({
  label,
  items,
  onChange,
  createItem,
  itemTitle,
  renderItem,
  itemName = "item",
  fixed = false,
  min = 1,
  max,
}: {
  label: string;
  items: Item[];
  onChange: (items: Item[]) => void;
  createItem: (index: number) => Item;
  itemTitle: (item: Item, index: number) => string;
  renderItem: (
    item: Item,
    update: (field: string, value: unknown) => void,
  ) => ReactNode;
  itemName?: string;
  fixed?: boolean;
  min?: number;
  max: number;
}) {
  function updateItem(index: number, field: string, value: unknown) {
    onChange(
      items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  }

  function move(index: number, offset: -1 | 1) {
    const next = [...items];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">
        {label} ({items.length}/{max})
      </h3>

      {items.map((item, index) => (
        <details
          key={index}
          className="rounded-lg border border-admin-border bg-admin-subtle"
        >
          <summary className="cursor-pointer truncate px-4 py-3 text-sm font-medium">
            {index + 1}. {itemTitle(item, index) || `New ${itemName}`}
          </summary>

          <div className="space-y-4 border-t border-admin-border p-4">
            {renderItem(item, (field, value) =>
              updateItem(index, field, value),
            )}

            {!fixed && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className={smallButton}
                >
                  <ArrowUp size={14} /> Up
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                  className={smallButton}
                >
                  <ArrowDown size={14} /> Down
                </button>
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                  disabled={items.length <= min}
                  className={`${smallButton} text-red-700`}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            )}
          </div>
        </details>
      ))}

      {!fixed && (
        <button
          type="button"
          onClick={() => onChange([...items, createItem(items.length)])}
          disabled={items.length >= max}
          className={smallButton}
        >
          <Plus size={14} /> Add {itemName}
        </button>
      )}
    </div>
  );
}
