import type { CSSProperties, ReactNode } from "react";
import type { Theme } from "@/types/theme";

import { fontFamilies, fontVariableClasses } from "@/lib/ui/portfolioFonts";

type SiteThemeProps = {
  children: ReactNode;
  theme: Theme;
};

export default function SiteTheme({ children, theme }: SiteThemeProps) {
  const style = {
    "--color-primary": theme.primaryColor,
    "--color-accent": theme.accentColor,
    "--color-accent-text": theme.accentColor,
    "--color-background": theme.backgroundColor,
    "--color-text": theme.textColor,
    "--color-on-primary": theme.onPrimaryColor,
    "--color-on-accent": theme.onAccentColor,

    "--portfolio-heading-font":
      fontFamilies[theme.headingFont] ?? fontFamilies.Inter,

    "--portfolio-body-font": fontFamilies[theme.bodyFont] ?? fontFamilies.Inter,
  } as CSSProperties;

  return (
    <div
      style={style}
      className={`min-h-screen ${fontVariableClasses} portfolio-theme`}
    >
      {children}
    </div>
  );
}
