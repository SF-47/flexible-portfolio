import { icons as certificationIcons } from "@/components/portfolio/sections/Certifications";
import { icons as clientIcons } from "@/components/portfolio/sections/Clients";
import { icons as faqIcons } from "@/components/portfolio/sections/FAQ";
import { icons as galleryIcons } from "@/components/portfolio/sections/Gallery";
import { icons as processIcons } from "@/components/portfolio/sections/Process";
import { icons as whyChooseUsIcons } from "@/components/portfolio/sections/WhyChooseUs";
import type { SectionType } from "@/types/section";

import type { Content } from "./contentJson";

// Describes the form of each section: which ContentJson keys are editable and how.
// It mirrors the Zod schemas in schemas/sectionSchemas.ts (and the API validator).

export type FieldKind =
  | "text"
  | "textarea"
  | "link"
  | "boolean"
  | "rating"
  | "icon"
  | "media";

export type FieldDef = {
  key: string;
  label: string;
  kind?: FieldKind;
  // For "icon" fields: the icon names the public component can draw.
  options?: string[];
};

// A repeated group of items stored as an array in ContentJson (stats, team, ...).
export type ListDef = {
  key: string;
  title: string;
  // Singular name used in buttons and headings, e.g. "Statistic".
  itemName: string;
  fields: FieldDef[];
  // Item property shown next to the item number, e.g. the title.
  labelKey?: string;
  // Initial values for a new item (the item's position is passed in).
  defaults?: (index: number) => Content;
};

export type SectionForm = {
  fields: FieldDef[];
  lists?: ListDef[];
  note?: string;
};

const header: FieldDef[] = [
  { key: "label", label: "Label" },
  { key: "title", label: "Section Heading" },
  { key: "description", label: "Section Description", kind: "textarea" },
];

const names = (icons: object) => Object.keys(icons);

export const sectionForms: Record<SectionType, SectionForm> = {
  hero: {
    fields: [
      { key: "tagline", label: "Tagline" },
      { key: "title", label: "Section Heading" },
      { key: "description", label: "Section Description", kind: "textarea" },
      { key: "buttonText", label: "Button Text" },
      { key: "buttonLink", label: "Button Link", kind: "link" },
      { key: "imageMediaId", label: "Background Image", kind: "media" },
    ],
  },
  about: {
    fields: [
      { key: "label", label: "Label" },
      { key: "title", label: "Section Heading" },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "secondDescription", label: "Second Description", kind: "textarea" },
      { key: "linkText", label: "Link Text" },
      { key: "linkUrl", label: "Link URL", kind: "link" },
      { key: "imageMediaId", label: "Image", kind: "media" },
      { key: "imageAlt", label: "Image Alt Text" },
    ],
  },
  stats: {
    fields: [],
    lists: [
      {
        key: "items",
        title: "Statistics",
        itemName: "Statistic",
        labelKey: "label",
        fields: [
          { key: "value", label: "Value" },
          { key: "label", label: "Label" },
        ],
      },
    ],
  },
  services: {
    fields: header,
    note: "The service cards are managed separately, not in this section's content.",
  },
  projects: {
    fields: [
      { key: "label", label: "Label" },
      { key: "title", label: "Section Heading" },
    ],
    note: "The project cards are managed separately, not in this section's content.",
  },
  whyChooseUs: {
    fields: header,
    lists: [
      {
        key: "items",
        title: "Advantages",
        itemName: "Advantage",
        labelKey: "title",
        fields: [
          { key: "icon", label: "Icon", kind: "icon", options: names(whyChooseUsIcons) },
          { key: "title", label: "Title" },
          { key: "description", label: "Description", kind: "textarea" },
        ],
      },
    ],
  },
  process: {
    fields: header,
    lists: [
      {
        key: "steps",
        title: "Steps",
        itemName: "Step",
        labelKey: "title",
        defaults: (index) => ({ number: String(index + 1).padStart(2, "0") }),
        fields: [
          { key: "number", label: "Number" },
          { key: "icon", label: "Icon", kind: "icon", options: names(processIcons) },
          { key: "title", label: "Title" },
          { key: "description", label: "Description", kind: "textarea" },
        ],
      },
    ],
  },
  gallery: {
    fields: [
      ...header,
      { key: "icon", label: "Icon", kind: "icon", options: names(galleryIcons) },
    ],
    lists: [
      {
        key: "items",
        title: "Gallery Items",
        itemName: "Item",
        labelKey: "title",
        fields: [
          { key: "title", label: "Title" },
          { key: "category", label: "Category" },
          { key: "imageMediaId", label: "Image", kind: "media" },
          { key: "featured", label: "Featured (shown larger)", kind: "boolean" },
        ],
      },
    ],
  },
  team: {
    fields: header,
    lists: [
      {
        key: "members",
        title: "Team Members",
        itemName: "Member",
        labelKey: "name",
        fields: [
          { key: "name", label: "Name" },
          { key: "position", label: "Position" },
          { key: "description", label: "Description", kind: "textarea" },
          { key: "imageMediaId", label: "Photo", kind: "media" },
        ],
      },
    ],
  },
  clients: {
    fields: header,
    lists: [
      {
        key: "items",
        title: "Clients",
        itemName: "Client",
        labelKey: "name",
        fields: [
          { key: "name", label: "Name" },
          { key: "icon", label: "Icon", kind: "icon", options: names(clientIcons) },
        ],
      },
    ],
  },
  testimonials: {
    fields: header,
    lists: [
      {
        key: "items",
        title: "Testimonials",
        itemName: "Testimonial",
        labelKey: "name",
        fields: [
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "initials", label: "Initials" },
          { key: "rating", label: "Rating", kind: "rating" },
          { key: "message", label: "Message", kind: "textarea" },
        ],
      },
    ],
  },
  certifications: {
    fields: header,
    lists: [
      {
        key: "items",
        title: "Certifications",
        itemName: "Certification",
        labelKey: "title",
        fields: [
          { key: "icon", label: "Icon", kind: "icon", options: names(certificationIcons) },
          { key: "title", label: "Title" },
          { key: "subtitle", label: "Subtitle" },
          { key: "description", label: "Description", kind: "textarea" },
        ],
      },
    ],
  },
  faq: {
    fields: [
      ...header,
      { key: "helpIcon", label: "Help Icon", kind: "icon", options: names(faqIcons) },
      { key: "helpTitle", label: "Help Title" },
      { key: "helpLinkText", label: "Help Link Text" },
      { key: "helpLinkUrl", label: "Help Link URL", kind: "link" },
    ],
    lists: [
      {
        key: "items",
        title: "Questions",
        itemName: "Question",
        labelKey: "question",
        fields: [
          { key: "question", label: "Question" },
          { key: "answer", label: "Answer", kind: "textarea" },
        ],
      },
    ],
  },
  cta: {
    fields: [
      ...header,
      { key: "primaryButtonText", label: "Primary Button Text" },
      { key: "primaryButtonLink", label: "Primary Button Link", kind: "link" },
      { key: "secondaryButtonText", label: "Secondary Button Text" },
      { key: "secondaryButtonLink", label: "Secondary Button Link", kind: "link" },
    ],
  },
  contact: {
    fields: [
      ...header,
      { key: "addressTitle", label: "Address Title" },
      { key: "phoneTitle", label: "Phone Title" },
      { key: "emailTitle", label: "Email Title" },
      { key: "nameLabel", label: "Name Field Label" },
      { key: "namePlaceholder", label: "Name Field Placeholder" },
      { key: "emailLabel", label: "Email Field Label" },
      { key: "emailPlaceholder", label: "Email Field Placeholder" },
      { key: "messageLabel", label: "Message Field Label" },
      { key: "messagePlaceholder", label: "Message Field Placeholder" },
      { key: "buttonText", label: "Submit Button Text" },
    ],
    note: "The phone number, email address and company address come from Site Settings, not from this content.",
  },
};

// The value a field has when nothing has been entered yet.
export function emptyValue(field: FieldDef): unknown {
  switch (field.kind) {
    case "boolean":
      return false;
    case "media":
      return null;
    case "rating":
      return 5;
    case "icon":
      return field.options?.[0] ?? "";
    default:
      return "";
  }
}

export function emptyItem(list: ListDef, index: number): Content {
  const item: Content = {};

  for (const field of list.fields) item[field.key] = emptyValue(field);

  return { ...item, ...list.defaults?.(index) };
}

// A blank version of a section's content, used to recover from unreadable JSON.
export function emptyContent(form: SectionForm): Content {
  const content: Content = {};

  for (const field of form.fields) content[field.key] = emptyValue(field);
  for (const list of form.lists ?? []) content[list.key] = [];

  return content;
}
