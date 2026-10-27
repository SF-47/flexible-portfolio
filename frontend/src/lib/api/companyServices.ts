import "server-only";

import { adminClient, adminRead } from "@/lib/api/admin/client";
import { axiosClient } from "@/lib/api/client";
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
  return adminRead(async () => {
    const response = await adminClient.get<AdminCompanyService[]>(
      "/api/admin/services",
    );

    return response.data;
  });
}
