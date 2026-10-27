import "server-only";

import { adminClient, adminRead } from "@/lib/api/admin/client";
import { axiosClient } from "@/lib/api/client";
import type { AdminSocialLink, SocialLink } from "@/types/socialLink";

export async function getSocialLinks(): Promise<SocialLink[]> {
  const response = await axiosClient.get<SocialLink[]>("/api/social-links");

  return response.data;
}

export async function getAdminSocialLinks(): Promise<AdminSocialLink[]> {
  return adminRead(async () => {
    const response = await adminClient.get<AdminSocialLink[]>(
      "/api/admin/social-links",
    );

    return response.data;
  });
}
