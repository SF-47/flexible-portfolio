"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Loader2,
  Monitor,
  RotateCw,
  Smartphone,
  Tablet,
} from "lucide-react";
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

  const [availableWidth, setAvailableWidth] = useState(0);

  const [measured, setMeasured] = useState<{
    deviceId: string;
    height: number;
  } | null>(null);
  const [readyCount, setReadyCount] = useState(0);
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

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;

      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      const message = event.data;

      if (
        !message ||
        message.type !== "PREVIEW_READY" ||
        message.sectionId !== section.id
      ) {
        return;
      }

      setReadyCount((previous) => previous + 1);
    }

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, [section.id]);

  useEffect(() => {
    if (readyCount === 0 || draftContentJson === undefined) {
      return;
    }

    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "SECTION_DRAFT",
        sectionId: section.id,
        contentJson: draftContentJson,
      },
      window.location.origin,
    );
  }, [readyCount, draftContentJson, section.id]);

  function trackContentHeight(iframe: HTMLIFrameElement) {
    contentObserver.current?.disconnect();

    const win = iframe.contentWindow;
    const main = iframe.contentDocument?.querySelector("main");

    if (!win || !main) {
      setMeasured({ deviceId: deviceIdRef.current, height: 240 });
      return;
    }

    const observer = new (win as Window & typeof globalThis).ResizeObserver(
      measure,
    );

    observer.observe(main);
    contentObserver.current = observer;
  }

  const scale =
    availableWidth > 0 ? Math.min(1, availableWidth / device.width) : 1;

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
