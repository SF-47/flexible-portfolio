import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import ScrollToTop from "@/components/portfolio/ScrollToTop";
import SiteTheme from "@/components/SiteTheme";
import SectionRenderer from "@/components/portfolio/sections/SectionRederer";
import type { Metadata } from "next";
import { getMediaUrl } from "@/lib/mediaUrl";

import { getSections } from "@/lib/sections";
import { getCompanyServices } from "@/lib/companyServices";
import { getProjects } from "@/lib/projects";
import { getSiteSettings } from "@/lib/siteSettings";
import { getNavigation } from "@/lib/navigation";
import { getSocialLinks } from "@/lib/socialLinks";
import { getActiveTheme } from "@/lib/themes";
import { getMedia } from "@/lib/media";

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
      </main>
    </SiteTheme>
  );
}
