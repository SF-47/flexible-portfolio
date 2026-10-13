import {
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Save,
  RotateCcw,
  ChevronDown,
  ImagePlus,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import SiteTheme from "@/components/SiteTheme";

export default function EditorPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Live Editor</h1>
          <p className="mt-2 text-admin-muted">
            Customize your website and preview its appearance.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-4 py-3 text-sm font-medium"
          >
            <RotateCcw size={17} />
            Reset
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-3 font-semibold text-slate-950"
          >
            <Save size={17} />
            Publish Changes
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[350px_minmax(0,1fr)]">
        <div className="space-y-6">
          <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
            <h2 className="mb-6 text-lg font-bold">Hero Content</h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Heading
                </label>
                <input
                  type="text"
                  readOnly
                  defaultValue="Building the Future, Together."
                  className="w-full rounded-lg border border-admin-border bg-admin-subtle px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Tagline
                </label>
                <input
                  type="text"
                  readOnly
                  defaultValue="CONSTRUCTION & ENGINEERING"
                  className="w-full rounded-lg border border-admin-border bg-admin-subtle px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  rows={4}
                  readOnly
                  defaultValue="We deliver modern construction solutions with quality, precision, and trust."
                  className="w-full resize-none rounded-lg border border-admin-border bg-admin-subtle px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Button Text
                </label>
                <input
                  type="text"
                  readOnly
                  defaultValue="Explore Our Projects"
                  className="w-full rounded-lg border border-admin-border bg-admin-subtle px-4 py-3"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
            <h2 className="mb-6 text-lg font-bold">Appearance</h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Primary Color
                </label>
                <div className="flex items-center gap-3 rounded-lg border border-admin-border p-3">
                  <span className="h-9 w-9 rounded-md bg-[#12372A]" />
                  <span className="font-mono text-sm">#12372A</span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Accent Color
                </label>
                <div className="flex items-center gap-3 rounded-lg border border-admin-border p-3">
                  <span className="h-9 w-9 rounded-md bg-[#D4AF37]" />
                  <span className="font-mono text-sm">#D4AF37</span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Hero Layout
                </label>
                <div className="flex items-center justify-between rounded-lg border border-admin-border bg-admin-subtle px-4 py-3 text-sm">
                  Standard
                  <ChevronDown size={17} />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Background Image
                </label>
                <div className="flex h-28 items-center justify-center rounded-lg border-2 border-dashed border-admin-border bg-admin-subtle">
                  <ImagePlus className="text-admin-faint" size={26} />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="min-w-0 overflow-hidden rounded-xl border border-admin-border bg-admin-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-admin-border p-4">
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-admin-accent" />
              <h2 className="font-bold">Website Preview</h2>
            </div>

            <div className="flex items-center gap-5 text-admin-muted">
              <Monitor size={20} className="text-admin-accent" />
              <Tablet size={20} />
              <Smartphone size={20} />
            </div>
          </div>

          <div className="max-h-[700px] overflow-auto bg-admin-bg p-4">
            <div className="mx-auto overflow-hidden rounded-lg shadow-xl">
              <SiteTheme>
                <div className="bg-brand-primary text-brand-on-primary">
                  <Navbar />
                  <Hero />
                </div>
              </SiteTheme>
            </div>
          </div>

          <div className="border-t border-admin-border px-5 py-4">
            <p className="text-xs text-admin-muted">Portfolio preview</p>
          </div>
        </div>
      </div>
    </div>
  );
}
