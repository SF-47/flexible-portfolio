import Link from "next/link";
import {
  Building2,
  House,
  Info,
  BarChart3,
  Wrench,
  FolderKanban,
  Mail,
  Pencil,
  ArrowUpRight,
} from "lucide-react";

const contentSections = [
  {
    name: "Company Information",
    description: "Company name, tagline, contact details and branding.",
    icon: Building2,
    count: "General settings",
  },
  {
    name: "Hero Section",
    description: "Main headline, introduction and call-to-action.",
    icon: House,
    count: "3 content fields",
  },
  {
    name: "About Company",
    description: "Company background, descriptions and images.",
    icon: Info,
    count: "4 content fields",
  },
  {
    name: "Statistics",
    description: "Experience, completed projects and company highlights.",
    icon: BarChart3,
    count: "4 statistics",
  },
  {
    name: "Services",
    description: "Manage the services offered by your company.",
    icon: Wrench,
    count: "6 services",
  },
  {
    name: "Projects",
    description: "Manage projects, descriptions and gallery images.",
    icon: FolderKanban,
    count: "3 projects",
  },
  {
    name: "Contact Information",
    description: "Phone number, email address and office location.",
    icon: Mail,
    count: "3 contact details",
  },
];

export default function ContentPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <p className="mt-2 text-admin-muted">
          Manage your website content and company information.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {contentSections.map((section) => {
          const Icon = section.icon;

          return (
            <div
              key={section.name}
              className="group rounded-xl border border-admin-border bg-admin-surface p-6 transition hover:border-amber-300 hover:shadow-md"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
                  <Icon size={24} />
                </div>

                <ArrowUpRight
                  size={20}
                  className="text-admin-faint transition group-hover:text-admin-accent"
                />
              </div>

              <h2 className="mb-2 text-lg font-bold">{section.name}</h2>

              <p className="mb-5 min-h-12 text-sm leading-6 text-admin-muted">
                {section.description}
              </p>

              <div className="flex items-center justify-between border-t border-admin-border pt-5">
                <span className="text-xs font-medium text-admin-faint">
                  {section.count}
                </span>

                <span className="flex items-center gap-2 text-sm font-semibold text-admin-accent">
                  <Pencil size={15} />
                  Edit Content
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-admin-border bg-admin-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Website Structure</h2>
            <p className="mt-1 text-sm text-admin-muted">
              Add, remove, or rearrange the sections on your website.
            </p>
          </div>

          <Link
            href="/admin/sections"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300"
          >
            Manage Sections
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}
