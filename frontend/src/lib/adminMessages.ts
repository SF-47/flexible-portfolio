import "server-only";

import { axiosClient } from "@/lib/axios";
import type { AdminContactMessage } from "@/types/contactMessage";

export async function getAdminMessages(): Promise<AdminContactMessage[]> {
  const response = await axiosClient.get<AdminContactMessage[]>(
    "/api/admin/messages",
  );

  return response.data;
}
