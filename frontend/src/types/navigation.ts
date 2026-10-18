export type NavigationItem = {
  id: number;
  label: string;
  linkType: string;
  sectionId: string | null;
  sectionType: string | null;
  url: string | null;
  sortOrder: number;
  openInNewTab: boolean;
};
