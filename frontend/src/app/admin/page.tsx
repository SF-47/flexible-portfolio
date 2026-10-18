import Link from "next/link";
import {
  Layers,
  BriefcaseBusiness,
  Wrench,
  Mail,
  ArrowUpRight,
} from "lucide-react";

import { getDashboardStats } from "@/lib/adminDashboard";

export default async function AdminPage() {
  const statsData = await getDashboardStats();

  const stats = [
    {
      label: "Visible Sections",
      value: statsData.visibleSections,
      icon: Layers,
    },
    {
      label: "Projects",
      value: statsData.totalProjects,
      icon: BriefcaseBusiness,
    },
    {
      label: "Services",
      value: statsData.totalServices,
      icon: Wrench,
    },
    {
      label: "Messages",
      value: statsData.totalMessages,
      icon: Mail,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-admin-muted">
          Manage your company portfolio from one place.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl bg-admin-surface p-6 shadow-sm"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-medium text-admin-muted">
                {label}
              </span>

              <Icon size={22} className="text-admin-accent" />
            </div>

            <p className="text-4xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-admin-surface p-7 shadow-sm">
          <h2 className="mb-3 text-xl font-bold">Website Management</h2>

          <p className="mb-6 text-admin-muted">
            Organize your website sections and customize their content.
          </p>

          <Link
            href="/admin/sections"
            className="inline-flex items-center gap-2 font-semibold text-admin-accent"
          >
            Manage Sections <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="rounded-xl bg-admin-surface p-7 shadow-sm">
          <h2 className="mb-3 text-xl font-bold">Website Appearance</h2>

          <p className="mb-6 text-admin-muted">
            Customize your branding, website colors and visual styles.
          </p>

          <Link
            href="/admin/appearance"
            className="inline-flex items-center gap-2 font-semibold text-admin-accent"
          >
            Customize Appearance <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
