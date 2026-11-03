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

// What the admin API returns: hidden links are included.
export type AdminNavigationItem = {
  id: number;
  label: string;
  linkType: string;
  sectionId: string | null;
  url: string | null;
  sortOrder: number;
  isVisible: boolean;
  openInNewTab: boolean;
};
