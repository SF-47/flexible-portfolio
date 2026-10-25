"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export type ComboboxOption = {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  // Extra words matched by the search box.
  keywords?: string;
};

const MAX_HEIGHT = 288;

// A small dropdown for long lists, lists with icons or searchable lists. The options
// scroll inside a height-limited panel that opens upward when there is no room below.
// Short lists should keep using a native <select>.
export default function Combobox({
  id,
  value,
  onChange,
  options,
  placeholder = "Choose…",
  searchable = true,
  disabled = false,
  variant = "field",
  ariaLabel,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  // "button" renders the trigger as a small action button.
  variant?: "field" | "button";
  ariaLabel?: string;
}) {
  const generatedId = useId();
  const triggerId = id ?? `${generatedId}-trigger`;
  const listId = `${generatedId}-list`;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [placement, setPlacement] = useState({
    up: false,
    maxHeight: MAX_HEIGHT,
  });

  const selected = options.find((option) => option.value === value);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();

    if (!text) return options;

    return options.filter((option) =>
      `${option.label} ${option.keywords ?? ""}`.toLowerCase().includes(text),
    );
  }, [options, query]);

  function firstEnabled(list: ComboboxOption[], from = 0, step = 1) {
    for (let i = from; i >= 0 && i < list.length; i += step) {
      if (!list[i].disabled) return i;
    }

    return -1;
  }

  // Open upward when the space below is too small and there is more room above.
  function updatePlacement() {
    const rect = triggerRef.current?.getBoundingClientRect();

    if (!rect) return;

    const below = window.innerHeight - rect.bottom - 12;
    const above = rect.top - 12;
    const up = below < 240 && above > below;

    setPlacement({
      up,
      maxHeight: Math.max(160, Math.min(MAX_HEIGHT, up ? above : below)),
    });
  }

  function show() {
    if (disabled) return;

    updatePlacement();
    setQuery("");
    const index = options.findIndex((option) => option.value === value);
    setActive(index >= 0 ? index : firstEnabled(options));
    setOpen(true);
  }

  function close(refocus: boolean) {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }

  function choose(option: ComboboxOption) {
    if (option.disabled) return;

    onChange(option.value);
    close(true);
  }

  // Focus the search box (or the list) when the panel opens.
  useEffect(() => {
    if (!open) return;

    (inputRef.current ?? listRef.current)?.focus();
  }, [open]);

  // Keep the active option visible inside the scrolling panel.
  useEffect(() => {
    if (!open) return;

    document
      .getElementById(`${listId}-${active}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active, listId]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);

    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  // Keep the panel inside the viewport when the page scrolls or is resized.
  useEffect(() => {
    if (!open) return;

    const update = () => updatePlacement();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  function move(step: 1 | -1) {
    const next = firstEnabled(filtered, active + step, step);

    if (next >= 0) setActive(next);
  }

  function onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        move(-1);
        break;
      case "Home":
        if (!searchable) {
          event.preventDefault();
          setActive(Math.max(0, firstEnabled(filtered)));
        }
        break;
      case "End":
        if (!searchable) {
          event.preventDefault();
          setActive(firstEnabled(filtered, filtered.length - 1, -1));
        }
        break;
      case "Enter":
        event.preventDefault();
        if (filtered[active]) choose(filtered[active]);
        break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        close(true);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  const triggerClass =
    variant === "button"
      ? "flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
      : "flex w-full items-center justify-between gap-3 rounded-lg border border-admin-border bg-admin-surface px-4 py-3 text-left text-sm disabled:opacity-60";

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => (open ? close(false) : show())}
        onKeyDown={(event) => {
          if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
            event.preventDefault();
            show();
          }
        }}
        className={triggerClass}
      >
        <span className="flex min-w-0 items-center gap-2">
          {variant === "field" && selected?.icon}
          <span
            className={`truncate ${
              variant === "field" && !selected ? "text-admin-muted" : ""
            }`}
          >
            {selected?.label ?? placeholder}
          </span>
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`shrink-0 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          onKeyDown={onKeyDown}
          className={`absolute left-0 z-30 flex w-full min-w-56 flex-col overflow-hidden rounded-lg border border-admin-border bg-admin-surface shadow-lg ${
            placement.up ? "bottom-full mb-1" : "top-full mt-1"
          }`}
          style={{ maxHeight: placement.maxHeight }}
        >
          {searchable && (
            <div className="flex items-center gap-2 border-b border-admin-border px-3 py-2">
              <Search
                size={15}
                aria-hidden="true"
                className="text-admin-faint"
              />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={
                  filtered[active] ? `${listId}-${active}` : undefined
                }
                aria-label="Search"
                placeholder="Search…"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          )}

          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={searchable ? -1 : 0}
            aria-activedescendant={
              !searchable && filtered[active]
                ? `${listId}-${active}`
                : undefined
            }
            className="overflow-y-auto py-1 outline-none"
          >
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-admin-muted">
                No matches.
              </li>
            )}

            {filtered.map((option, index) => (
              <li
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={option.value === value}
                aria-disabled={option.disabled}
                onMouseEnter={() => !option.disabled && setActive(index)}
                onClick={() => choose(option)}
                className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2 text-sm ${
                  option.disabled ? "cursor-not-allowed opacity-50" : ""
                } ${index === active ? "bg-admin-subtle" : ""} ${
                  option.value === value ? "font-semibold" : ""
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  {option.icon}
                  <span className="truncate">{option.label}</span>
                </span>
                {option.value === value && (
                  <Check size={15} aria-hidden="true" className="shrink-0" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
