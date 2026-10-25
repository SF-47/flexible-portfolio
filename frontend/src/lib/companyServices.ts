import "server-only";

import { axiosClient } from "@/lib/axios";
import type {
  AdminCompanyService,
  CompanyService,
} from "@/types/companyService";

export async function getCompanyServices(): Promise<CompanyService[]> {
  const response = await axiosClient.get<CompanyService[]>(
    "/api/company-services",
  );

  return response.data;
}

export async function getAdminCompanyServices(): Promise<
  AdminCompanyService[]
> {
  const response = await axiosClient.get<AdminCompanyService[]>(
    "/api/admin/services",
  );

  return response.data;
}
