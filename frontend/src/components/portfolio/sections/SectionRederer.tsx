import type { ApiSection } from "@/types/apiSections";
import type {
  HeroContent,
  AboutContent,
  StatsContent,
  ServicesContent,
  ProjectsContent,
  WhyChooseUsContent,
  ProcessContent,
  GalleryContent,
  TeamContent,
  ClientsContent,
  TestimonialsContent,
  CertificationsContent,
  FAQContent,
  CTAContent,
  ContactContent,
} from "@/types/sectionContent";
import type { CompanyService } from "@/types/companyService";
import type { Project } from "@/types/project";
import type { SiteSettings } from "@/types/siteSettings";

import Hero from "./Hero";
import About from "./About";
import Stats from "./Stats";
import Services from "./Services";
import Projects from "./Projects";
import WhyChooseUs from "./WhyChooseUs";
import Process from "./Process";
import Gallery from "./Gallery";
import Team from "./Team";
import Clients from "./Clients";
import Testimonials from "./Testimonials";
import Certifications from "./Certifications";
import FAQ from "./FAQ";
import CTA from "./CTA";
import Contact from "./Contact";

type SectionRendererProps = {
  sections: ApiSection[];
  services: CompanyService[];
  projects: Project[];
  siteSettings: SiteSettings;
};

function parseContent(json: string, type: string): unknown {
  try {
    const content: unknown = JSON.parse(json);

    if (
      typeof content !== "object" ||
      content === null ||
      Array.isArray(content)
    ) {
      console.error(`Invalid content for section: ${type}`);
      return null;
    }

    return content;
  } catch {
    console.error(`Invalid JSON for section: ${type}`);
    return null;
  }
}

export default function SectionRenderer({
  sections,
  services,
  projects,
  siteSettings,
}: SectionRendererProps) {
  const visibleSections = sections
    .filter((section) => section.isVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {visibleSections.map((section) => {
        const content = parseContent(section.contentJson, section.type);

        if (!content) return null;

        switch (section.type) {
          case "hero":
            return <Hero key={section.id} content={content as HeroContent} />;

          case "about":
            return <About key={section.id} content={content as AboutContent} />;

          case "stats":
            return <Stats key={section.id} content={content as StatsContent} />;

          case "services":
            return (
              <Services
                key={section.id}
                content={content as ServicesContent}
                services={services}
              />
            );

          case "projects":
            return (
              <Projects
                key={section.id}
                content={content as ProjectsContent}
                projects={projects}
              />
            );

          case "whyChooseUs":
            return (
              <WhyChooseUs
                key={section.id}
                content={content as WhyChooseUsContent}
              />
            );

          case "process":
            return (
              <Process key={section.id} content={content as ProcessContent} />
            );

          case "gallery":
            return (
              <Gallery key={section.id} content={content as GalleryContent} />
            );

          case "team":
            return <Team key={section.id} content={content as TeamContent} />;

          case "clients":
            return (
              <Clients key={section.id} content={content as ClientsContent} />
            );

          case "testimonials":
            return (
              <Testimonials
                key={section.id}
                content={content as TestimonialsContent}
              />
            );

          case "certifications":
            return (
              <Certifications
                key={section.id}
                content={content as CertificationsContent}
              />
            );

          case "faq":
            return <FAQ key={section.id} content={content as FAQContent} />;

          case "cta":
            return <CTA key={section.id} content={content as CTAContent} />;

          case "contact":
            return (
              <Contact
                key={section.id}
                content={content as ContactContent}
                contactInfo={{
                  email: siteSettings.email,
                  phone: siteSettings.phone,
                  address: siteSettings.address,
                }}
              />
            );

          default:
            console.warn(`Unknown section type: ${section.type}`);
            return null;
        }
      })}
    </>
  );
}
