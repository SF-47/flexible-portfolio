import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Testimonials from "@/components/sections/Testimonials";
import Clients from "@/components/sections/Clients";
import Team from "@/components/sections/Team";
import FAQ from "@/components/sections/FAQ";
import Process from "@/components/sections/Process";
import Gallery from "@/components/sections/Gallery";
import CTA from "@/components/sections/CTA";
import Certifications from "@/components/sections/Certifications";

import type { SectionType } from "@/types/section";
import type { ComponentType } from "react";

export const sectionRegistry: Record<SectionType, ComponentType> = {
  hero: Hero,
  about: About,
  stats: Stats,
  services: Services,
  projects: Projects,
  contact: Contact,
  whyChooseUs: WhyChooseUs,
  testimonials: Testimonials,
  clients: Clients,
  team: Team,
  faq: FAQ,
  process: Process,
  gallery: Gallery,
  cta: CTA,
  certifications: Certifications,
};
