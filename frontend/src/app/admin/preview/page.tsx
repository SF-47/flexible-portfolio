import type { Metadata } from "next";
import { unstable_rethrow } from "next/navigation";

import SiteTheme from "@/components/SiteTheme";
import { requireAdminSession } from "@/lib/api/admin/client";
import { getAdminSections } from "@/lib/api/admin/sections";
import { getCompanyServices } from "@/lib/api/companyServices";
import { getMedia } from "@/lib/api/media";
import { getProjects } from "@/lib/api/projects";
import { getSiteSettings } from "@/lib/api/siteSettings";
import { getActiveTheme } from "@/lib/api/themes";
import LiveSectionPreview from "@/components/admin/preview/LiveSectionPreview";

export const metadata: Metadata = {
  title: "Section preview",
  robots: { index: false, follow: false },
};

async function loadPreviewData() {
  try {
    const [sections, services, projects, siteSettings, activeTheme, media] =
      await Promise.all([
        getAdminSections(),
        getCompanyServices(),
        getProjects(),
        getSiteSettings(),
        getActiveTheme(),
        getMedia(),
      ]);

    return { sections, services, projects, siteSettings, activeTheme, media };
  } catch (error) {
    // A lost session redirects to the login instead of showing this message.
    unstable_rethrow(error);

    console.error("Unable to load section preview data", error);

    return null;
  }
}

function Message({ children }: { children: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-8 text-center text-sm text-slate-600">
      {children}
    </div>
  );
}

export default async function SectionPreviewPage({
  searchParams,
}: PageProps<"/admin/preview">) {
  // The preview is outside the dashboard layout, so it checks the session itself.
  await requireAdminSession();

  const { section: sectionParam } = await searchParams;
  const type = Array.isArray(sectionParam) ? sectionParam[0] : sectionParam;

  const data = await loadPreviewData();

  if (!data)
    return <Message>Unable to load the preview. Please try again.</Message>;

  const section = data.sections.find((item) => item.type === type);

  if (!section) return <Message>This section does not exist.</Message>;

  return (
    <SiteTheme theme={data.activeTheme}>
      {/* inert keeps the preview read-only: nothing inside can be clicked or submitted. */}
      <main inert className="bg-brand-primary text-brand-on-primary">
        {/* A hidden section is previewed too, so it is always rendered as visible. */}
        <LiveSectionPreview
          section={section}
          services={data.services}
          projects={data.projects}
          siteSettings={data.siteSettings}
          media={data.media}
        />
      </main>
    </SiteTheme>
  );
}
