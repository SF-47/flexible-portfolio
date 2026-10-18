"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ExternalLink,
  Loader2,
  Monitor,
  Pencil,
  RotateCw,
  Smartphone,
  Tablet,
  X,
  type LucideIcon,
} from "lucide-react";

import type { ApiSection } from "@/types/apiSections";

// If the preview has not loaded after this long, offer a retry.
const LOAD_TIMEOUT_MS = 20000;

// `width` is the iframe's real layout viewport, so the public site's responsive
// breakpoints fire exactly as they would on that device. `height` is the typical
// viewport height, used for the Hero (whose height is relative to the viewport).
const devices = [
  { id: "desktop", label: "Desktop", width: 1440, height: 900, icon: Monitor },
  { id: "tablet", label: "Tablet", width: 768, height: 1024, icon: Tablet },
  { id: "mobile", label: "Mobile", width: 390, height: 844, icon: Smartphone },
] satisfies {
  id: string;
  label: string;
  width: number;
  height: number;
  icon: LucideIcon;
}[];

type Device = (typeof devices)[number];

function PreviewFrame({
  section,
  device,
}: {
  section: ApiSection;
  device: Device;
}) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [attempt, setAttempt] = useState(0);
  // Width available for the scaled preview, and the section's real content height.
  const [availableWidth, setAvailableWidth] = useState(0);
  // Remember which device a height was measured on: the Hero's height depends on the
  // iframe height, so a reading from another device must never be reused.
  const [measured, setMeasured] = useState<{
    deviceId: string;
    height: number;
  } | null>(null);

  const areaRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const contentObserver = useRef<ResizeObserver | null>(null);
  const deviceIdRef = useRef(device.id);

  const measure = useCallback(() => {
    const main = iframeRef.current?.contentDocument?.querySelector("main");

    if (!main) return;

    setMeasured({
      deviceId: deviceIdRef.current,
      height: Math.ceil(main.getBoundingClientRect().height),
    });
  }, []);

  // When the device changes, the iframe reflows: measure again once it has settled.
  useEffect(() => {
    deviceIdRef.current = device.id;

    const frame = window.requestAnimationFrame(measure);

    return () => window.cancelAnimationFrame(frame);
  }, [device.id, measure]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStatus((current) => (current === "loading" ? "error" : current));
    }, LOAD_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [attempt]);

  // Measure the area the scaled preview has to fit in.
  useEffect(() => {
    const area = areaRef.current;

    if (!area) return;

    const observer = new ResizeObserver(([entry]) => {
      setAvailableWidth(Math.floor(entry.contentRect.width));
    });

    observer.observe(area);

    return () => observer.disconnect();
  }, []);

  useEffect(() => () => contentObserver.current?.disconnect(), []);

  // Follow the section's content height so the iframe never needs its own scrollbar.
  function trackContentHeight(iframe: HTMLIFrameElement) {
    contentObserver.current?.disconnect();

    const win = iframe.contentWindow;
    const main = iframe.contentDocument?.querySelector("main");

    if (!win || !main) {
      // The preview route showed a message instead of a section.
      setMeasured({ deviceId: deviceIdRef.current, height: 240 });
      return;
    }

    // Use the iframe's own ResizeObserver so it reports for its own document.
    const observer = new (win as Window & typeof globalThis).ResizeObserver(
      measure,
    );

    observer.observe(main);
    contentObserver.current = observer;
  }

  // transform: scale() does not change layout size, so the wrapper is sized to the
  // scaled dimensions and the iframe is scaled from its top-left corner.
  const scale =
    availableWidth > 0 ? Math.min(1, availableWidth / device.width) : 1;

  // The Hero is sized from the viewport height (100svh minus the 5rem navbar), so it
  // gets a realistic device height, and the navbar's 80px is cropped from the bottom.
  const contentHeight = measured?.deviceId === device.id ? measured.height : 0;
  const isHero = section.type === "hero";
  const heroOffset = isHero ? 80 : 0;

  const frameHeight = Math.max(
    contentHeight + heroOffset,
    isHero ? device.height : 0,
    160,
  );
  const visibleHeight = frameHeight - heroOffset;

  return (
    <div className="relative min-h-0 flex-1 bg-admin-bg">
      <div
        ref={areaRef}
        className="h-full overflow-x-hidden overflow-y-auto p-3 scrollbar-gutter-stable"
      >
        <div
          className="relative mx-auto overflow-hidden bg-white shadow-lg"
          style={{
            width: device.width * scale,
            height: visibleHeight * scale,
          }}
        >
          <iframe
            ref={iframeRef}
            key={attempt}
            src={`/admin/preview?section=${encodeURIComponent(section.type)}`}
            title={`${section.name} preview`}
            scrolling="no"
            onLoad={(event) => {
              setStatus("ready");
              trackContentHeight(event.currentTarget);
            }}
            // Read-only: the preview ignores clicks, and wheel scrolling goes to the panel.
            className="pointer-events-none absolute top-0 left-0 origin-top-left border-0"
            style={{
              width: device.width,
              height: frameHeight,
              transform: `scale(${scale})`,
            }}
          />
        </div>
      </div>

      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-admin-surface text-sm text-admin-muted">
          <Loader2 size={26} className="animate-spin" />
          Loading preview…
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-admin-surface p-6 text-center text-sm text-admin-muted">
          <AlertTriangle size={28} className="text-amber-500" />
          <p>The preview is taking too long or could not be loaded.</p>
          <button
            type="button"
            onClick={() => {
              setStatus("loading");
              setAttempt((previous) => previous + 1);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 font-semibold text-slate-950"
          >
            <RotateCw size={16} />
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

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
              <div
                role="group"
                aria-label="Preview device"
                className="flex rounded-lg border border-admin-border bg-admin-bg p-0.5"
              >
                {devices.map((item) => {
                  const Icon = item.icon;
                  const active = item.id === device.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDeviceId(item.id)}
                      aria-pressed={active}
                      aria-label={`${item.label} preview, ${item.width}px`}
                      title={`${item.label} · ${item.width}px`}
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                        active
                          ? "bg-amber-400 text-slate-950"
                          : "text-admin-muted hover:text-admin-text"
                      }`}
                    >
                      <Icon size={16} />
                      <span className="hidden sm:inline">{item.label}</span>
                    </button>
                  );
                })}
              </div>

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
