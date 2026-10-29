"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

// `collapsed` is the icon-only desktop sidebar; the mobile drawer always shows the label.
export default function LogoutButton({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.replace("/admin/login");
      router.refresh();
    } catch {
      alert("Unable to log out. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const label = loading ? "Signing out..." : "Logout";

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      title={collapsed ? label : undefined}
      aria-label={label}
      className={`flex h-13 w-full items-center rounded-lg text-admin-sidebar-muted transition hover:bg-admin-sidebar-hover hover:text-admin-sidebar-text disabled:opacity-50 ${
        collapsed
          ? "gap-3 px-4 lg:justify-center lg:gap-0 lg:px-0"
          : "gap-3 px-4"
      }`}
    >
      <LogOut size={21} className="shrink-0" />
      <span
        className={`whitespace-nowrap text-[15px] ${collapsed ? "lg:hidden" : ""}`}
      >
        {label}
      </span>
    </button>
  );
}
