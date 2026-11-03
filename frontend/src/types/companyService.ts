export type CompanyService = {
  id: number;
  title: string;
  description: string;
  iconName: string | null;
  imageMediaId: number | null;
  sortOrder: number;
};

// What the admin API returns: inactive services are included.
export type AdminCompanyService = CompanyService & {
  isActive: boolean;
  updatedAt: string;
};
