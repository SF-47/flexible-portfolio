export type SectionType =
  | "hero"
  | "about"
  | "stats"
  | "services"
  | "projects"
  | "contact"
  | "whyChooseUs"
  | "testimonials"
  | "clients"
  | "team"
  | "faq"
  | "process"
  | "gallery"
  | "cta"
  | "certifications";

export interface SectionConfig {
  id: string;
  type: SectionType;
  order: number;
  isVisible: boolean;
}
