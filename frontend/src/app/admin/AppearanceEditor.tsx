"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Lock,
  Palette,
  Type,
  PanelTop,
  Save,
  RotateCcw,
} from "lucide-react";

import { saveTheme } from "@/app/admin/appearance/actions";
import type { Theme, ThemeConfig } from "@/types/theme";

// Number of presets shown (besides the Custom Theme) before the admin presses "Show all".
const collapsedPresetCount = 4;

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

type Status =
  | { type: "idle" }
  | { type: "saving" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

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
  {
    value: "default",
    label: "Default",
    description: "Logo on the left, links on the right.",
  },
  {
    value: "centered",
    label: "Centered",
    description: "Logo centered on top, links centered below it.",
  },
  {
    value: "split",
    label: "Split",
    description: "Logo in the middle, links split on both sides.",
  },
];

function NavbarSketch({ variant }: { variant: string }) {
  const logo = <span className="h-2 w-10 rounded bg-slate-300" />;
  const links = (count: number) => (
    <div className="flex gap-1">
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className="h-1 w-4 rounded bg-slate-500" />
      ))}
    </div>
  );

  return (
    <div className="mb-5 rounded bg-slate-900 p-3">
      {variant === "centered" ? (
        <div className="flex flex-col items-center gap-2">
          {logo}
          {links(3)}
        </div>
      ) : variant === "split" ? (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          {links(2)}
          {logo}
          <div className="flex justify-end">{links(2)}</div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          {logo}
          {links(3)}
        </div>
      )}
    </div>
  );
}

const hexColor = /^#[0-9a-fA-F]{6}$/;

// The admin API has no authentication yet, so saving is a local-development feature.
const writesEnabled = process.env.NODE_ENV === "development";

const configKeys: (keyof ThemeConfig)[] = [
  "primaryColor",
  "accentColor",
  "backgroundColor",
  "textColor",
  "onPrimaryColor",
  "onAccentColor",
  "headingFont",
  "bodyFont",
  "navbarVariant",
];

function toConfig(theme: ThemeConfig): ThemeConfig {
  return {
    primaryColor: theme.primaryColor,
    accentColor: theme.accentColor,
    backgroundColor: theme.backgroundColor,
    textColor: theme.textColor,
    onPrimaryColor: theme.onPrimaryColor,
    onAccentColor: theme.onAccentColor,
    headingFont: theme.headingFont,
    bodyFont: theme.bodyFont,
    navbarVariant: theme.navbarVariant,
  };
}

export default function AppearanceEditor({
  themes,
  activeTheme,
}: AppearanceEditorProps) {
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();

  const customTheme = themes.find((theme) => theme.isCustom);
  const savedCustom = customTheme ? toConfig(customTheme) : null;

  // Clicking a card only changes this local selection; nothing is sent to the API.
  const [selectedId, setSelectedId] = useState(activeTheme.id);
  // Edits to the Custom Theme survive switching to another card until saved or cancelled.
  const [customDraft, setCustomDraft] = useState<ThemeConfig | null>(
    savedCustom,
  );
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [showAllThemes, setShowAllThemes] = useState(false);

  // Collapsed: the first presets and the Custom Theme. The selected theme always stays visible.
  const firstPresetIds = new Set(
    themes
      .filter((theme) => !theme.isCustom)
      .slice(0, collapsedPresetCount)
      .map((theme) => theme.id),
  );

  const visibleThemes = showAllThemes
    ? themes
    : themes.filter(
        (theme) =>
          theme.isCustom || firstPresetIds.has(theme.id) || theme.id === selectedId,
      );

  const selected =
    themes.find((theme) => theme.id === selectedId) ?? activeTheme;
  const editable = selected.isCustom && customDraft !== null;
  const view: ThemeConfig = editable ? customDraft : toConfig(selected);

  const customChanged =
    customDraft !== null &&
    savedCustom !== null &&
    configKeys.some((key) => customDraft[key] !== savedCustom[key]);

  const hasChanges = selectedId !== activeTheme.id || customChanged;

  const invalidColors = editable
    ? colorFields.filter(({ key }) => !hexColor.test(customDraft[key]))
    : [];

  const canSave =
    writesEnabled &&
    status.type !== "saving" &&
    !isRefreshing &&
    invalidColors.length === 0 &&
    (selected.isCustom
      ? customChanged || !selected.isActive
      : !selected.isActive);

  const isBusy = status.type === "saving" || isRefreshing;

  // Warn before a refresh or tab close throws unsaved edits away.
  useEffect(() => {
    if (!hasChanges) return;

    function warn(event: BeforeUnloadEvent) {
      event.preventDefault();
    }

    window.addEventListener("beforeunload", warn);

    return () => window.removeEventListener("beforeunload", warn);
  }, [hasChanges]);

  function selectTheme(theme: Theme) {
    setSelectedId(theme.id);
    setStatus({ type: "idle" });
  }

  function updateCustom(changes: Partial<ThemeConfig>) {
    setCustomDraft((previous) =>
      previous ? { ...previous, ...changes } : previous,
    );
    setStatus({ type: "idle" });
  }

  function resetChanges() {
    setSelectedId(activeTheme.id);
    setCustomDraft(savedCustom);
    setStatus({ type: "idle" });
  }

  async function handleSave() {
    setStatus({ type: "saving" });

    let result;

    try {
      result = await saveTheme(
        selected.id,
        selected.isCustom && customDraft ? customDraft : null,
      );
    } catch {
      result = {
        ok: false as const,
        stage: "update" as const,
        message: "Could not reach the server.",
      };
    }

    if (result.ok) {
      setStatus({
        type: "success",
        message: `${selected.name} is now the active theme.`,
      });
    } else if (result.stage === "activate" && selected.isCustom) {
      setStatus({
        type: "error",
        message: `Custom Theme settings were saved, but activating it failed: ${result.message}`,
      });
    } else {
      setStatus({
        type: "error",
        message: `Nothing was saved. ${result.message}`,
      });
    }

    // Reload server data so the active indicator reflects the database.
    startRefresh(() => router.refresh());
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Appearance</h1>
          <p className="mt-2 text-admin-muted">
            Customize your website branding and visual style.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm font-medium"
        >
          Open Website
          <ExternalLink size={16} />
        </a>
      </div>

      {!writesEnabled && (
        <p
          role="status"
          className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-900"
        >
          Saving is only available in local development until admin
          authentication is added.
        </p>
      )}

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

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {visibleThemes.map((theme) => {
            const isSelected = selectedId === theme.id;
            const preview = theme.isCustom && customDraft ? customDraft : theme;
            const swatches = [
              preview.primaryColor,
              preview.accentColor,
              preview.backgroundColor,
              preview.textColor,
              preview.onPrimaryColor,
              preview.onAccentColor,
            ];

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => selectTheme(theme)}
                disabled={isBusy}
                aria-pressed={isSelected}
                className={`overflow-hidden rounded-xl border-2 text-left transition hover:border-admin-accent ${
                  isSelected ? "border-admin-accent" : "border-admin-border"
                }`}
              >
                <div
                  className="flex h-28 items-end p-4"
                  style={{ backgroundColor: preview.primaryColor }}
                >
                  <div
                    className="h-6 w-16 rounded"
                    style={{ backgroundColor: preview.accentColor }}
                  />
                </div>

                <div className="flex h-5">
                  {swatches.map((color, index) => (
                    <div
                      key={index}
                      className="flex-1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2 p-4">
                  <span className="font-semibold">{theme.name}</span>

                  {isSelected && (
                    <Check size={18} className="text-admin-accent" />
                  )}
                </div>

                <div className="flex flex-wrap gap-2 px-4 pb-4 text-xs">
                  {theme.isActive && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-800">
                      Active
                    </span>
                  )}

                  {isSelected && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-900">
                      Selected
                    </span>
                  )}

                  {!theme.isCustom && (
                    <span className="inline-flex items-center gap-1 text-admin-muted">
                      <Lock size={12} />
                      Preset
                    </span>
                  )}

                  {theme.isCustom && customChanged && (
                    <span className="text-admin-muted">Unsaved edits</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {themes.length > visibleThemes.length || showAllThemes && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              aria-expanded={showAllThemes}
              onClick={() => setShowAllThemes((previous) => !previous)}
              className="inline-flex items-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-5 py-2.5 text-sm font-semibold transition hover:border-admin-accent"
            >
              {showAllThemes ? (
                <>
                  Show less
                  <ChevronUp size={16} />
                </>
              ) : (
                <>
                  Show all ({themes.length})
                  <ChevronDown size={16} />
                </>
              )}
            </button>
          </div>
        )}
      </section>

      {!editable && (
        <p className="flex items-center gap-2 text-sm text-admin-muted">
          <Lock size={14} />
          {selected.name} is a predefined theme and cannot be edited. Select
          Custom Theme to change colors, fonts and navbar layout.
        </p>
      )}

      {/* Colors */}
      <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
        <h2 className="mb-6 text-xl font-bold">
          {editable ? "Custom Colors" : `${selected.name} Colors`}
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {colorFields.map(({ label, key }) => {
            const value = view[key];
            const valid = hexColor.test(value);

            return (
              <div key={key}>
                <label
                  htmlFor={`${key}-hex`}
                  className="mb-2 block text-sm font-medium"
                >
                  {label}
                </label>

                <div
                  className={`flex items-center gap-3 rounded-lg border p-3 ${
                    valid ? "border-admin-border" : "border-red-400"
                  }`}
                >
                  <input
                    type="color"
                    aria-label={`${label} color picker`}
                    value={valid ? value : "#000000"}
                    disabled={!editable}
                    onChange={(event) =>
                      updateCustom({ [key]: event.target.value })
                    }
                    className="h-9 w-12 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <input
                    id={`${key}-hex`}
                    type="text"
                    value={value}
                    readOnly={!editable}
                    maxLength={7}
                    spellCheck={false}
                    aria-invalid={!valid}
                    onChange={(event) =>
                      updateCustom({ [key]: event.target.value })
                    }
                    className="w-full min-w-0 rounded border border-admin-border px-2 py-1.5 font-mono text-sm read-only:bg-admin-subtle"
                  />
                </div>

                {!valid && (
                  <p className="mt-1 text-xs text-red-600">
                    Use a HEX value like #1a2b3c.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Typography */}
      <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
        <div className="mb-6 flex items-center gap-3">
          <Type className="text-admin-accent" />
          <h2 className="text-xl font-bold">Typography</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {(
            [
              { id: "heading-font", label: "Heading Font", key: "headingFont" },
              { id: "body-font", label: "Body Font", key: "bodyFont" },
            ] as const
          ).map(({ id, label, key }) => (
            <div key={id}>
              <label htmlFor={id} className="mb-2 block text-sm font-medium">
                {label}
              </label>

              <select
                id={id}
                value={view[key]}
                disabled={!editable}
                onChange={(event) =>
                  updateCustom({ [key]: event.target.value })
                }
                className="w-full rounded-lg border border-admin-border bg-admin-subtle p-4 disabled:opacity-70"
              >
                {!fonts.includes(view[key]) && (
                  <option value={view[key]}>{view[key]} (unsupported)</option>
                )}
                {fonts.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>
          ))}
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
              disabled={!editable}
              aria-pressed={view.navbarVariant === layout.value}
              onClick={() => updateCustom({ navbarVariant: layout.value })}
              className={`rounded-xl border-2 p-5 text-left transition enabled:hover:border-admin-accent disabled:cursor-not-allowed ${
                view.navbarVariant === layout.value
                  ? "border-admin-accent"
                  : "border-admin-border disabled:opacity-60"
              }`}
            >
              <NavbarSketch variant={layout.value} />

              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{layout.label}</p>

                {view.navbarVariant === layout.value && (
                  <Check size={18} className="text-admin-accent" />
                )}
              </div>

              <p className="mt-1 text-xs text-admin-muted">
                {layout.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-admin-border bg-admin-surface p-4 shadow-lg">
        <div className="text-sm" role="status" aria-live="polite">
          {status.type === "saving" || isRefreshing ? (
            <p className="inline-flex items-center gap-2 text-admin-muted">
              <Loader2 size={16} className="animate-spin" />
              {status.type === "saving" ? "Saving…" : "Refreshing…"}
            </p>
          ) : status.type === "success" ? (
            <p className="text-green-700">{status.message}</p>
          ) : status.type === "error" ? (
            <p role="alert" className="text-red-600">
              {status.message}
            </p>
          ) : invalidColors.length > 0 ? (
            <p className="text-red-600">
              Fix the invalid colors before saving.
            </p>
          ) : hasChanges ? (
            <p className="text-admin-muted">
              {selectedId !== activeTheme.id
                ? `${selected.name} is selected but not active yet.`
                : "You have unsaved appearance changes."}
            </p>
          ) : (
            <p className="text-admin-muted">
              Your appearance settings match the active theme.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetChanges}
            disabled={!hasChanges || isBusy}
            className="inline-flex items-center gap-2 rounded-lg border border-admin-border px-5 py-3 font-medium disabled:opacity-50"
          >
            <RotateCcw size={18} />
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            title={
              writesEnabled
                ? undefined
                : "Saving is only available in local development"
            }
            className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />
            {selected.isCustom ? "Save & Apply" : "Activate Theme"}
          </button>
        </div>
      </div>
    </div>
  );
}
