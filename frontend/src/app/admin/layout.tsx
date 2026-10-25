import type { ReactNode } from "react";
import type { Metadata } from "next";

import AdminShell from "@/components/admin/AdminShell";
import { getMedia } from "@/lib/media";
import { getMediaUrl } from "@/lib/mediaUrl";
import { getSiteSettings } from "@/lib/siteSettings";

// Like the public site, the admin tab title and icon come from the Site Settings.
// Each admin page sets its own `title`, which fills the %s of the template below.
export async function generateMetadata(): Promise<Metadata> {
  let companyName = "";
  let faviconUrl: string | null = null;

  try {
    const [settings, media] = await Promise.all([
      getSiteSettings(),
      getMedia(),
    ]);

    companyName = settings.companyName;
    faviconUrl = getMediaUrl(settings.faviconMediaId, media);
  } catch {
    // The admin must still open when the API is unreachable.
  }

  const suffix = companyName ? `Admin | ${companyName}` : "Admin";

  return {
    title: { default: `Dashboard | ${suffix}`, template: `%s | ${suffix}` },
    description: "Manage your website content, navigation and appearance.",
    icons: faviconUrl ? { icon: faviconUrl } : undefined,
    // The admin is not a public page.
    robots: { index: false, follow: false },
  };
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
