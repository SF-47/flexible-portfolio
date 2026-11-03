import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import ScrollToTop from "@/components/portfolio/ScrollToTop";
import ScrollReset from "@/components/portfolio/ScrollReset";
import SiteTheme from "@/components/SiteTheme";
import SectionRenderer from "@/components/portfolio/sections/SectionRenderer";
import type { Metadata } from "next";
import { getMediaUrl } from "@/lib/ui/mediaUrl";

import { getSections } from "@/lib/api/sections";
import { getCompanyServices } from "@/lib/api/companyServices";
import { getProjects } from "@/lib/api/projects";
import { getSiteSettings } from "@/lib/api/siteSettings";
import { getNavigation } from "@/lib/api/navigation";
import { getSocialLinks } from "@/lib/api/socialLinks";
import { getActiveTheme } from "@/lib/api/themes";
import { getMedia } from "@/lib/api/media";

export async function generateMetadata(): Promise<Metadata> {
  const [siteSettings, media] = await Promise.all([
    getSiteSettings(),
    getMedia(),
  ]);

  const title = siteSettings.seoTitle?.trim() || siteSettings.companyName;

  const description =
    siteSettings.seoDescription?.trim() ||
    siteSettings.description ||
    `Welcome to ${siteSettings.companyName}.`;

  const faviconUrl = getMediaUrl(siteSettings.faviconMediaId, media);

  return {
    title,
    description,

    icons: faviconUrl
      ? {
          icon: faviconUrl,
        }
      : undefined,

    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function Home() {
  const [
    sections,
    services,
    projects,
    siteSettings,
    navigation,
    socialLinks,
    activeTheme,
    media,
  ] = await Promise.all([
    getSections(),
    getCompanyServices(),
    getProjects(),
    getSiteSettings(),
    getNavigation(),
    getSocialLinks(),
    getActiveTheme(),
    getMedia(),
  ]);

  return (
    <SiteTheme theme={activeTheme}>
      <main className="min-h-screen bg-brand-primary text-brand-on-primary">
        <Navbar
          siteSettings={siteSettings}
          navigation={navigation}
          media={media}
          navbarVariant={activeTheme.navbarVariant}
        />

        <SectionRenderer
          sections={sections}
          services={services}
          projects={projects}
          siteSettings={siteSettings}
          media={media}
        />

        <Footer
          siteSettings={siteSettings}
          navigation={navigation}
          socialLinks={socialLinks}
        />

        <ScrollToTop />
        <ScrollReset />
      </main>
    </SiteTheme>
  );
}
