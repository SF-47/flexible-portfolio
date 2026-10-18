"use client";

import { useState, type ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="admin-shell flex min-h-screen bg-admin-bg text-admin-text">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((previous) => !previous)}
      />

      <div className="min-w-0 flex-1">
        <header className="border-b border-admin-border bg-admin-surface px-6 py-5 md:px-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-semibold">Portfolio Administration</h2>

            <div className="flex items-center gap-4">
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
