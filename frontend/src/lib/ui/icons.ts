import { createElement } from "react";
import * as lucide from "lucide-react";
import type { LucideIcon, LucideProps } from "lucide-react";

// The one place that turns an icon NAME stored in ContentJson (e.g. "ShieldCheck")
// into a Lucide component. The public section components and the editor's icon
// picker both use it, so they always agree on which names are valid.
//
// It imports the whole icon library, so only import it from:
//  - server components (the public site: the icons are rendered to HTML on the
//    server and add nothing to the JavaScript sent to visitors), and
//  - admin code that is loaded on demand (the icon picker chunk, the preview iframe).
// Never import it from code that every page loads.

// Canonical Lucide names, e.g. "BuildingComplex".
const registry = lucide.icons as Record<string, LucideIcon>;

// Lucide renames icons and keeps the old names as aliases (Building2 is now
// BuildingComplex, HelpCircle is CircleQuestionMark). Saved content may still use
// an old name, so aliases are found by comparing the component each export points to.
const aliases = new Map<string, string>();

{
  const canonicalByComponent = new Map<unknown, string>();

  for (const [name, component] of Object.entries(registry)) {
    canonicalByComponent.set(component, name);
  }

  for (const [name, value] of Object.entries(lucide)) {
    if (Object.hasOwn(registry, name)) continue;

    const canonical = canonicalByComponent.get(value);

    if (canonical) aliases.set(name, canonical);
  }
}

// All canonical icon names (what the picker offers), alphabetically.
export const iconNames: string[] = Object.keys(registry);

// The canonical name for a stored name (old aliases included), or null if unknown.
// Only names found in the library are accepted: nothing is evaluated or imported
// from the string, it is only used as a lookup key.
export function canonicalIconName(
  name: string | null | undefined,
): string | null {
  if (!name) return null;
  if (Object.hasOwn(registry, name)) return name;

  return aliases.get(name) ?? null;
}

// The icon for a stored name, or the fallback when the name is unknown or empty.
export function resolveIcon(
  name: string | null | undefined,
  fallback: LucideIcon,
): LucideIcon {
  const canonical = canonicalIconName(name);

  return canonical ? registry[canonical] : fallback;
}

// Renders the icon for a stored name (the fallback when it is unknown). Section
// components use this instead of looking an icon up themselves, so every section
// resolves names the same way:  <IconByName icon={item.icon} fallback={BadgeCheck} size={27} />
export function IconByName({
  icon,
  fallback,
  ...props
}: LucideProps & { icon: string | null | undefined; fallback: LucideIcon }) {
  return createElement(resolveIcon(icon, fallback), props);
}
