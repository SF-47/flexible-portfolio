import type { CSSProperties, ReactNode } from "react";
import type { Theme } from "@/types/theme";

import { inter, poppins, roboto, lato } from "@/lib/portfolioFonts";

type SiteThemeProps = {
  children: ReactNode;
  theme: Theme;
};

const fontFamilies: Record<string, string> = {
  Inter: "var(--font-portfolio-inter)",
  Poppins: "var(--font-portfolio-poppins)",
  Roboto: "var(--font-portfolio-roboto)",
  Lato: "var(--font-portfolio-lato)",
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
      className={`min-h-screen ${inter.variable} ${poppins.variable} ${roboto.variable} ${lato.variable} portfolio-theme`}
    >
      {children}
    </div>
  );
}
