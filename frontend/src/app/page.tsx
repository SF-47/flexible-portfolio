import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import SiteTheme from "@/components/SiteTheme";
import SectionRenderer from "@/components/portfolio/sections/SectionRederer";

import { getSections } from "@/lib/sections";
import { getCompanyServices } from "@/lib/companyServices";
import { getProjects } from "@/lib/projects";
import { getSiteSettings } from "@/lib/siteSettings";
import { getNavigation } from "@/lib/navigation";
import { getSocialLinks } from "@/lib/socialLinks";
import { getActiveTheme } from "@/lib/themes";

export default async function Home() {
  const [
    sections,
    services,
    projects,
    siteSettings,
    navigation,
    socialLinks,
    activeTheme,
  ] = await Promise.all([
    getSections(),
    getCompanyServices(),
    getProjects(),
    getSiteSettings(),
    getNavigation(),
    getSocialLinks(),
    getActiveTheme(),
  ]);

  return (
    <SiteTheme theme={activeTheme}>
      <main className="min-h-screen bg-brand-primary text-brand-on-primary">
        <Navbar siteSettings={siteSettings} navigation={navigation} />

        <SectionRenderer
          sections={sections}
          services={services}
          projects={projects}
          siteSettings={siteSettings}
        />

        <Footer
          siteSettings={siteSettings}
          navigation={navigation}
          socialLinks={socialLinks}
        />
      </main>
    </SiteTheme>
  );
}
