"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Pencil, X } from "lucide-react";

import DeviceSwitcher from "@/components/admin/preview/DeviceSwitcher";
import {
  devices,
  PreviewFrame,
  type Device,
} from "@/components/admin/preview/PreviewFrame";
import type { ApiSection } from "@/types/apiSections";

export default function SectionPreviewPanel({
  section,
  onClose,
}: {
  section: ApiSection | null;
  onClose: () => void;
}) {
  const open = section !== null;
  const [deviceId, setDeviceId] = useState<Device["id"]>("desktop");

  const device = devices.find((item) => item.id === deviceId) ?? devices[0];

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const previewHref = section
    ? `/admin/preview?section=${encodeURIComponent(section.type)}`
    : "#";

  return (
    <>
      {open && (
        <div
          className="fixed inset-x-0 top-16 bottom-0 z-20 bg-slate-950/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Section preview"
        aria-hidden={!open}
        inert={!open}
        className={`fixed top-16 right-0 bottom-0 z-30 flex w-full flex-col border-l border-admin-border bg-admin-surface shadow-2xl transition-transform duration-300 sm:w-[70vw] lg:w-[40vw] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {section && (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-admin-border px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs font-medium tracking-wide text-admin-muted uppercase">
                  Preview
                </p>
                <h2 className="truncate font-bold">{section.name}</h2>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/content?section=${encodeURIComponent(section.type)}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-950"
                >
                  <Pencil size={15} />
                  Edit Content
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close preview"
                  className="rounded-lg p-2 text-admin-muted transition hover:bg-admin-bg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-b border-admin-border px-4 py-2">
              <DeviceSwitcher
                value={device.id}
                onChange={setDeviceId}
                variant="segmented"
              />

              <a
                href={previewHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-admin-accent"
              >
                Open Full Preview
                <ExternalLink size={14} />
              </a>
            </div>

            <PreviewFrame key={section.id} section={section} device={device} />
          </>
        )}
      </aside>
    </>
  );
}
