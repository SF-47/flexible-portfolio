import "server-only";

import { axiosClient } from "@/lib/axios";
import type { CompanyService } from "@/types/companyService";

export async function getCompanyServices(): Promise<CompanyService[]> {
  const response = await axiosClient.get<CompanyService[]>(
    "/api/company-services",
  );

  return response.data;
}
