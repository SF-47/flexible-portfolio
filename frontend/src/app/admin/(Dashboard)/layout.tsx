import type { ReactNode } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
import SiteTheme from "@/components/SiteTheme";
import { getAdminSession, LOGIN_PATH } from "@/lib/api/admin/client";
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
  // Checked on the server before any admin UI is rendered. An unreachable API is not a
  // logout: the administrator keeps the session and sees why nothing loads.
  const session = await getAdminSession();

  if (session.status === "unauthenticated") redirect(LOGIN_PATH);

  if (session.status === "unavailable") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 p-8 text-center">
        <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">
            The API server is unavailable
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Your session is still valid. Start the backend and reload this page.
          </p>
        </div>
      </main>
    );
  }

  let theme: Theme | null = null;

  try {
    theme = await getActiveTheme();
  } catch {
    // Without the API the admin falls back to its neutral default palette.
  }

  const shell = <AdminShell>{children}</AdminShell>;

  return theme ? <SiteTheme theme={theme}>{shell}</SiteTheme> : shell;
}
