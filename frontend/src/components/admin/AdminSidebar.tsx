"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  FileText,
  Palette,
  Menu,
  Images,
  Mail,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Sections", href: "/admin/sections", icon: Layers },
  { label: "Content", href: "/admin/content", icon: FileText },
  { label: "Appearance", href: "/admin/appearance", icon: Palette },
  { label: "Navigation", href: "/admin/navigation", icon: Menu },
  { label: "Media Library", href: "/admin/media", icon: Images },
  { label: "Messages", href: "/admin/messages", icon: Mail },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({
  collapsed,
  onToggle,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`shrink-0 border-r border-slate-800 bg-slate-950 text-white transition-[width] duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-y-auto p-4">
        <div
          className={`mb-10 flex h-12 items-center ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold tracking-wider">
                ATLAS.
              </h1>
              <p className="text-xs text-slate-400">Portfolio Manager</p>
            </div>
          )}

          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            {collapsed ? (
              <PanelLeftOpen size={21} />
            ) : (
              <PanelLeftClose size={21} />
            )}
          </button>
        </div>

        <nav className="space-y-2" aria-label="Admin navigation">
          {navigation.map(({ label, href, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/admin" && pathname.startsWith(`${href}/`));

            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                aria-label={collapsed ? label : undefined}
                aria-current={active ? "page" : undefined}
                className={`flex h-12 items-center rounded-lg transition ${
                  collapsed ? "justify-center" : "gap-3 px-4"
                } ${
                  active
                    ? "bg-amber-400 font-semibold text-slate-950"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && (
                  <span className="whitespace-nowrap text-sm">{label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-800 pt-5">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title={collapsed ? "View Website" : undefined}
            aria-label={collapsed ? "View Website" : undefined}
            className={`flex h-12 items-center rounded-lg text-slate-300 transition hover:bg-slate-800 hover:text-white ${
              collapsed ? "justify-center" : "gap-3 px-4"
            }`}
          >
            <ExternalLink size={20} className="shrink-0" />
            {!collapsed && (
              <span className="whitespace-nowrap text-sm">View Website</span>
            )}
          </Link>
        </div>
      </div>
    </aside>
  );
}
