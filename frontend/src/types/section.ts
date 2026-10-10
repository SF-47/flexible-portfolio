export type SectionType =
  | "hero"
  | "about"
  | "stats"
  | "services"
  | "projects"
  | "contact";

export interface SectionConfig {
  id: string;
  type: SectionType;
  order: number;
  isVisible: boolean;
}
