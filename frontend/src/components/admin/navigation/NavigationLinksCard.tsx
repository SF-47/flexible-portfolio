"use client";

import { AlertTriangle, ExternalLink, Menu } from "lucide-react";

import Combobox from "@/components/admin/Combobox";

import ListRow from "@/components/admin/navigation/ListRow";
import { navLabels, sectionAnchors } from "@/lib/sectionAnchors";
import type { ApiSection } from "@/types/apiSections";
import type { AdminNavigationItem } from "@/types/navigation";

// One row of the menu. Admins can only change isVisible and the order; the name and
// destination come from the predefined section (or, for older custom links, the
// stored record, which is kept as it is).
export type NavRow = {
  key: string;
  // null for a predefined section that has no menu link yet.
  id: number | null;
  sectionId: string | null;
  label: string;
  linkType: string;
  url: string | null;
  isVisible: boolean;
};

// The saved links in order, followed by the sections that are not in the menu yet.
export function toNavRows(
  items: AdminNavigationItem[],
  sections: ApiSection[],
): NavRow[] {
  const rows: NavRow[] = items.map((item) => ({
    key: `saved-${item.id}`,
    id: item.id,
    sectionId: item.sectionId,
    label: item.label,
    linkType: item.linkType,
    url: item.url,
    isVisible: item.isVisible,
  }));

  for (const section of sections) {
    if (items.some((item) => item.sectionId === section.id)) continue;

    rows.push({
      key: `section-${section.id}`,
      id: null,
      sectionId: section.id,
      label: navLabels[section.type],
      linkType: "section",
      url: null,
      isVisible: false,
    });
  }

  // The menu shows the visible links in order; links that are not in the menu follow.
  return [
    ...rows.filter((row) => row.isVisible),
    ...rows.filter((row) => !row.isVisible),
  ];
}

// What is sent to the API: every saved link, plus a section that was switched on.
export function navPayload(rows: NavRow[]) {
  return rows
    .filter((row) => row.id !== null || row.isVisible)
    .map((row) => ({
      id: row.id,
      sectionId: row.id === null ? row.sectionId : null,
      isVisible: row.isVisible,
    }));
}

export default function NavigationLinksCard({
  rows,
  onChange,
  sections,
  disabled,
}: {
  rows: NavRow[];
  onChange: (rows: NavRow[]) => void;
  sections: ApiSection[];
  disabled: boolean;
}) {
  // Only the links that are in the menu are listed; the others can be added back.
  const menu = rows.filter((row) => row.isVisible);
  const available = rows.filter((row) => !row.isVisible);

  const labelOf = (row: NavRow) => {
    const section = sections.find((item) => item.id === row.sectionId);

    return section ? sectionAnchors[section.type].label : row.label;
  };

  // Keeps the menu links first so the saved order matches what is shown.
  function commit(nextMenu: NavRow[], nextAvailable: NavRow[]) {
    onChange([...nextMenu, ...nextAvailable]);
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= menu.length || from === to) return;

    const next = [...menu];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    commit(next, available);
  }

  // Hides the link in the menu; the record is kept and can be added back.
  function removeFromMenu(key: string) {
    const row = menu.find((item) => item.key === key);

    if (!row) return;

    commit(
      menu.filter((item) => item.key !== key),
      [...available, { ...row, isVisible: false }],
    );
  }

  function addToMenu(key: string) {
    const row = available.find((item) => item.key === key);

    if (!row) return;

    commit(
      [...menu, { ...row, isVisible: true }],
      available.filter((item) => item.key !== key),
    );
  }

  return (
    <section className="rounded-xl border border-admin-border bg-admin-surface">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-admin-border p-6">
        <div>
          <div className="flex items-center gap-3">
            <Menu className="text-admin-accent" />
            <h2 className="text-xl font-bold">Navigation Links</h2>
          </div>
          <p className="mt-2 text-sm text-admin-muted">
            These sections appear in the website menu. Drag a row to reorder it.
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <Combobox
            variant="button"
            ariaLabel="Add Section to Menu"
            placeholder="+ Add Section to Menu"
            value=""
            disabled={disabled || available.length === 0}
            onChange={addToMenu}
            options={available.map((row) => {
              const section = sections.find(
                (item) => item.id === row.sectionId,
              );

              return {
                value: row.key,
                label:
                  labelOf(row) +
                  (section && !section.isVisible
                    ? " (section hidden on website)"
                    : ""),
              };
            })}
          />
        </div>
      </div>

      {menu.length === 0 && (
        <p className="px-6 py-8 text-center text-sm text-admin-muted">
          No sections in the menu. Use “Add Section to Menu” to add one.
        </p>
      )}

      <ul className="divide-y divide-admin-border">
        {menu.map((row, index) => {
          const section = sections.find((item) => item.id === row.sectionId);
          const isSection = row.linkType === "section";
          const isDuplicate =
            isSection &&
            row.sectionId !== null &&
            menu.findIndex(
              (item) =>
                item.id !== null &&
                item.linkType === "section" &&
                item.sectionId === row.sectionId,
            ) !== index &&
            row.id !== null;

          return (
            <ListRow
              key={row.key}
              listId="navigation"
              name={`${row.label} link`}
              compact
              index={index}
              count={menu.length}
              disabled={disabled}
              isVisible={row.isVisible}
              onRemove={() => removeFromMenu(row.key)}
              editing={false}
              onMove={move}
              error={null}
              summary={
                <>
                  <p className="font-semibold">{row.label}</p>
                  <p className="flex items-center gap-1.5 truncate text-sm text-admin-muted">
                    {isSection && section ? (
                      <>
                        Goes to {sectionAnchors[section.type].label}
                        {isDuplicate && " — duplicate link"}
                      </>
                    ) : isSection ? (
                      "Links to a section that no longer exists"
                    ) : (
                      <>
                        <ExternalLink size={14} className="shrink-0" />
                        <span className="truncate">
                          {row.url} — custom link, kept as it is
                        </span>
                      </>
                    )}
                  </p>
                  {isSection && section && !section.isVisible && (
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-amber-700">
                      <AlertTriangle size={13} className="shrink-0" />
                      This section is hidden on the website, so its menu link
                      cannot appear publicly yet.
                    </p>
                  )}
                </>
              }
            />
          );
        })}
      </ul>
    </section>
  );
}
