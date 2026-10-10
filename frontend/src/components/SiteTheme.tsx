import { siteConfig } from "@/data/siteConfig";
import type { CSSProperties, ReactNode } from "react";

type SiteThemeProps = {
  children: ReactNode;
};

export default function SiteTheme({ children }: SiteThemeProps) {
  const style = {
    "--color-primary": siteConfig.theme.primary,
    "--color-accent": siteConfig.theme.accent,
    "--color-accent-text": siteConfig.theme.accentText,
    "--color-background": siteConfig.theme.background,
    "--color-text": siteConfig.theme.text,
    "--color-on-primary": siteConfig.theme.onPrimary,
    "--color-on-accent": siteConfig.theme.onAccent,
  } as CSSProperties;

  return (
    <div style={style} className="min-h-screen">
      {children}
    </div>
  );
}
