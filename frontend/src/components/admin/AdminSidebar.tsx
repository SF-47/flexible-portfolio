"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Edit,
  Palette,
  Menu,
  Images,
  Mail,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import LogoutButton from "../auth/LogoutButton";

const navigation = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Sections", href: "/admin/sections", icon: Layers },
  { label: "Content Editor", href: "/admin/content", icon: Edit },
  { label: "Appearance", href: "/admin/appearance", icon: Palette },
  { label: "Navigation & Footer", href: "/admin/navigation", icon: Menu },
  { label: "Media Library", href: "/admin/media", icon: Images },
  { label: "Messages", href: "/admin/messages", icon: Mail },
];

interface AdminSidebarProps {
  // Desktop only: the icon-only collapsed state.
  collapsed: boolean;
  onToggle: () => void;
  // Mobile only: the slide-out drawer.
  mobileOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  // Collapsing only applies from the lg breakpoint up; the mobile drawer is always full width.
  const hideWhenCollapsed = collapsed ? "lg:hidden" : "";
  const centerWhenCollapsed = collapsed
    ? "gap-3 px-4 lg:justify-center lg:gap-0 lg:px-0"
    : "gap-3 px-4";

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-68 shrink-0 border-r border-admin-sidebar-border bg-admin-sidebar text-admin-sidebar-text transition-[transform,width] duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-20" : "lg:w-68"}`}
      >
        <div className="sticky top-0 flex h-screen flex-col overflow-y-auto p-4">
          <div
            className={`mb-10 flex h-12 items-center justify-between ${
              collapsed ? "lg:justify-center" : ""
            }`}
          >
            <div className={`min-w-0 ${hideWhenCollapsed}`}>
              <h1 className="truncate text-xl font-bold tracking-wider">
                Admin
              </h1>
              <p className="text-[13px] text-admin-sidebar-muted">Portfolio Manager</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="rounded-lg p-2 text-admin-sidebar-muted transition hover:bg-admin-sidebar-hover hover:text-admin-sidebar-text lg:hidden"
            >
              <X size={21} />
            </button>

            <button
              type="button"
              onClick={onToggle}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden rounded-lg p-2 text-admin-sidebar-muted transition hover:bg-admin-sidebar-hover hover:text-admin-sidebar-text lg:block"
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
                  onClick={onClose}
                  title={collapsed ? label : undefined}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-13 items-center rounded-lg transition ${centerWhenCollapsed} ${
                    active
                      ? "bg-admin-sidebar-active font-semibold text-admin-sidebar-active-text"
                      : "text-admin-sidebar-muted hover:bg-admin-sidebar-hover hover:text-admin-sidebar-text"
                  }`}
                >
                  <Icon size={21} className="shrink-0" />
                  <span
                    className={`whitespace-nowrap text-[15px] ${hideWhenCollapsed}`}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-admin-sidebar-border pt-5">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              title={collapsed ? "View Website" : undefined}
              className={`flex h-13 items-center rounded-lg text-admin-sidebar-muted transition hover:bg-admin-sidebar-hover hover:text-admin-sidebar-text ${centerWhenCollapsed}`}
            >
              <ExternalLink size={21} className="shrink-0" />
              <span
                className={`whitespace-nowrap text-[15px] ${hideWhenCollapsed}`}
              >
                View Website
              </span>
            </Link>
          </div>
          <LogoutButton/>
        </div>
      </aside>
    </>
  );
}
