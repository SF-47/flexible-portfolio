"use client";

import { useState, type ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((previous) => !previous)}
      />

      <div className="min-w-0 flex-1">
        <header className="border-b border-slate-200 bg-white px-6 py-5 md:px-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-semibold">Portfolio Administration</h2>

            <span className="hidden text-sm text-slate-500 sm:block">
              ATLAS Construction
            </span>
          </div>
        </header>

        <div className="p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
