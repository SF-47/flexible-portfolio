import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import SiteTheme from "@/components/SiteTheme";
import SectionRenderer from "@/components/portfolio/sections/SectionRederer";

import { getSections } from "@/lib/sections";
import { getCompanyServices } from "@/lib/companyServices";
import { getProjects } from "@/lib/projects";
import { getSiteSettings } from "@/lib/siteSettings";

export default async function Home() {
  const [sections, services, projects, siteSettings] = await Promise.all([
    getSections(),
    getCompanyServices(),
    getProjects(),
    getSiteSettings(),
  ]);

  return (
    <SiteTheme>
      <main className="min-h-screen bg-brand-primary text-brand-on-primary">
        <Navbar />

        <SectionRenderer
          sections={sections}
          services={services}
          projects={projects}
          siteSettings={siteSettings}
        />

        <Footer />
      </main>
    </SiteTheme>
  );
}
