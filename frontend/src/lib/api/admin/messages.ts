import "server-only";

import { adminClient, adminRead } from "@/lib/api/admin/client";
import type { AdminContactMessage } from "@/types/contactMessage";

export async function getAdminMessages(): Promise<AdminContactMessage[]> {
  return adminRead(async () => {
    const response = await adminClient.get<AdminContactMessage[]>(
      "/api/admin/messages",
    );

    return response.data;
  });
}
