import "server-only";

import { axiosClient } from "@/lib/axios";
import type { SocialLink } from "@/types/socialLink";

export async function getSocialLinks(): Promise<SocialLink[]> {
  const response = await axiosClient.get<SocialLink[]>("/api/social-links");

  return response.data;
}
