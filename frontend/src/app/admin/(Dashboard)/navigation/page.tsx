import type { Metadata } from "next";
import NavigationEditor from "@/components/admin/navigation/NavigationEditor";
import { getAdminSections } from "@/lib/api/admin/sections";
import { getMedia } from "@/lib/api/media";
import { getAdminNavigation } from "@/lib/api/navigation";
import { getSiteSettings } from "@/lib/api/siteSettings";
import { getAdminSocialLinks } from "@/lib/api/socialLinks";

export const metadata: Metadata = { title: "Navigation & Footer" };

export const dynamic = "force-dynamic";

export default async function NavigationPage() {
  const [navigation, socialLinks, settings, sections, media] =
    await Promise.all([
      getAdminNavigation(),
      getAdminSocialLinks(),
      getSiteSettings(),
      getAdminSections(),
      getMedia(),
    ]);

  return (
    <NavigationEditor
      navigation={navigation}
      socialLinks={socialLinks}
      settings={settings}
      sections={sections}
      media={media}
    />
  );
}
