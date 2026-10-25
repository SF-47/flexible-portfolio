"use client";

import { useEffect, useRef, useState } from "react";

import StickyActionBar from "@/components/admin/StickyActionBar";
import ImageField from "@/components/admin/content/fields/ImageField";
import { MediaContext } from "@/components/admin/content/MediaContext";
import NavigationLinksCard, {
  navPayload,
  toNavRows,
} from "@/components/admin/navigation/NavigationLinksCard";
import SocialLinksEditor, {
  socialPayload,
  socialRowError,
  toSocialRow,
} from "@/components/admin/navigation/SocialLinksEditor";
import { UpdateBrandSchema } from "@/schemas/navigationSchemas";
import type { ApiSection } from "@/types/apiSections";
import type { MediaAsset } from "@/types/media";
import type { AdminNavigationItem } from "@/types/navigation";
import type { SiteSettings } from "@/types/siteSettings";
import type { AdminSocialLink } from "@/types/socialLink";

type Brand = {
  companyName: string;
  logoMediaId: number | null;
  footerDescription: string;
};

type AreaResult = { area: string; ok: boolean; message: string };

// The key is only for React and drag-and-drop; it is never sent to the API.
function withoutKey<T extends { key: string }>(rows: T[]) {
  return rows.map((row) => {
    const { key: _key, ...rest } = row;
    void _key;

    return rest;
  });
}

function toSocialRows(items: AdminSocialLink[]) {
  return items.map(toSocialRow);
}

async function putJson(url: string, body: unknown) {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => null);

    return response.ok
      ? { ok: true as const, data }
      : {
          ok: false as const,
          message: data?.message ?? "Could not save the changes.",
        };
  } catch {
    return {
      ok: false as const,
      message: "Network error. Could not reach the server.",
    };
  }
}

export default function NavigationEditor({
  navigation,
  socialLinks,
  settings,
  sections,
  media: initialMedia,
}: {
  navigation: AdminNavigationItem[];
  socialLinks: AdminSocialLink[];
  settings: SiteSettings;
  sections: ApiSection[];
  media: MediaAsset[];
}) {
  const [media, setMedia] = useState(initialMedia);

  const initialBrand: Brand = {
    companyName: settings.companyName,
    logoMediaId: settings.logoMediaId,
    footerDescription: settings.footerDescription ?? "",
  };

  // Each area keeps its own saved baseline, so a failed save keeps its changes.
  const [navRows, setNavRows] = useState(() => toNavRows(navigation, sections));
  const [savedNavRows, setSavedNavRows] = useState(navRows);
  const [socialRows, setSocialRows] = useState(() => toSocialRows(socialLinks));
  const [savedSocialRows, setSavedSocialRows] = useState(socialRows);
  const [brand, setBrand] = useState(initialBrand);
  const [savedBrandValue, setSavedBrandValue] = useState(initialBrand);
  const savedNav = JSON.stringify(withoutKey(savedNavRows));
  const savedSocial = JSON.stringify(withoutKey(savedSocialRows));
  const savedBrand = JSON.stringify(savedBrandValue);

  const [isSaving, setIsSaving] = useState(false);
  const [results, setResults] = useState<AreaResult[]>([]);
  const counter = useRef(0);

  const navDirty = JSON.stringify(withoutKey(navRows)) !== savedNav;
  const socialDirty = JSON.stringify(withoutKey(socialRows)) !== savedSocial;
  const brandDirty = JSON.stringify(brand) !== savedBrand;
  const isDirty = navDirty || socialDirty || brandDirty;

  const brandResult = UpdateBrandSchema.safeParse(brand);
  const brandError = brandResult.success
    ? null
    : brandResult.error.issues[0].message;

  const hasErrors =
    (socialDirty &&
      socialRows.some((row) => socialRowError(row, socialRows) !== null)) ||
    (brandDirty && brandError !== null);

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!isDirty) return;

    function warn(event: BeforeUnloadEvent) {
      event.preventDefault();
    }

    window.addEventListener("beforeunload", warn);

    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  function newKey() {
    counter.current += 1;

    return `new-${counter.current}`;
  }

  async function saveNavigation(): Promise<AreaResult> {
    const area = "Navigation links";
    const result = await putJson("/api/admin/navigation", {
      items: navPayload(navRows),
    });

    if (!result.ok) return { area, ok: false, message: result.message };

    const rows = toNavRows(result.data, sections);
    setNavRows(rows);
    setSavedNavRows(rows);

    return { area, ok: true, message: "Saved." };
  }

  async function saveSocial(): Promise<AreaResult> {
    const area = "Social links";
    const result = await putJson("/api/admin/social-links", {
      items: socialPayload(socialRows),
    });

    if (!result.ok) return { area, ok: false, message: result.message };

    const rows = toSocialRows(result.data);
    setSocialRows(rows);
    setSavedSocialRows(rows);

    return { area, ok: true, message: "Saved." };
  }

  async function saveBrand(): Promise<AreaResult> {
    const area = "Brand and footer";
    const result = await putJson("/api/admin/site-settings", brand);

    if (!result.ok) return { area, ok: false, message: result.message };

    const saved: Brand = {
      companyName: result.data.companyName,
      logoMediaId: result.data.logoMediaId,
      footerDescription: result.data.footerDescription ?? "",
    };
    setBrand(saved);
    setSavedBrandValue(saved);

    return { area, ok: true, message: "Saved." };
  }

  // Puts every area back to its last saved values. Nothing is sent to the server.
  function handleReset() {
    if (isSaving) return;

    setNavRows(savedNavRows);
    setSocialRows(savedSocialRows);
    setBrand(savedBrandValue);
    setResults([]);
  }

  // The three areas use separate API calls, so one can fail while the others succeed.
  // Each result is reported, and an area that failed keeps its unsaved changes.
  async function handleSave() {
    if (!isDirty || hasErrors || isSaving) return;

    setIsSaving(true);
    setResults([]);

    const tasks: Promise<AreaResult>[] = [];
    if (navDirty) tasks.push(saveNavigation());
    if (brandDirty) tasks.push(saveBrand());
    if (socialDirty) tasks.push(saveSocial());

    setResults(await Promise.all(tasks));
    setIsSaving(false);
  }

  // Once new edits are made, an all-saved report is stale; failures stay until resolved.
  const shownResults =
    isDirty && results.every((result) => result.ok) ? [] : results;

  const inputClass =
    "w-full rounded-lg border border-admin-border bg-admin-subtle px-4 py-3 disabled:opacity-60";

  return (
    <MediaContext.Provider
      value={{
        media,
        onUploaded: (asset) => setMedia((previous) => [asset, ...previous]),
      }}
    >
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Navigation & Footer</h1>
          <p className="mt-2 text-admin-muted">
            Organize website links and manage branding.
          </p>
        </div>

        <NavigationLinksCard
          rows={navRows}
          onChange={setNavRows}
          sections={sections}
          disabled={isSaving}
        />

        <div className="grid items-start gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
            <h2 className="mb-6 text-xl font-bold">Brand Identity</h2>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="company-name"
                  className="mb-2 block text-sm font-medium"
                >
                  Company Name
                </label>
                <input
                  id="company-name"
                  type="text"
                  value={brand.companyName}
                  disabled={isSaving}
                  onChange={(event) =>
                    setBrand({ ...brand, companyName: event.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <ImageField
                label="Navbar Logo (optional)"
                value={brand.logoMediaId}
                onChange={(logoMediaId) => setBrand({ ...brand, logoMediaId })}
                fit="contain"
                hint="PNG or WebP. Any size works; the proportions are kept. Without a logo, the company name is shown instead."
              />
            </div>
          </section>

          <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
            <h2 className="mb-6 text-xl font-bold">Footer Settings</h2>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="footer-description"
                  className="mb-2 block text-sm font-medium"
                >
                  Footer Description (optional)
                </label>
                <textarea
                  id="footer-description"
                  rows={4}
                  value={brand.footerDescription}
                  disabled={isSaving}
                  onChange={(event) =>
                    setBrand({
                      ...brand,
                      footerDescription: event.target.value,
                    })
                  }
                  className={`${inputClass} resize-none`}
                />
              </div>

              {brandDirty && brandError && (
                <p role="alert" className="text-sm text-red-700">
                  {brandError}
                </p>
              )}
            </div>
          </section>
        </div>

        <SocialLinksEditor
          rows={socialRows}
          onChange={setSocialRows}
          disabled={isSaving}
          newKey={newKey}
        />

        <StickyActionBar
          visible={isDirty || shownResults.length > 0}
          saving={isSaving}
          saveDisabled={!isDirty || hasErrors}
          resetDisabled={!isDirty}
          onReset={handleReset}
          onSave={handleSave}
          message={
            <>
              {isDirty && (
                <p className="text-amber-700">
                  {hasErrors
                    ? "Fix the highlighted problems before saving."
                    : "You have unsaved changes."}
                </p>
              )}
              {shownResults.length > 0 && (
                <ul className="space-y-0.5">
                  {shownResults.map((result) => (
                    <li
                      key={result.area}
                      className={result.ok ? "text-green-700" : "text-red-700"}
                    >
                      {result.area}:{" "}
                      {result.ok ? "saved." : `not saved — ${result.message}`}
                    </li>
                  ))}
                </ul>
              )}
            </>
          }
        />
      </div>
    </MediaContext.Provider>
  );
}
