"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, RotateCcw } from "lucide-react";
import { useSections } from "@/hooks/useSections";
import { sections as defaultSections } from "@/data/sections";
import type { SectionConfig } from "@/types/section";
import Link from "next/link";

export default function AdminPage() {
  const { sections, setSections } = useSections();

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  function toggleVisibility(id: string) {
    const updated = sections.map((section) =>
      section.id === id
        ? { ...section, isVisible: !section.isVisible }
        : section,
    );

    setSections(updated);
  }

  function moveSection(id: string, direction: -1 | 1) {
    const currentIndex = sortedSections.findIndex(
      (section) => section.id === id,
    );

    const targetIndex = currentIndex + direction;

    if (targetIndex < 0 || targetIndex >= sortedSections.length) return;

    const reordered = [...sortedSections];

    [reordered[currentIndex], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[currentIndex],
    ];

    const updated = reordered.map((section, index) => ({
      ...section,
      order: index + 1,
    }));

    setSections(updated);
  }

  function resetSections() {
    setSections(defaultSections);
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12 text-slate-900 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-600">
            Portfolio Management
          </p>

          <h1 className="text-4xl font-bold">Admin Dashboard</h1>

          <p className="mt-3 text-slate-600">
            Manage your portfolio sections and their visibility.
          </p>

          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Prototype only — this admin page is not protected by authentication.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Website Sections</h2>

            <button
              onClick={resetSections}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          <div className="space-y-3">
            {sortedSections.map((section, index) => (
              <SectionRow
                key={section.id}
                section={section}
                isFirst={index === 0}
                isLast={index === sortedSections.length - 1}
                onToggle={() => toggleVisibility(section.id)}
                onMoveUp={() => moveSection(section.id, -1)}
                onMoveDown={() => moveSection(section.id, 1)}
              />
            ))}
          </div>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block font-semibold text-slate-700 hover:text-amber-600"
        >
          ← View Portfolio
        </Link>
      </div>
    </main>
  );
}

interface SectionRowProps {
  section: SectionConfig;
  isFirst: boolean;
  isLast: boolean;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function SectionRow({
  section,
  isFirst,
  isLast,
  onToggle,
  onMoveUp,
  onMoveDown,
}: SectionRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4">
      <div className="flex items-center gap-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold">
          {section.order}
        </span>

        <div>
          <h3 className="font-semibold capitalize">{section.type}</h3>
          <p className="text-sm text-slate-500">
            {section.isVisible ? "Visible" : "Hidden"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggle}
          aria-label={`${section.isVisible ? "Hide" : "Show"} ${section.type}`}
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          {section.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>

        <button
          onClick={onMoveUp}
          disabled={isFirst}
          aria-label={`Move ${section.type} up`}
          className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-30"
        >
          <ArrowUp size={18} />
        </button>

        <button
          onClick={onMoveDown}
          disabled={isLast}
          aria-label={`Move ${section.type} down`}
          className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-30"
        >
          <ArrowDown size={18} />
        </button>
      </div>
    </div>
  );
}
