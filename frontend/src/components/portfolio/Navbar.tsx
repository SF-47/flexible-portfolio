import type { SiteSettings } from "@/types/siteSettings";
import type { NavigationItem } from "@/types/navigation";
import { getNavigationHref } from "@/lib/navigationLinks";

type NavbarProps = {
  siteSettings: SiteSettings;
  navigation: NavigationItem[];
};

export default function Navbar({ siteSettings, navigation }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-8 py-6 md:px-20">
      <h1 className="text-2xl font-bold tracking-widest">
        {siteSettings.companyName}
      </h1>

      <div className="hidden items-center gap-8 md:flex">
        {[...navigation]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((item) => {
            const href = getNavigationHref(item);

            if (!href) return null;

            return (
              <a
                key={item.id}
                href={href}
                target={item.openInNewTab ? "_blank" : undefined}
                rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                className="hover:text-brand-accent"
              >
                {item.label}
              </a>
            );
          })}
      </div>
    </nav>
  );
}
