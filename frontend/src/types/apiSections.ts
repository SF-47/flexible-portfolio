import type { SectionType } from "@/types/section";

export type ApiSection = {
  id: string;
  type: SectionType;
  name: string;
  variant: string;
  order: number;
  isVisible: boolean;
  navLabel: string | null;
  contentJson: string;
  settingsJson: string;
};
