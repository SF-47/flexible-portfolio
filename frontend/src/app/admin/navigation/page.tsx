import {
  Menu,
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  ExternalLink,
  Save,
} from "lucide-react";

const links = [
  { id: 1, label: "Home", destination: "#home", visible: true },
  { id: 2, label: "About", destination: "#about", visible: true },
  { id: 3, label: "Services", destination: "#services", visible: true },
  { id: 4, label: "Projects", destination: "#projects", visible: true },
  { id: 5, label: "Contact", destination: "#contact", visible: true },
];

const socialLinks = [
  { platform: "Instagram", url: "instagram.com/atlas" },
  { platform: "Facebook", url: "facebook.com/atlas" },
  { platform: "LinkedIn", url: "linkedin.com/company/atlas" },
];

export default function NavigationPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Navigation & Footer</h1>
        <p className="mt-2 text-slate-500">
          Organize website links and manage branding.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <Menu className="text-amber-600" />
            <h2 className="text-xl font-bold">Navigation Links</h2>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold">
            <Plus size={17} />
            Add Link
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {links.map((link, index) => (
            <div
              key={link.id}
              className="flex flex-wrap items-center justify-between gap-4 px-6 py-5"
            >
              <div className="flex items-center gap-4">
                <GripVertical className="text-slate-400" size={20} />
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold">
                  {index + 1}
                </span>

                <div>
                  <p className="font-semibold">{link.label}</p>
                  <p className="text-sm text-slate-500">{link.destination}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  {link.visible ? "Visible" : "Hidden"}
                </span>
                <Pencil size={18} className="text-slate-500" />
                <Trash2 size={18} className="text-red-500" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-6 text-xl font-bold">Brand Identity</h2>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Company Name
              </label>
              <input
                type="text"
                defaultValue="ATLAS Construction"
                readOnly
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Navbar Logo
              </label>
              <div className="flex h-28 items-center justify-center rounded-lg bg-slate-950 text-2xl font-bold tracking-widest text-white">
                ATLAS.
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-6 text-xl font-bold">Footer Settings</h2>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Footer Description
              </label>
              <textarea
                rows={4}
                readOnly
                defaultValue="Building the future through innovation, craftsmanship, and excellence."
                className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
              />
            </div>

            <h3 className="font-semibold">Social Links</h3>

            {socialLinks.map((social) => (
              <div
                key={social.platform}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{social.platform}</p>
                  <p className="truncate text-xs text-slate-500">
                    {social.url}
                  </p>
                </div>
                <ExternalLink size={17} className="shrink-0 text-slate-400" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="flex justify-end">
        <div className="flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3 font-semibold">
          <Save size={18} />
          Save Changes
        </div>
      </div>
    </div>
  );
}
