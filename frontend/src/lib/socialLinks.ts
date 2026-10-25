import "server-only";

import { axiosClient } from "@/lib/axios";
import type { AdminSocialLink, SocialLink } from "@/types/socialLink";

export async function getSocialLinks(): Promise<SocialLink[]> {
  const response = await axiosClient.get<SocialLink[]>("/api/social-links");

  return response.data;
}

export async function getAdminSocialLinks(): Promise<AdminSocialLink[]> {
  const response = await axiosClient.get<AdminSocialLink[]>(
    "/api/admin/social-links",
  );

  return response.data;
}
