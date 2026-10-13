import Link from "next/link";
import {
  Layers,
  BriefcaseBusiness,
  Wrench,
  Mail,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  { label: "Sections", value: "6", icon: Layers },
  { label: "Projects", value: "3", icon: BriefcaseBusiness },
  { label: "Services", value: "6", icon: Wrench },
  { label: "Messages", value: "0", icon: Mail },
];

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-slate-500">
          Manage your company portfolio from one place.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                {label}
              </span>
              <Icon size={22} className="text-amber-600" />
            </div>

            <p className="text-4xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-7 shadow-sm">
          <h2 className="mb-3 text-xl font-bold">Website Management</h2>
          <p className="mb-6 text-slate-500">
            Organize your website sections and customize their content.
          </p>

          <Link
            href="/admin/sections"
            className="inline-flex items-center gap-2 font-semibold text-amber-700"
          >
            Manage Sections <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="rounded-xl bg-white p-7 shadow-sm">
          <h2 className="mb-3 text-xl font-bold">Website Appearance</h2>
          <p className="mb-6 text-slate-500">
            Customize your branding, website colors and visual styles.
          </p>

          <Link
            href="/admin/appearance"
            className="inline-flex items-center gap-2 font-semibold text-amber-700"
          >
            Customize Appearance <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
