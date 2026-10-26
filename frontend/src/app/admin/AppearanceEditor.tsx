"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lock,
  Palette,
  Type,
  PanelTop,
} from "lucide-react";

import StickyActionBar from "@/components/admin/StickyActionBar";
import { saveTheme } from "@/app/admin/appearance/actions";
import {
  fontFamilies,
  fontNames as fonts,
  fontVariableClasses,
} from "@/lib/ui/portfolioFonts";
import type { Theme, ThemeConfig } from "@/types/theme";

// Number of presets shown (besides the Custom Theme) before the admin presses "Show all".
const collapsedPresetCount = 4;
const collapsedThemeCount = collapsedPresetCount + 1;

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

// The font CSS variables are only applied on the public site, so they are applied
// to this page too and each font name can be shown in its own typeface.

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

// A dropdown whose options are written in their own typeface (a native <select>
// ignores font styling on its options in most browsers).
function FontSelect({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (font: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const options = fonts.includes(value) ? fonts : [value, ...fonts];

  useEffect(() => {
    if (!open) return;

    function close(event: MouseEvent | KeyboardEvent) {
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape") setOpen(false);
      } else if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);

    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        style={{ fontFamily: fontFamilies[value] }}
        className="flex w-full items-center justify-between rounded-lg border border-admin-border bg-admin-subtle p-4 text-left"
      >
        <span>{value}</span>
        <ChevronDown size={16} className="text-admin-muted" />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby={id}
          className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-admin-border bg-admin-surface shadow-lg"
        >
          {options.map((font) => (
            <li
              key={font}
              role="option"
              aria-selected={font === value}
              tabIndex={0}
              onClick={() => {
                onChange(font);
                setOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onChange(font);
                  setOpen(false);
                }
              }}
              style={{ fontFamily: fontFamilies[font] }}
              className="flex cursor-pointer items-center justify-between px-4 py-3 text-lg hover:bg-admin-subtle focus:bg-admin-subtle focus:outline-none"
            >
              {fonts.includes(font) ? font : `${font} (unsupported)`}
              {font === value && (
                <Check size={16} className="text-admin-accent" />
              )}
            </li>
          ))}
        </ul>
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

  const savedConfigs = Object.fromEntries(
    themes.map((theme) => [theme.id, toConfig(theme)]),
  ) as Record<number, ThemeConfig>;

  // Clicking a card only changes this local selection; nothing is sent to the API.
  const [selectedId, setSelectedId] = useState(activeTheme.id);
  // Edits survive switching to another card until saved or cancelled. Colors can only
  // be edited on the Custom Theme; fonts and the navbar layout on every theme.
  const [drafts, setDrafts] =
    useState<Record<number, ThemeConfig>>(savedConfigs);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [showAllThemes, setShowAllThemes] = useState(false);

  // Collapsed: the first presets and the Custom Theme.
  const firstPresetIds = new Set(
    themes
      .filter((theme) => !theme.isCustom)
      .slice(0, collapsedPresetCount)
      .map((theme) => theme.id),
  );

  const visibleThemes = showAllThemes
    ? themes
    : themes.filter((theme) => theme.isCustom || firstPresetIds.has(theme.id));

  const selected =
    themes.find((theme) => theme.id === selectedId) ?? activeTheme;
  const colorsEditable = selected.isCustom;
  const view: ThemeConfig = drafts[selected.id] ?? toConfig(selected);

  function isChanged(theme: Theme) {
    const draft = drafts[theme.id];
    const saved = savedConfigs[theme.id];

    return (
      !!draft && !!saved && configKeys.some((key) => draft[key] !== saved[key])
    );
  }

  const selectedChanged = isChanged(selected);
  const hasChanges =
    selectedId !== activeTheme.id || themes.some((theme) => isChanged(theme));

  const invalidColors = colorsEditable
    ? colorFields.filter(({ key }) => !hexColor.test(view[key]))
    : [];

  const canSave =
    writesEnabled &&
    status.type !== "saving" &&
    !isRefreshing &&
    invalidColors.length === 0 &&
    (selectedChanged || !selected.isActive);

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

  function updateDraft(changes: Partial<ThemeConfig>) {
    setDrafts((previous) => ({
      ...previous,
      [selected.id]: { ...(previous[selected.id] ?? view), ...changes },
    }));
    setStatus({ type: "idle" });
  }

  function resetChanges() {
    setSelectedId(activeTheme.id);
    setDrafts(savedConfigs);
    setStatus({ type: "idle" });
  }

  async function handleSave() {
    setStatus({ type: "saving" });

    let result;

    try {
      result = await saveTheme(selected.id, selectedChanged ? view : null);
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
    } else if (result.stage === "activate" && selectedChanged) {
      setStatus({
        type: "error",
        message: `${selected.name} settings were saved, but activating it failed: ${result.message}`,
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
    <div className={`mx-auto max-w-7xl space-y-8 ${fontVariableClasses}`}>
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
            const preview = drafts[theme.id] ?? theme;
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
                {/* Miniature page: navbar in the primary color, then heading, text and button */}
                <div
                  className="h-32 p-3"
                  style={{ backgroundColor: preview.backgroundColor }}
                >
                  <div
                    className="flex items-center justify-between rounded px-2 py-1.5"
                    style={{ backgroundColor: preview.primaryColor }}
                  >
                    <span
                      className="h-1.5 w-8 rounded"
                      style={{ backgroundColor: preview.onPrimaryColor }}
                    />
                    <span
                      className="h-1.5 w-10 rounded opacity-60"
                      style={{ backgroundColor: preview.onPrimaryColor }}
                    />
                  </div>

                  <div className="mt-3 space-y-1.5 px-1">
                    <span
                      className="block h-2.5 w-24 rounded"
                      style={{ backgroundColor: preview.textColor }}
                    />
                    <span
                      className="block h-1.5 w-32 rounded opacity-50"
                      style={{ backgroundColor: preview.textColor }}
                    />
                    <span
                      className="mt-2 flex h-5 w-14 items-center justify-center rounded"
                      style={{ backgroundColor: preview.accentColor }}
                    >
                      <span
                        className="h-1 w-7 rounded"
                        style={{ backgroundColor: preview.onAccentColor }}
                      />
                    </span>
                  </div>
                </div>

                <div className="flex h-2">
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

                  {isChanged(theme) && (
                    <span className="text-admin-muted">Unsaved edits</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {themes.length > collapsedThemeCount && (
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

      {!colorsEditable && (
        <p className="flex items-center gap-2 text-sm text-admin-muted">
          <Lock size={14} />
          {selected.name} is a predefined theme, so its colors are locked. You
          can still change its fonts and navbar layout. Select Custom Theme to
          edit colors.
        </p>
      )}

      {/* Colors */}
      <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
        <h2 className="mb-6 text-xl font-bold">
          {colorsEditable ? "Custom Colors" : `${selected.name} Colors`}
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
                    disabled={!colorsEditable}
                    onChange={(event) =>
                      updateDraft({ [key]: event.target.value })
                    }
                    className="h-9 w-12 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <input
                    id={`${key}-hex`}
                    type="text"
                    value={value}
                    readOnly={!colorsEditable}
                    maxLength={7}
                    spellCheck={false}
                    aria-invalid={!valid}
                    onChange={(event) =>
                      updateDraft({ [key]: event.target.value })
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

              <FontSelect
                id={id}
                value={view[key]}
                onChange={(font) => updateDraft({ [key]: font })}
              />
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
              aria-pressed={view.navbarVariant === layout.value}
              onClick={() => updateDraft({ navbarVariant: layout.value })}
              className={`rounded-xl border-2 p-5 text-left transition hover:border-admin-accent ${
                view.navbarVariant === layout.value
                  ? "border-admin-accent"
                  : "border-admin-border"
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

      <StickyActionBar
        visible
        saving={isBusy}
        saveDisabled={!canSave}
        resetDisabled={!hasChanges}
        saveLabel={selectedChanged ? "Save & Apply" : "Activate Theme"}
        onReset={resetChanges}
        onSave={handleSave}
        message={
          status.type === "saving" || isRefreshing ? (
            <p className="text-admin-muted">
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
            <p className="text-amber-700">
              {selectedId !== activeTheme.id
                ? `${selected.name} is selected but not active yet.`
                : "You have unsaved appearance changes."}
            </p>
          ) : (
            <p className="text-admin-muted">
              Your appearance settings match the active theme.
            </p>
          )
        }
      />
    </div>
  );
}
