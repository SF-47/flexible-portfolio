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