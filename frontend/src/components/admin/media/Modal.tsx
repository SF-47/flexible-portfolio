"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

// An accessible dialog on the native <dialog> element: Esc, focus trapping and the
// backdrop work out of the box. Closing is always the caller's decision (onClose).
export default function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;

    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      aria-label={title}
      className={`m-auto max-h-[92vh] ${wide ? "w-[min(94vw,56rem)]" : "w-[min(94vw,40rem)]"} overflow-y-auto rounded-xl border border-admin-border bg-admin-surface p-0 text-admin-text backdrop:bg-slate-950/50`}
    >
      {open && (
        <div className="space-y-5 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="truncate text-lg font-bold">{title}</h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-2 text-admin-muted hover:bg-admin-bg"
            >
              <X size={20} />
            </button>
          </div>

          {children}
        </div>
      )}
    </dialog>
  );
}
