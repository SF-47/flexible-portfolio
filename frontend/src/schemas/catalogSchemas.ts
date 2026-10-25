import { z } from "zod";

// Shared by the Services / Projects admin pages and the Route Handlers. The API repeats
// every rule and is the authority (including the six-record limit).

export const MAX_SERVICES = 6;
export const MAX_PROJECTS = 6;

const ICON_NAME = /^[A-Za-z][A-Za-z0-9]{0,63}$/;
export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const id = z.number().int().positive().nullable();
const timestamp = z.string().nullable();
const mediaId = z.number().int().positive().nullable();

// "Modern Residence!" → "modern-residence"
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export const ServiceItemSchema = z.object({
  id,
  updatedAt: timestamp,
  title: z
    .string()
    .trim()
    .min(1, "Enter a title")
    .max(150, "Use at most 150 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Enter a description")
    .max(600, "Use at most 600 characters"),
  iconName: z
    .string()
    .regex(ICON_NAME, "Choose an icon from the list")
    .nullable(),
  imageMediaId: mediaId,
  isActive: z.boolean(),
});

export const UpdateServicesSchema = z.object({
  items: z.array(ServiceItemSchema).max(50),
  deletedIds: z.array(z.number().int().positive()).max(50),
});

export const ProjectItemSchema = z.object({
  id,
  updatedAt: timestamp,
  title: z
    .string()
    .trim()
    .min(1, "Enter a title")
    .max(200, "Use at most 200 characters"),
  slug: z
    .string()
    .trim()
    .min(1, "Enter a URL name")
    .max(220)
    .regex(
      SLUG_PATTERN,
      "Use lowercase letters, numbers and single hyphens, e.g. modern-residence",
    ),
  description: z
    .string()
    .trim()
    .max(500, "Use at most 500 characters")
    .nullable(),
  fullDescription: z
    .string()
    .trim()
    .max(10000, "Use at most 10,000 characters")
    .nullable(),
  category: z.string().trim().max(100, "Use at most 100 characters").nullable(),
  location: z.string().trim().max(200, "Use at most 200 characters").nullable(),
  completionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")
    .nullable(),
  featuredImageId: mediaId,
  isFeatured: z.boolean(),
});

export const UpdateProjectsSchema = z.object({
  items: z.array(ProjectItemSchema).max(50),
  deletedIds: z.array(z.number().int().positive()).max(50),
});
