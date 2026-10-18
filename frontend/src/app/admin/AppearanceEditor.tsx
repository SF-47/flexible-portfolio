"use client";

import { useState } from "react";
import { Check, Palette, Type, PanelTop, Save, RotateCcw } from "lucide-react";

import type { Theme } from "@/types/theme";

type AppearanceEditorProps = {
  themes: Theme[];
  activeTheme: Theme;
};

type ColorKey =
  | "primaryColor"
  | "accentColor"
  | "backgroundColor"
  | "textColor"
  | "onPrimaryColor"
  | "onAccentColor";

const colorFields: { label: string; key: ColorKey }[] = [
  { label: "Primary", key: "primaryColor" },
  { label: "Accent", key: "accentColor" },
  { label: "Background", key: "backgroundColor" },
  { label: "Text", key: "textColor" },
  { label: "Text on Primary", key: "onPrimaryColor" },
  { label: "Text on Accent", key: "onAccentColor" },
];

// Match the fonts currently supported by portfolioFonts.ts.
const fonts = ["Inter", "Poppins", "Roboto", "Lato"];

const navbarLayouts = [
  { value: "default", label: "Default" },
  { value: "centered", label: "Centered" },
  { value: "split", label: "Split" },
];

export default function AppearanceEditor({
  themes,
  activeTheme,
}: AppearanceEditorProps) {
  const [draft, setDraft] = useState<Theme>({ ...activeTheme });

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(activeTheme);

  function selectTheme(theme: Theme) {
    setDraft({ ...theme });
  }

  function updateColor(key: ColorKey, value: string) {
    setDraft((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function resetChanges() {
    setDraft({ ...activeTheme });
    
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Appearance</h1>
        <p className="mt-2 text-admin-muted">
          Customize your website branding and visual style.
        </p>
      </div>

      {/* Theme Presets */}
      <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
        <div className="mb-6 flex items-center gap-3">
          <Palette className="text-admin-accent" />
          <h2 className="text-xl font-bold">Theme Presets</h2>
        </div>

        {themes.length === 0 && (
          <p className="text-sm text-admin-muted">
            No theme presets available.
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => selectTheme(theme)}
              className={`overflow-hidden rounded-xl border-2 text-left transition hover:border-admin-accent ${
                draft.id === theme.id
                  ? "border-admin-accent"
                  : "border-admin-border"
              }`}
            >
              <div
                className="flex h-28 items-end p-4"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <div
                  className="h-6 w-16 rounded"
                  style={{ backgroundColor: theme.accentColor }}
                />
              </div>

              <div className="flex h-5">
                {[
                  theme.primaryColor,
                  theme.accentColor,
                  theme.backgroundColor,
                  theme.textColor,
                  theme.onPrimaryColor,
                  theme.onAccentColor,
                ].map((color, index) => (
                  <div
                    key={index}
                    className="flex-1"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between gap-2 p-4">
                <span className="font-semibold">{theme.name}</span>

                {draft.id === theme.id && (
                  <Check size={18} className="text-admin-accent" />
                )}
              </div>

              {theme.isActive && (
                <p className="px-4 pb-3 text-xs text-admin-muted">
                  Currently active
                </p>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Custom Colors */}
      <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
        <h2 className="mb-6 text-xl font-bold">Custom Colors</h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {colorFields.map(({ label, key }) => (
            <div key={key}>
              <label htmlFor={key} className="mb-2 block text-sm font-medium">
                {label}
              </label>

              <div className="flex items-center gap-3 rounded-lg border border-admin-border p-3">
                <input
                  id={key}
                  type="color"
                  value={draft[key]}
                  onChange={(event) => updateColor(key, event.target.value)}
                  className="h-9 w-12 cursor-pointer"
                />

                <span className="font-mono text-sm">{draft[key]}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
        <div className="mb-6 flex items-center gap-3">
          <Type className="text-admin-accent" />
          <h2 className="text-xl font-bold">Typography</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="heading-font"
              className="mb-2 block text-sm font-medium"
            >
              Heading Font
            </label>

            <select
              id="heading-font"
              value={draft.headingFont}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  headingFont: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-admin-border bg-admin-subtle p-4"
            >
              {!fonts.includes(draft.headingFont) && (
                <option value={draft.headingFont}>
                  {draft.headingFont} (unsupported)
                </option>
              )}
              {fonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="body-font"
              className="mb-2 block text-sm font-medium"
            >
              Body Font
            </label>

            <select
              id="body-font"
              value={draft.bodyFont}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  bodyFont: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-admin-border bg-admin-subtle p-4"
            >
              {!fonts.includes(draft.bodyFont) && (
                <option value={draft.bodyFont}>
                  {draft.bodyFont} (unsupported)
                </option>
              )}
              {fonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Navbar Variants */}
      <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
        <div className="mb-6 flex items-center gap-3">
          <PanelTop className="text-admin-accent" />
          <h2 className="text-xl font-bold">Navbar Layout</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {navbarLayouts.map((layout) => (
            <button
              key={layout.value}
              type="button"
              onClick={() =>
                setDraft((previous) => ({
                  ...previous,
                  navbarVariant: layout.value,
                }))
              }
              className={`rounded-xl border-2 p-5 text-left transition hover:border-admin-accent ${
                draft.navbarVariant === layout.value
                  ? "border-admin-accent"
                  : "border-admin-border"
              }`}
            >
              <div className="mb-5 flex items-center justify-between rounded bg-slate-900 p-3 text-white">
                <span className="h-2 w-10 rounded bg-slate-400" />
                <div className="flex gap-1">
                  <span className="h-1 w-4 rounded bg-slate-400" />
                  <span className="h-1 w-4 rounded bg-slate-400" />
                  <span className="h-1 w-4 rounded bg-slate-400" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{layout.label}</p>

                {draft.navbarVariant === layout.value && (
                  <Check size={18} className="text-admin-accent" />
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-admin-border bg-admin-surface p-4">
        <p className="text-sm text-admin-muted">
          {hasChanges
            ? "You have unsaved appearance changes."
            : "Your appearance settings match the active theme."}
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetChanges}
            disabled={!hasChanges}
            className="inline-flex items-center gap-2 rounded-lg border border-admin-border px-5 py-3 font-medium disabled:opacity-50"
          >
            <RotateCcw size={18} />
            Cancel
          </button>

          <button
            type="button"
            disabled
            title="Saving will be enabled after backend integration"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />
            Save Appearance
          </button>
        </div>
      </div>
    </div>
  );
}
