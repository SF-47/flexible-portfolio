import { z } from "zod";

export const HeroSchema = z.object({
  tagline: z.string(),
  title: z.string(),
  description: z.string(),
  buttonText: z.string(),
  buttonLink: z.string(),
  imageMediaId: z.number().int().positive().nullable().optional(),
});

export const AboutSchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
  secondDescription: z.string(),
  linkText: z.string(),
  linkUrl: z.string(),
  imageMediaId: z.number().int().nullable(),
  imageAlt: z.string(),
});

export const StatsSchema = z.object({
  items: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    }),
  ),
});

export const ServicesSchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
});

export const ProjectsSchema = z.object({
  label: z.string(),
  title: z.string(),
});

export const WhyChooseUsSchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
  items: z.array(
    z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string(),
    }),
  ),
});

export const ProcessSchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
  steps: z.array(
    z.object({
      number: z.string(),
      icon: z.string(),
      title: z.string(),
      description: z.string(),
    }),
  ),
});

export const GallerySchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  items: z.array(
    z.object({
      title: z.string(),
      category: z.string(),
      imageMediaId: z.number().int().nullable(),
      featured: z.boolean(),
    }),
  ),
});

export const TeamSchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
  members: z.array(
    z.object({
      name: z.string(),
      position: z.string(),
      description: z.string(),
      imageMediaId: z.number().int().nullable(),
    }),
  ),
});

export const ClientsSchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      icon: z.string(),
    }),
  ),
});

export const TestimonialsSchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      initials: z.string(),
      rating: z.number(),
      message: z.string(),
    }),
  ),
});

export const CertificationsSchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
  items: z.array(
    z.object({
      icon: z.string(),
      title: z.string(),
      subtitle: z.string(),
      description: z.string(),
    }),
  ),
});

export const FAQSchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
  helpIcon: z.string(),
  helpTitle: z.string(),
  helpLinkText: z.string(),
  helpLinkUrl: z.string(),
  items: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
});

export const CTASchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
  primaryButtonText: z.string(),
  primaryButtonLink: z.string(),
  secondaryButtonText: z.string(),
  secondaryButtonLink: z.string(),
});

export const ContactSchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
  addressTitle: z.string(),
  phoneTitle: z.string(),
  emailTitle: z.string(),
  nameLabel: z.string(),
  namePlaceholder: z.string(),
  emailLabel: z.string(),
  emailPlaceholder: z.string(),
  messageLabel: z.string(),
  messagePlaceholder: z.string(),
  buttonText: z.string(),
});
