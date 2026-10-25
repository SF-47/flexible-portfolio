import type { Metadata } from "next";
import { getThemes, getActiveTheme } from "@/lib/themes";
import AppearanceEditor from "../AppearanceEditor";

export const metadata: Metadata = { title: "Appearance" };

// Always read the active theme from the API, so it reflects the database after a save.
export const dynamic = "force-dynamic";

export default async function AppearancePage() {
  const [themes, activeTheme] = await Promise.all([
    getThemes(),
    getActiveTheme(),
  ]);

  return <AppearanceEditor themes={themes} activeTheme={activeTheme} />;
}
