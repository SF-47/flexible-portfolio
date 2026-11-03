"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// The icon library is large, so these load on demand and never reach the public site.
const IconGlyph = dynamic(() => import("./IconGlyph"), {
  ssr: false,
  loading: () => <span className="inline-block h-5 w-5" />,
});
const IconPickerDialog = dynamic(() => import("./IconPickerDialog"), {
  ssr: false,
});

export default function IconField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: unknown;
  onChange: (name: string) => void;
}) {
  const name = typeof value === "string" ? value : "";
  const [open, setOpen] = useState(false);
  const [wasOpened, setWasOpened] = useState(false);

  return (
    <div>
      <span className="mb-2 block text-sm font-medium">{label}</span>

      <button
        type="button"
        onClick={() => {
          setWasOpened(true);
          setOpen(true);
        }}
        className="flex w-full items-center gap-3 rounded-lg border border-admin-border bg-admin-subtle px-4 py-3 text-left text-sm hover:bg-admin-bg"
      >
        {name && <IconGlyph name={name} />}
        <span className={name ? "" : "text-admin-muted"}>
          {name || "Choose an icon"}
        </span>
      </button>

      {wasOpened && (
        <IconPickerDialog
          open={open}
          value={name}
          onSelect={(selected) => {
            onChange(selected);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
