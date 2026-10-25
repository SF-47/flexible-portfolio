import { useEffect, useMemo, useRef, useState } from "react";
import { Shapes, X } from "lucide-react";

import { canonicalIconName, iconNames, resolveIcon } from "@/lib/icons";

const PAGE_SIZE = 120;

// A searchable grid of every Lucide icon. Loaded lazily (see IconField) because it
// imports the whole icon library.
export default function IconPickerDialog({
  open,
  value,
  onSelect,
  onClose,
}: {
  open: boolean;
  value: string;
  onSelect: (name: string) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();

    return term
      ? iconNames.filter((name) => name.toLowerCase().includes(term))
      : iconNames;
  }, [query]);

  const selected = canonicalIconName(value);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-label="Choose an icon"
      className="m-auto w-[min(92vw,44rem)] rounded-xl border border-admin-border bg-admin-surface p-0 text-admin-text backdrop:bg-slate-950/50"
    >
      {open && (
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Choose an icon</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-2 text-admin-muted hover:bg-admin-bg"
            >
              <X size={20} />
            </button>
          </div>

          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder={`Search ${iconNames.length} icons…`}
            aria-label="Search icons"
            className="w-full rounded-lg border border-admin-border bg-admin-subtle px-4 py-3 text-sm"
          />

          {matches.length === 0 ? (
            <p className="text-sm text-admin-muted">
              No icons match “{query}”.
            </p>
          ) : (
            <ul className="grid max-h-96 grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-6">
              {matches.slice(0, visible).map((name) => {
                const Icon = resolveIcon(name, Shapes);

                return (
                  <li key={name}>
                    <button
                      type="button"
                      onClick={() => onSelect(name)}
                      aria-pressed={name === selected}
                      title={name}
                      className={`flex h-20 w-full flex-col items-center justify-center gap-1 rounded-lg border px-1 text-[10px] ${
                        name === selected
                          ? "border-amber-400 bg-amber-400/10 ring-2 ring-amber-400/40"
                          : "border-admin-border hover:bg-admin-bg"
                      }`}
                    >
                      <Icon size={22} aria-hidden="true" />
                      <span className="w-full truncate">{name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {matches.length > visible && (
            <button
              type="button"
              onClick={() => setVisible((previous) => previous + PAGE_SIZE)}
              className="text-sm font-semibold text-amber-700 hover:underline"
            >
              Show more ({matches.length - visible} left)
            </button>
          )}
        </div>
      )}
    </dialog>
  );
}
