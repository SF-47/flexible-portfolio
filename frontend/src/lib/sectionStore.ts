import {defaultSections } from "@/data/sections";
import type { SectionConfig } from "@/types/section";

const STORAGE_KEY = "portfolio-sections";

export function getSections(): SectionConfig[] {
  if (typeof window === "undefined") {
    return defaultSections;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return defaultSections;

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return defaultSections;

    return parsed as SectionConfig[];
  } catch {
    return defaultSections;
  }
}

export function saveSections(sections: SectionConfig[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
  window.dispatchEvent(new Event("portfolio-sections-changed"));
}
