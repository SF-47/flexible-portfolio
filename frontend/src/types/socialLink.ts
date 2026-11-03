export type SocialLink = {
  id: number;
  platform: string;
  url: string;
  sortOrder: number;
};

// What the admin API returns: hidden links are included.
export type AdminSocialLink = SocialLink & { isVisible: boolean };
