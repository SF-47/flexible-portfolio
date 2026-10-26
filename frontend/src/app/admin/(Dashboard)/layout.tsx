import type { ReactNode } from "react";
import type { Metadata } from "next";

import AdminShell from "@/components/admin/AdminShell";
import SiteTheme from "@/components/SiteTheme";
import { getMedia } from "@/lib/api/media";
import { getMediaUrl } from "@/lib/ui/mediaUrl";
import { getSiteSettings } from "@/lib/api/siteSettings";
import { getActiveTheme } from "@/lib/api/themes";
import type { Theme } from "@/types/theme";

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

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  let theme: Theme | null = null;

  try {
    theme = await getActiveTheme();
  } catch {
    // Without the API the admin falls back to its neutral default palette.
  }

  const shell = <AdminShell>{children}</AdminShell>;

  return theme ? <SiteTheme theme={theme}>{shell}</SiteTheme> : shell;
}
