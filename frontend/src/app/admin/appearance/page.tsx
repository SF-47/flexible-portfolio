import { Check, Palette, Type, PanelTop, Save } from "lucide-react";

import {
  mockColors,
  mockFonts,
  mockNavbarLayouts,
  mockThemes,
} from "@/components/admin/mockData";

type ThemePreset = {
  name: string;
  colors: string[];
  selected: boolean;
};

type ColorField = {
  label: string;
  value: string;
};

const themes: ThemePreset[] = mockThemes;

const colors: ColorField[] = mockColors;

const navbarLayouts: string[] = mockNavbarLayouts;

export default function AppearancePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Appearance</h1>
        <p className="mt-2 text-admin-muted">
          Customize your website branding and visual style.
        </p>
      </div>

      <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
        <div className="mb-6 flex items-center gap-3">
          <Palette className="text-admin-accent" />
          <h2 className="text-xl font-bold">Theme Presets</h2>
        </div>

        {themes.length === 0 && (
          <p className="text-sm text-admin-muted">No theme presets yet.</p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {themes.map((theme) => (
            <div
              key={theme.name}
              className={`overflow-hidden rounded-xl border-2 ${
                theme.selected ? "border-amber-400" : "border-admin-border"
              }`}
            >
              <div
                className="flex h-28 items-end p-4"
                style={{ backgroundColor: theme.colors[0] }}
              >
                <div
                  className="h-6 w-16 rounded"
                  style={{ backgroundColor: theme.colors[1] }}
                />
              </div>

              <div className="flex h-5">
                {theme.colors.map((color) => (
                  <div
                    key={color}
                    className="flex-1"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between p-4">
                <span className="font-semibold">{theme.name}</span>
                {theme.selected && (
                  <Check size={18} className="text-admin-accent" />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
        <h2 className="mb-6 text-xl font-bold">Custom Colors</h2>

        {colors.length === 0 && (
          <p className="text-sm text-admin-muted">No colors yet.</p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {colors.map((color) => (
            <div key={color.label}>
              <label className="mb-2 block text-sm font-medium">
                {color.label}
              </label>

              <div className="flex items-center gap-3 rounded-lg border border-admin-border p-3">
                <div
                  className="h-9 w-9 rounded-md border border-admin-border"
                  style={{ backgroundColor: color.value }}
                />

                <span className="font-mono text-sm">{color.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
        <div className="mb-6 flex items-center gap-3">
          <Type className="text-admin-accent" />
          <h2 className="text-xl font-bold">Typography</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Heading Font
            </label>
            <div className="min-h-14 rounded-lg border border-admin-border bg-admin-subtle p-4">
              {mockFonts.heading}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Body Font</label>
            <div className="min-h-14 rounded-lg border border-admin-border bg-admin-subtle p-4">
              {mockFonts.body}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
        <div className="mb-6 flex items-center gap-3">
          <PanelTop className="text-admin-accent" />
          <h2 className="text-xl font-bold">Navbar Layout</h2>
        </div>

        {navbarLayouts.length === 0 && (
          <p className="text-sm text-admin-muted">No navbar layouts yet.</p>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {navbarLayouts.map((layout, index) => (
            <div
              key={layout}
              className={`rounded-xl border-2 p-5 ${
                index === 0 ? "border-amber-400" : "border-admin-border"
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
              <p className="text-sm font-semibold">{layout}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <div className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3 font-semibold text-slate-950">
          <Save size={18} />
          Save Appearance
        </div>
      </div>
    </div>
  );
}
