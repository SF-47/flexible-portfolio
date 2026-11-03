import type { SectionType } from "@/types/section";

// The id each public section component puts on its <section> element, and the
// friendly name shown in the editor. A link such as "#contact" jumps to that id.
export const sectionAnchors: Record<
  SectionType,
  { anchor: string; label: string }
> = {
  hero: { anchor: "#home", label: "Home" },
  about: { anchor: "#about", label: "About Us" },
  stats: { anchor: "#stats", label: "Statistics" },
  services: { anchor: "#services", label: "Services" },
  projects: { anchor: "#projects", label: "Projects" },
  whyChooseUs: { anchor: "#why-choose-us", label: "Why Choose Us" },
  process: { anchor: "#process", label: "Our Process" },
  gallery: { anchor: "#gallery", label: "Gallery" },
  team: { anchor: "#team", label: "Our Team" },
  clients: { anchor: "#clients", label: "Clients & Partners" },
  testimonials: { anchor: "#testimonials", label: "Testimonials" },
  certifications: {
    anchor: "#certifications",
    label: "Certifications & Awards",
  },
  faq: { anchor: "#faq", label: "FAQ" },
  cta: { anchor: "#cta", label: "Call to Action" },
  contact: { anchor: "#contact", label: "Contact Us" },
};

// The short names the website menu uses for each section (the server holds the same list).
export const navLabels: Record<SectionType, string> = {
  hero: "Home",
  about: "About",
  stats: "Stats",
  services: "Services",
  projects: "Projects",
  whyChooseUs: "Why Us",
  process: "Process",
  gallery: "Gallery",
  team: "Team",
  clients: "Clients",
  testimonials: "Testimonials",
  certifications: "Certifications",
  faq: "FAQ",
  cta: "Get Started",
  contact: "Contact",
};
