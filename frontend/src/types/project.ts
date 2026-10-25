export type Project = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  location: string | null;
  completionDate: string | null;
  featuredImageId: number | null;
  isFeatured: boolean;
  sortOrder: number;
};

// What the admin API returns: the full description and the timestamp used to detect
// changes made by someone else.
export type AdminProject = Project & {
  fullDescription: string | null;
  updatedAt: string;
};

// The public project page.
export type ProjectDetail = Omit<Project, "sortOrder"> & {
  fullDescription: string | null;
};
