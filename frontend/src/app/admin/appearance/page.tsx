import { Check, Palette, Type, PanelTop, Save } from "lucide-react";

const themes = [
  {
    name: "Classic Gold",
    colors: ["#020617", "#FBBF24", "#FFFFFF", "#0F172A"],
    selected: true,
  },
  {
    name: "Forest Green",
    colors: ["#12372A", "#D4AF37", "#F8F7F2", "#18332B"],
    selected: false,
  },
  {
    name: "Royal Navy",
    colors: ["#14253D", "#D69A62", "#F7F5F1", "#1B293B"],
    selected: false,
  },
  {
    name: "Charcoal",
    colors: ["#1D252D", "#8CC8E8", "#F5F8FA", "#24313B"],
    selected: false,
  },
];

const colors = [
  { label: "Primary", value: "#020617" },
  { label: "Accent", value: "#FBBF24" },
  { label: "Background", value: "#FFFFFF" },
  { label: "Text", value: "#0F172A" },
  { label: "Text on Primary", value: "#FFFFFF" },
  { label: "Text on Accent", value: "#020617" },
];

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
                  className="rounded px-3 py-2 text-xs font-bold"
                  style={{
                    backgroundColor: theme.colors[1],
                    color: theme.colors[0],
                  }}
                >
                  ATLAS.
                </div>
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
            <div className="rounded-lg border border-admin-border bg-admin-subtle p-4">
              Inter
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Body Font</label>
            <div className="rounded-lg border border-admin-border bg-admin-subtle p-4">
              Inter
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
        <div className="mb-6 flex items-center gap-3">
          <PanelTop className="text-admin-accent" />
          <h2 className="text-xl font-bold">Navbar Layout</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {["Standard", "Centered", "Minimal"].map((layout, index) => (
            <div
              key={layout}
              className={`rounded-xl border-2 p-5 ${
                index === 0 ? "border-amber-400" : "border-admin-border"
              }`}
            >
              <div className="mb-5 flex items-center justify-between rounded bg-slate-900 p-3 text-white">
                <span className="text-xs font-bold">ATLAS.</span>
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
