import { createContext } from "react";

// A compact summary of the relational cards, shown under the Services and Projects
// headings. The cards themselves are edited on /admin/services and /admin/projects.
export type CatalogSummary = {
  services: { id: number; title: string; isActive: boolean }[];
  projects: { id: number; title: string; isFeatured: boolean }[];
};

export const CatalogContext = createContext<CatalogSummary>({
  services: [],
  projects: [],
});
