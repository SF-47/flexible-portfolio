import type { Metadata } from "next";

import SiteTheme from "@/components/SiteTheme";
import { getAdminSections } from "@/lib/adminSections";
import { getCompanyServices } from "@/lib/companyServices";
import { getMedia } from "@/lib/media";
import { getProjects } from "@/lib/projects";
import { getSiteSettings } from "@/lib/siteSettings";
import { getActiveTheme } from "@/lib/themes";
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
