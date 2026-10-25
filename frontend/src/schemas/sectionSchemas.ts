import { z } from "zod";

import type { SectionType } from "@/types/section";

// Shared building blocks. SectionRenderer uses these schemas to validate saved
// content before rendering; the backend no longer validates content (no save endpoint).

const text = z.string().max(5000);

// Links become <a href>, so only safe schemes are accepted (never javascript:).
export const SAFE_LINK_PATTERN = /^(#|\/(?!\/)|https?:\/\/|mailto:|tel:)\S*$/i;

const link = z
  .string()
  .max(2000)
  .refine((value) => value === "" || SAFE_LINK_PATTERN.test(value), {
    message: "Use #section, /path, https://…, mailto: or tel:",
  });

// An icon is stored by its Lucide name (e.g. "ShieldCheck"). Only a plain name is
// accepted here; the editor offers known names and the public site falls back to a
// default icon for a name it cannot find, so a name is only ever used as a lookup key.
export const ICON_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9]{0,63}$/;

const iconName = z
  .string()
  .regex(ICON_NAME_PATTERN, { message: "Choose an icon from the list" });

// Card lists hold 1 to max items. The maximums match the public layouts and are
// repeated in the API (SectionContentValidator). Services and Projects cards live
// in their own tables; their maximum (6) belongs in those CRUD endpoints.
const items = <T extends z.ZodType>(max: number, item: T) =>
  z.array(item).min(1).max(max);

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
  items: items(
    6,
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
  items: items(
    6,
    z.object({
      icon: iconName,
      title: text,
      description: text,
    }),
  ),
});

export const ProcessSchema = z.object({
  label: text,
  title: text,
  description: text,
  steps: items(
    6,
    z.object({
      number: text,
      icon: iconName,
      title: text,
      description: text,
    }),
  ),
});

export const GallerySchema = z.object({
  label: text,
  title: text,
  description: text,
  icon: iconName,
  items: items(
    12,
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
  members: items(
    6,
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
  items: items(
    6,
    z.object({
      name: text,
      icon: iconName,
    }),
  ),
});

export const TestimonialsSchema = z.object({
  label: text,
  title: text,
  description: text,
  items: items(
    6,
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
  items: items(
    6,
    z.object({
      icon: iconName,
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
  helpIcon: iconName,
  helpTitle: text,
  helpLinkText: text,
  helpLinkUrl: link,
  items: items(
    5,
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
