import type { ApiSection } from "@/types/apiSections";
import type { CompanyService } from "@/types/companyService";
import type { Project } from "@/types/project";
import type { SiteSettings } from "@/types/siteSettings";
import { z } from "zod";

import {
  HeroSchema,
  AboutSchema,
  StatsSchema,
  ServicesSchema,
  ProjectsSchema,
  WhyChooseUsSchema,
  ProcessSchema,
  GallerySchema,
  TeamSchema,
  ClientsSchema,
  TestimonialsSchema,
  CertificationsSchema,
  FAQSchema,
  CTASchema,
  ContactSchema,
} from "@/schemas/sectionSchemas";

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
    return JSON.parse(json);
  } catch {
    console.error(`Invalid JSON for section: ${type}`);
    return null;
  }
}

function validateContent<T extends z.ZodType>(
  schema: T,
  content: unknown,
  type: string,
): z.infer<T> | null {
  const result = schema.safeParse(content);

  if (!result.success) {
    console.error(`Invalid content for section: ${type}`, result.error.issues);
    return null;
  }

  return result.data;
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
          case "hero": {
            const data = validateContent(HeroSchema, content, section.type);
            return data ? <Hero key={section.id} content={data} /> : null;
          }

          case "about": {
            const data = validateContent(AboutSchema, content, section.type);
            return data ? <About key={section.id} content={data} /> : null;
          }

          case "stats": {
            const data = validateContent(StatsSchema, content, section.type);
            return data ? <Stats key={section.id} content={data} /> : null;
          }

          case "services": {
            const data = validateContent(ServicesSchema, content, section.type);
            return data ? (
              <Services key={section.id} content={data} services={services} />
            ) : null;
          }

          case "projects": {
            const data = validateContent(ProjectsSchema, content, section.type);
            return data ? (
              <Projects key={section.id} content={data} projects={projects} />
            ) : null;
          }

          case "whyChooseUs": {
            const data = validateContent(
              WhyChooseUsSchema,
              content,
              section.type,
            );
            return data ? (
              <WhyChooseUs key={section.id} content={data} />
            ) : null;
          }

          case "process": {
            const data = validateContent(ProcessSchema, content, section.type);
            return data ? <Process key={section.id} content={data} /> : null;
          }

          case "gallery": {
            const data = validateContent(GallerySchema, content, section.type);
            return data ? <Gallery key={section.id} content={data} /> : null;
          }

          case "team": {
            const data = validateContent(TeamSchema, content, section.type);
            return data ? <Team key={section.id} content={data} /> : null;
          }

          case "clients": {
            const data = validateContent(ClientsSchema, content, section.type);
            return data ? <Clients key={section.id} content={data} /> : null;
          }

          case "testimonials": {
            const data = validateContent(
              TestimonialsSchema,
              content,
              section.type,
            );
            return data ? (
              <Testimonials key={section.id} content={data} />
            ) : null;
          }

          case "certifications": {
            const data = validateContent(
              CertificationsSchema,
              content,
              section.type,
            );
            return data ? (
              <Certifications key={section.id} content={data} />
            ) : null;
          }

          case "faq": {
            const data = validateContent(FAQSchema, content, section.type);
            return data ? <FAQ key={section.id} content={data} /> : null;
          }

          case "cta": {
            const data = validateContent(CTASchema, content, section.type);
            return data ? <CTA key={section.id} content={data} /> : null;
          }

          case "contact": {
            const data = validateContent(ContactSchema, content, section.type);

            return data ? (
              <Contact
                key={section.id}
                content={data}
                contactInfo={{
                  email: siteSettings.email,
                  phone: siteSettings.phone,
                  address: siteSettings.address,
                }}
              />
            ) : null;
          }

          default:
            console.warn(`Unknown section type: ${section.type}`);
            return null;
        }
      })}
    </>
  );
}
