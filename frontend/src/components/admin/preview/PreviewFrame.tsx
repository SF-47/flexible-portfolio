"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2, Monitor, RotateCw, Smartphone, Tablet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { ApiSection } from "@/types/apiSections";

const LOAD_TIMEOUT_MS = 20000;

export const devices = [
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

export type Device = (typeof devices)[number];

// Shows /admin/preview in an iframe at the device's real width, scaled to fit.
//
// Draft protocol (both sides check origin, source and section id):
//   iframe -> parent  { type: "PREVIEW_READY", sectionId }   its listener is attached
//   parent -> iframe  { type: "SECTION_DRAFT", sectionId, contentJson }
// The parent sends the latest draft whenever the iframe announces it is ready and
// whenever the draft changes, so nothing is lost if the iframe loads late.
export function PreviewFrame({
  section,
  device,
  draftContentJson,
}: {
  section: ApiSection;
  device: Device;
  draftContentJson?: string;
}) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [attempt, setAttempt] = useState(0);
  // Counts PREVIEW_READY messages from the current iframe (0 = not ready yet). A
  // counter, not a boolean, so a reloaded iframe is sent the draft again.
  const [readyCount, setReadyCount] = useState(0);
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

  // The iframe announces that its message listener is attached.
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.source !== iframeRef.current?.contentWindow) return;

      const message = event.data;

      if (
        message &&
        message.type === "PREVIEW_READY" &&
        message.sectionId === section.id
      ) {
        setReadyCount((count) => count + 1);
      }
    }

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, [section.id]);

  // Send the draft once the iframe is ready, and again whenever it changes.
  useEffect(() => {
    if (draftContentJson === undefined || readyCount === 0) return;

    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "SECTION_DRAFT",
        sectionId: section.id,
        contentJson: draftContentJson,
      },
      window.location.origin,
    );
  }, [draftContentJson, section.id, readyCount]);

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
            tabIndex={-1}
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
              setReadyCount(0);
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
