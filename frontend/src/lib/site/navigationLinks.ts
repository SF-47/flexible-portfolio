import type { NavigationItem } from "@/types/navigation";

const sectionAnchors: Record<string, string> = {
  hero: "home",
  about: "about",
  stats: "stats",
  services: "services",
  whyChooseUs: "why-choose-us",
  projects: "projects",
  process: "process",
  gallery: "gallery",
  team: "team",
  clients: "clients",
  testimonials: "testimonials",
  certifications: "certifications",
  faq: "faq",
  cta: "cta",
  contact: "contact",
};

export function getNavigationHref(item: NavigationItem): string | null {
  if (item.linkType.toLowerCase() === "section") {
    if (!item.sectionType) return null;

    const anchor = sectionAnchors[item.sectionType];

    return anchor ? `#${anchor}` : null;
  }

  if (!item.url) return null;

  // Allow website-relative URLs and safe HTTP(S) destinations.
  if (item.url.startsWith("/") && !item.url.startsWith("//")) {
    return item.url;
  }

  try {
    const url = new URL(item.url);

    if (url.protocol === "https:" || url.protocol === "http:") {
      return item.url;
    }
  } catch {
    return null;
  }

  return null;
}
