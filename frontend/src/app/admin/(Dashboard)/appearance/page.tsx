import type { Metadata } from "next";
import { getThemes, getActiveTheme } from "@/lib/api/themes";
import AppearanceEditor from "../AppearanceEditor";
import { requireAdminSession } from "@/lib/api/admin/client";

export const metadata: Metadata = { title: "Appearance" };

// Always read the active theme from the API, so it reflects the database after a save.
export const dynamic = "force-dynamic";

export default async function AppearancePage() {
  await requireAdminSession();

  const [themes, activeTheme] = await Promise.all([
    getThemes(),
    getActiveTheme(),
  ]);

  return <AppearanceEditor themes={themes} activeTheme={activeTheme} />;
}
