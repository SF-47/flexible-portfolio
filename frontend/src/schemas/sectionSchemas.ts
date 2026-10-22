import { z } from "zod";

import type { SectionType } from "@/types/section";

// Shared building blocks. The backend (SectionContentValidator.cs) enforces the
// same rules, so keep the two in sync.

const text = z.string().max(5000);

// Links become <a href>, so only safe schemes are accepted (never javascript:).
export const SAFE_LINK_PATTERN = /^(#|\/(?!\/)|https?:\/\/|mailto:|tel:)\S*$/i;

const link = z
  .string()
  .max(2000)
  .refine((value) => value === "" || SAFE_LINK_PATTERN.test(value), {
    message: "Use #section, /path, https://…, mailto: or tel:",
  });

const mediaId = z.number().int().positive().nullable();

export const HeroSchema = z.object({
  tagline: text,
  title: text,
  description: text,
  buttonText: text,
  buttonLink: link,
  imageMediaId: mediaId.optional(),
});

export const AboutSchema = z.object({
  label: text,
  title: text,
  description: text,
  secondDescription: text,
  linkText: text,
  linkUrl: link,
  imageMediaId: mediaId,
  imageAlt: text,
});

export const StatsSchema = z.object({
  items: z.array(
    z.object({
      value: text,
      label: text,
    }),
  ),
});

export const ServicesSchema = z.object({
  label: text,
  title: text,
  description: text,
});

export const ProjectsSchema = z.object({
  label: text,
  title: text,
});

export const WhyChooseUsSchema = z.object({
  label: text,
  title: text,
  description: text,
  items: z.array(
    z.object({
      icon: text,
      title: text,
      description: text,
    }),
  ),
});

export const ProcessSchema = z.object({
  label: text,
  title: text,
  description: text,
  steps: z.array(
    z.object({
      number: text,
      icon: text,
      title: text,
      description: text,
    }),
  ),
});

export const GallerySchema = z.object({
  label: text,
  title: text,
  description: text,
  icon: text,
  items: z.array(
    z.object({
      title: text,
      category: text,
      imageMediaId: mediaId,
      featured: z.boolean(),
    }),
  ),
});

export const TeamSchema = z.object({
  label: text,
  title: text,
  description: text,
  members: z.array(
    z.object({
      name: text,
      position: text,
      description: text,
      imageMediaId: mediaId,
    }),
  ),
});

export const ClientsSchema = z.object({
  label: text,
  title: text,
  description: text,
  items: z.array(
    z.object({
      name: text,
      icon: text,
    }),
  ),
});

export const TestimonialsSchema = z.object({
  label: text,
  title: text,
  description: text,
  items: z.array(
    z.object({
      name: text,
      role: text,
      initials: text,
      rating: z.number().int().min(1).max(5),
      message: text,
    }),
  ),
});

export const CertificationsSchema = z.object({
  label: text,
  title: text,
  description: text,
  items: z.array(
    z.object({
      icon: text,
      title: text,
      subtitle: text,
      description: text,
    }),
  ),
});

export const FAQSchema = z.object({
  label: text,
  title: text,
  description: text,
  helpIcon: text,
  helpTitle: text,
  helpLinkText: text,
  helpLinkUrl: link,
  items: z.array(
    z.object({
      question: text,
      answer: text,
    }),
  ),
});

export const CTASchema = z.object({
  label: text,
  title: text,
  description: text,
  primaryButtonText: text,
  primaryButtonLink: link,
  secondaryButtonText: text,
  secondaryButtonLink: link,
});

export const ContactSchema = z.object({
  label: text,
  title: text,
  description: text,
  addressTitle: text,
  phoneTitle: text,
  emailTitle: text,
  nameLabel: text,
  namePlaceholder: text,
  emailLabel: text,
  emailPlaceholder: text,
  messageLabel: text,
  messagePlaceholder: text,
  buttonText: text,
});

// One schema per section type, used by the editor and the live preview.
export const sectionSchemas: Record<SectionType, z.ZodType> = {
  hero: HeroSchema,
  about: AboutSchema,
  stats: StatsSchema,
  services: ServicesSchema,
  projects: ProjectsSchema,
  whyChooseUs: WhyChooseUsSchema,
  process: ProcessSchema,
  gallery: GallerySchema,
  team: TeamSchema,
  clients: ClientsSchema,
  testimonials: TestimonialsSchema,
  certifications: CertificationsSchema,
  faq: FAQSchema,
  cta: CTASchema,
  contact: ContactSchema,
};
