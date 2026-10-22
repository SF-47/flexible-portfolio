"use client";

import { devices, type Device } from "@/components/admin/preview/PreviewFrame";

// Desktop / Tablet / Mobile buttons. "segmented" is the compact group in the
// Sections preview panel; "pills" are the separate buttons in the Content Editor.
export default function DeviceSwitcher({
  value,
  onChange,
  variant,
}: {
  value: Device["id"];
  onChange: (id: Device["id"]) => void;
  variant: "segmented" | "pills";
}) {
  const segmented = variant === "segmented";

  return (
    <div
      role="group"
      aria-label="Preview device"
      className={
        segmented
          ? "flex rounded-lg border border-admin-border bg-admin-bg p-0.5"
          : "flex items-center gap-2"
      }
    >
      {devices.map((item) => {
        const Icon = item.icon;
        const active = item.id === value;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            aria-pressed={active}
            aria-label={`${item.label} preview, ${item.width}px`}
            title={`${item.label} · ${item.width}px`}
            className={`inline-flex items-center gap-1.5 text-xs font-medium transition ${
              segmented ? "rounded-md px-2.5 py-1.5" : "rounded-lg px-3 py-2"
            } ${
              active
                ? "bg-amber-400 text-slate-950"
                : segmented
                  ? "text-admin-muted hover:text-admin-text"
                  : "bg-admin-bg text-admin-muted hover:text-admin-text"
            }`}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
