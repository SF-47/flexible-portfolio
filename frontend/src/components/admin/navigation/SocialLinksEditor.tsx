"use client";

import { useState } from "react";
import { Globe } from "lucide-react";

import Combobox from "@/components/admin/Combobox";
import { ComboField, InputField } from "@/components/admin/navigation/fields";
import ListRow from "@/components/admin/navigation/ListRow";
import { httpUrl } from "@/schemas/navigationSchemas";
import {
  knownPlatform,
  platformIcon,
  socialPlatforms,
} from "@/lib/site/socialPlatforms";

export type SocialRow = {
  key: string;
  id: number | null;
  platform: string;
  // True when the platform is not one of the built-in ones (shown with a globe icon).
  custom: boolean;
  url: string;
  isVisible: boolean;
};

const MAX_LINKS = 12;
const OTHERS = "Others";

// Every platform with its own icon, then "Others" (generic globe icon).
const platformOptions = [
  ...socialPlatforms.map(({ value, Icon }) => ({
    value,
    label: value === "X" ? "X / Twitter" : value,
    keywords: value === "X" ? "twitter x" : "",
    icon: <Icon size={16} aria-hidden="true" />,
  })),
  {
    value: OTHERS,
    label: "Others",
    keywords: "other custom website",
    icon: <Globe size={16} aria-hidden="true" />,
  },
];

export function toSocialRow(item: {
  id: number;
  platform: string;
  url: string;
  isVisible: boolean;
}): SocialRow {
  return {
    key: `saved-${item.id}`,
    id: item.id,
    platform: item.platform,
    custom: knownPlatform(item.platform) === undefined,
    url: item.url,
    isVisible: item.isVisible,
  };
}

// What is sent to the API (the key and the custom flag are only for the editor).
export function socialPayload(rows: SocialRow[]) {
  return rows.map((row) => ({
    id: row.id,
    platform: row.custom ? row.platform.trim() : row.platform,
    url: row.url.trim(),
    isVisible: row.isVisible,
  }));
}

// Returns a friendly problem description, or null when the entry can be saved.
function fieldError(
  platform: string,
  custom: boolean,
  url: string,
  others: SocialRow[],
): string | null {
  const name = platform.trim();

  if (!name) return custom ? "Enter the platform name." : "Choose a platform.";
  if (name.length > 50)
    return "The platform name can have at most 50 characters.";
  if (/[<>\u0000-\u001f]/.test(name))
    return "The platform name can only contain letters, numbers and common punctuation.";
  if (custom && knownPlatform(name))
    return `Choose ${knownPlatform(name)} from the platform list instead.`;

  const normalized = knownPlatform(name) ?? name.toLowerCase();

  if (
    others.some(
      (row) =>
        (knownPlatform(row.platform) ?? row.platform.trim().toLowerCase()) ===
        normalized,
    )
  ) {
    return `${knownPlatform(name) ?? name} is already in the list.`;
  }

  if (!url.trim()) return "Enter the profile address.";

  return httpUrl.safeParse(url.trim()).success
    ? null
    : "Enter a full address starting with http:// or https://";
}

export function socialRowError(
  row: SocialRow,
  rows: SocialRow[],
): string | null {
  return fieldError(
    row.platform,
    row.custom,
    row.url,
    rows.filter((other) => other.key !== row.key),
  );
}

export default function SocialLinksEditor({
  rows,
  onChange,
  disabled,
  newKey,
}: {
  rows: SocialRow[];
  onChange: (rows: SocialRow[]) => void;
  disabled: boolean;
  newKey: () => string;
}) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [choice, setChoice] = useState("");
  const [customName, setCustomName] = useState("");
  const [url, setUrl] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const isOthers = choice === OTHERS;
  const chosen = platformOptions.find((option) => option.value === choice);
  const draftError = fieldError(
    isOthers ? customName : choice,
    isOthers,
    url,
    rows,
  );

  function update(key: string, changes: Partial<SocialRow>) {
    onChange(
      rows.map((row) => (row.key === key ? { ...row, ...changes } : row)),
    );
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= rows.length || from === to) return;

    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  }

  function closeForm() {
    setAdding(false);
    setChoice("");
    setCustomName("");
    setUrl("");
    setShowErrors(false);
  }

  // Adds the entry to the unsaved list; nothing is stored until Save Changes.
  function confirmAdd(event: React.FormEvent) {
    event.preventDefault();

    if (draftError) {
      setShowErrors(true);
      return;
    }

    onChange([
      ...rows,
      {
        key: newKey(),
        id: null,
        platform: isOthers ? customName.trim() : choice,
        custom: isOthers,
        url: url.trim(),
        isVisible: true,
      },
    ]);
    closeForm();
  }

  function remove(row: SocialRow) {
    if (
      !window.confirm(
        `Remove the ${row.platform} link? The change is saved when you click Save Changes.`,
      )
    ) {
      return;
    }

    onChange(rows.filter((item) => item.key !== row.key));
  }

  return (
    <section className="rounded-xl border border-admin-border bg-admin-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-admin-border p-6">
        <h2 className="text-xl font-bold">Social Links</h2>

        <Combobox
          variant="button"
          ariaLabel="Add Social Link"
          placeholder="+ Add Social Link"
          value=""
          disabled={disabled || rows.length >= MAX_LINKS}
          onChange={(value) => {
            setChoice(value);
            setAdding(true);
            setShowErrors(false);
          }}
          options={platformOptions}
        />
      </div>

      {adding && choice && (
        <form
          onSubmit={confirmAdd}
          noValidate
          aria-label="Add a social link"
          className="space-y-4 border-b border-admin-border bg-admin-subtle p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <span className="mb-2 block text-sm font-medium">Platform</span>
              <p className="flex items-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-4 py-3 text-sm font-semibold">
                {chosen?.icon}
                {chosen?.label}
              </p>
            </div>

            {isOthers && (
              <InputField
                label="Platform name"
                placeholder="For example: Behance"
                value={customName}
                disabled={disabled}
                onChange={setCustomName}
              />
            )}

            <div className={isOthers ? "md:col-span-2" : ""}>
              <InputField
                label="Profile address"
                placeholder="https://www.example.com/yourcompany"
                value={url}
                disabled={disabled}
                onChange={setUrl}
              />
            </div>
          </div>

          {isOthers && (
            <p className="flex items-center gap-2 text-xs text-admin-muted">
              <Globe size={14} aria-hidden="true" />
              Other platforms use a generic globe icon on the website.
            </p>
          )}

          {showErrors && draftError && (
            <p role="alert" className="text-sm text-red-700">
              {draftError}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={disabled}
              className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
            >
              Add
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg border border-admin-border px-4 py-2 text-sm font-semibold hover:bg-admin-bg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {rows.length === 0 ? (
        <p className="px-6 py-8 text-center text-sm text-admin-muted">
          No social links yet.
        </p>
      ) : (
        <ul className="divide-y divide-admin-border">
          {rows.map((row, index) => {
            const Icon = platformIcon(row.platform) ?? Globe;

            return (
              <ListRow
                key={row.key}
                listId="social"
                name={`${row.platform || "social"} link`}
                compact
                showMoveButtons={false}
                index={index}
                count={rows.length}
                disabled={disabled}
                isVisible={row.isVisible}
                onToggleVisible={() =>
                  update(row.key, { isVisible: !row.isVisible })
                }
                editing={editingKey === row.key}
                onToggleEdit={() =>
                  setEditingKey(editingKey === row.key ? null : row.key)
                }
                onMove={move}
                onDelete={() => remove(row)}
                error={socialRowError(row, rows)}
                summary={
                  <div className="flex items-center gap-3">
                    <Icon size={18} aria-hidden="true" className="shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">
                        {row.platform || "Other platform"}
                      </p>
                      <p className="truncate text-xs text-admin-muted">
                        {row.url || "No address yet"}
                      </p>
                    </div>
                  </div>
                }
              >
                <ComboField
                  label="Platform"
                  value={row.custom ? OTHERS : row.platform}
                  disabled={disabled}
                  onChange={(value) =>
                    value === OTHERS
                      ? update(row.key, {
                          custom: true,
                          platform: row.custom ? row.platform : "",
                        })
                      : update(row.key, { custom: false, platform: value })
                  }
                  options={platformOptions}
                />
                {row.custom && (
                  <InputField
                    label="Platform name"
                    value={row.platform}
                    disabled={disabled}
                    onChange={(platform) => update(row.key, { platform })}
                  />
                )}
                <InputField
                  label="Profile address"
                  placeholder="https://www.example.com/yourcompany"
                  value={row.url}
                  disabled={disabled}
                  onChange={(value) => update(row.key, { url: value })}
                />
              </ListRow>
            );
          })}
        </ul>
      )}
    </section>
  );
}
