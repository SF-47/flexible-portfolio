"use client";

import { useState } from "react";
import { Save, ImagePlus, ChevronDown } from "lucide-react";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import SiteTheme from "@/components/SiteTheme";

import PreviewPanel from "@/components/admin/preview/PreviewPanel";
import { siteConfig } from "@/data/siteConfig";

const sections = [
  { id: "hero", name: "Hero Section" },
  { id: "about", name: "About Section" },
  { id: "stats", name: "Statistics Section" },
  { id: "services", name: "Services Section" },
  { id: "projects", name: "Projects Section" },
  { id: "contact", name: "Contact Section" },
] as const;

type SectionId = (typeof sections)[number]["id"];

const sectionComponents = {
  hero: Hero,
  about: About,
  stats: Stats,
  services: Services,
  projects: Projects,
  contact: Contact,
};

export default function ContentPage() {
  const [selectedSection, setSelectedSection] = useState<SectionId>("hero");

  const SelectedComponent = sectionComponents[selectedSection];

  const selectedName =
    sections.find((section) => section.id === selectedSection)?.name ??
    "Section";

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-admin-text">
          Content Management
        </h1>
        <p className="mt-2 text-admin-muted">
          Select a website section and preview its appearance.
        </p>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-6">
          <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
            <h2 className="mb-5 text-lg font-bold">Select Section</h2>

            <div className="relative">
              <select
                value={selectedSection}
                onChange={(event) =>
                  setSelectedSection(event.target.value as SectionId)
                }
                className="w-full appearance-none rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 pr-10 text-sm font-semibold text-amber-900 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-300 outline-none focus:ring-2 focus:ring-amber-400"
              >
                {sections.map((section) => (
                  <option
                    key={section.id}
                    value={section.id}
                    className="bg-admin-surface text-admin-text"
                  >
                    {section.name}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-amber-800 dark:text-amber-300"
              />
            </div>
          </section>

          <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
            <h2 className="mb-6 text-lg font-bold">{selectedName} Content</h2>

            {selectedSection === "hero" ? (
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Heading
                  </label>
                  <input
                    type="text"
                    readOnly
                    defaultValue={siteConfig.hero.title}
                    className="w-full rounded-lg border border-admin-border bg-admin-subtle px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Tagline
                  </label>
                  <input
                    type="text"
                    readOnly
                    defaultValue={siteConfig.company.tagline}
                    className="w-full rounded-lg border border-admin-border bg-admin-subtle px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    rows={5}
                    readOnly
                    defaultValue={siteConfig.company.description}
                    className="w-full resize-none rounded-lg border border-admin-border bg-admin-subtle px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Button Text
                  </label>
                  <input
                    type="text"
                    readOnly
                    defaultValue={siteConfig.hero.buttonText}
                    className="w-full rounded-lg border border-admin-border bg-admin-subtle px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Background Image
                  </label>
                  <div className="flex h-28 items-center justify-center rounded-lg border-2 border-dashed border-admin-border bg-admin-subtle">
                    <ImagePlus size={27} className="text-admin-faint" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    readOnly
                    defaultValue={selectedName}
                    className="w-full rounded-lg border border-admin-border bg-admin-subtle px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Section Description
                  </label>
                  <textarea
                    rows={5}
                    readOnly
                    placeholder="Section description"
                    className="w-full resize-none rounded-lg border border-admin-border bg-admin-subtle px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Section Image
                  </label>
                  <div className="flex h-28 items-center justify-center rounded-lg border-2 border-dashed border-admin-border bg-admin-subtle">
                    <ImagePlus size={27} className="text-admin-faint" />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 py-3 font-semibold text-slate-950">
              <Save size={17} />
              Save Content
            </div>
          </section>
        </div>

        <PreviewPanel
          title={`${selectedName} Preview`}
          description="Preview of the selected website section"
        >
          <div className="overflow-hidden rounded-lg shadow-lg">
            <SiteTheme>
              <div className="bg-brand-background text-brand-text">
                <SelectedComponent />
              </div>
            </SiteTheme>
          </div>
        </PreviewPanel>
      </div>
    </div>
  );
}
