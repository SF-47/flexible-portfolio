"use client";

import { useSyncExternalStore } from "react";
import { getSections, saveSections } from "@/lib/sectionStore";
import { sections as defaultSections } from "@/data/sections";
import type { SectionConfig } from "@/types/section";

const STORAGE_KEY = "portfolio-sections";

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("portfolio-sections-changed", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("portfolio-sections-changed", callback);
  };
};

const SERVER_SNAPSHOT = JSON.stringify(defaultSections);

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) ?? SERVER_SNAPSHOT;
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function useSections() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  let sections: SectionConfig[];

  try {
    const parsed: unknown = JSON.parse(snapshot);
    sections = Array.isArray(parsed)
      ? (parsed as SectionConfig[])
      : defaultSections;
  } catch {
    sections = defaultSections;
  }

  return {
    sections,
    setSections: saveSections,
  };
}
