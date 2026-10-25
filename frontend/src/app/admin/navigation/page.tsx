import type { Metadata } from "next";
import NavigationEditor from "@/components/admin/navigation/NavigationEditor";
import { getAdminSections } from "@/lib/adminSections";
import { getMedia } from "@/lib/media";
import { getAdminNavigation } from "@/lib/navigation";
import { getSiteSettings } from "@/lib/siteSettings";
import { getAdminSocialLinks } from "@/lib/socialLinks";

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
