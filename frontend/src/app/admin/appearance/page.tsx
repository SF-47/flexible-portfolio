import { getThemes, getActiveTheme } from "@/lib/themes";
import AppearanceEditor from "../AppearanceEditor";

export default async function AppearancePage() {
  const [themes, activeTheme] = await Promise.all([
    getThemes(),
    getActiveTheme(),
  ]);

  return <AppearanceEditor themes={themes} activeTheme={activeTheme} />;
}
