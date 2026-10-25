"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!mobileOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  // The section preview is shown inside an iframe, so it renders without the admin shell.
  if (pathname.startsWith("/admin/preview")) return <>{children}</>;

  return (
    <div className="admin-shell flex min-h-screen bg-admin-bg text-admin-text">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((previous) => !previous)}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-16 items-center border-b border-admin-border bg-admin-surface px-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="admin-sidebar"
              className="rounded-lg p-2 text-admin-muted transition hover:bg-admin-bg lg:hidden"
            >
              <Menu size={22} />
            </button>

            <h2 className="font-semibold">Portfolio Administration</h2>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-10">{children}</div>
      </div>
    </div>
  );
}
