import "server-only";

import { adminClient, adminRead } from "@/lib/api/admin/client";
import type { ApiSection } from "@/types/apiSections";

// Throws AdminAuthError when the session is gone: for Route Handlers, which answer 401.
export async function fetchAdminSections(): Promise<ApiSection[]> {
  const response = await adminClient.get<ApiSection[]>("/api/admin/sections");

  return response.data;
}

// For server components: a lost session redirects to the login.
export async function getAdminSections(): Promise<ApiSection[]> {
  return adminRead(fetchAdminSections);
}
