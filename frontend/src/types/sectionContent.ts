import type { z } from "zod";

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

export type HeroContent = z.infer<typeof HeroSchema>;
export type AboutContent = z.infer<typeof AboutSchema>;
export type StatsContent = z.infer<typeof StatsSchema>;
export type ServicesContent = z.infer<typeof ServicesSchema>;
export type ProjectsContent = z.infer<typeof ProjectsSchema>;
export type WhyChooseUsContent = z.infer<typeof WhyChooseUsSchema>;
export type ProcessContent = z.infer<typeof ProcessSchema>;
export type GalleryContent = z.infer<typeof GallerySchema>;
export type TeamContent = z.infer<typeof TeamSchema>;
export type ClientsContent = z.infer<typeof ClientsSchema>;
export type TestimonialsContent = z.infer<typeof TestimonialsSchema>;
export type CertificationsContent = z.infer<typeof CertificationsSchema>;
export type FAQContent = z.infer<typeof FAQSchema>;
export type CTAContent = z.infer<typeof CTASchema>;
export type ContactContent = z.infer<typeof ContactSchema>;
