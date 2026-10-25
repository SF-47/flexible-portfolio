import { z } from "zod";

// Shared by the admin page, the Route Handlers and (repeated) by the ASP.NET API.

export const httpUrl = z
  .string()
  .max(2048)
  .refine(
    (value) => {
      try {
        const url = new URL(value);

        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Enter a full address starting with http:// or https://" },
  );

// Admins only choose visibility and order. A link without an id is created for the
// predefined section sectionId; its name and destination come from the server.
export const NavigationItemSchema = z
  .object({
    id: z.number().int().nullable(),
    sectionId: z.string().uuid().nullable(),
    isVisible: z.boolean(),
  })
  .refine((item) => item.id !== null || item.sectionId !== null, {
    message: "Choose a website section",
  });

export const UpdateNavigationSchema = z.object({
  items: z.array(NavigationItemSchema).max(30),
});

export const SocialLinkSchema = z.object({
  id: z.number().int().nullable(),
  platform: z
    .string()
    .trim()
    .min(1, "Choose a platform")
    .max(50, "Use at most 50 characters")
    .refine((value) => !/[<>\u0000-\u001f]/.test(value), {
      message: "Use letters, numbers and common punctuation only",
    }),
  url: httpUrl,
  isVisible: z.boolean(),
});

export const UpdateSocialLinksSchema = z.object({
  items: z.array(SocialLinkSchema).max(12),
});

export const UpdateBrandSchema = z.object({
  companyName: z.string().trim().min(1, "Enter the company name").max(150),
  logoMediaId: z.number().int().positive().nullable(),
  footerDescription: z.string().max(500, "Use at most 500 characters"),
});
