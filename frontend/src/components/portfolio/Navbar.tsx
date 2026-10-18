"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

import type { MediaAsset } from "@/types/media";
import type { SiteSettings } from "@/types/siteSettings";
import type { NavigationItem } from "@/types/navigation";
import { getMediaUrl } from "@/lib/mediaUrl";
import { getNavigationHref } from "@/lib/navigationLinks";

type NavbarProps = {
  siteSettings: SiteSettings;
  navigation: NavigationItem[];
  media: MediaAsset[];
  navbarVariant: string;
};

export default function Navbar({
  siteSettings,
  navigation,
  media,
  navbarVariant,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const logoUrl = getMediaUrl(siteSettings.logoMediaId, media);

  const links = [...navigation]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({
      ...item,
      href: getNavigationHref(item),
    }))
    .filter((item) => item.href !== null);

  const variant = ["default", "centered", "split"].includes(navbarVariant)
    ? navbarVariant
    : "default";

  const logo = (
    <a
      href="#home"
      onClick={() => setMenuOpen(false)}
      className="flex min-w-0 items-center gap-3"
    >
      {logoUrl && (
        <Image
          src={logoUrl}
          alt={`${siteSettings.companyName} logo`}
          width={48}
          height={48}
          className="h-12 w-auto max-w-40 object-contain"
        />
      )}

      <span className="truncate text-2xl font-bold tracking-widest">
        {siteSettings.companyName}
      </span>
    </a>
  );

  function renderLinks(items: typeof links) {
    return items.map((item) => (
      <a
        key={item.id}
        href={item.href ?? "#home"}
        target={item.openInNewTab ? "_blank" : undefined}
        rel={item.openInNewTab ? "noopener noreferrer" : undefined}
        onClick={() => setMenuOpen(false)}
        className="py-2 transition-colors hover:text-brand-accent md:py-0"
      >
        {item.label}
      </a>
    ));
  }

  const middle = Math.ceil(links.length / 2);

  return (
    <nav className="sticky top-0 z-50 flex min-h-20 flex-col justify-center bg-brand-primary px-8 py-4 shadow-sm text-brand-on-primary md:px-20">
      {/* Mobile layout */}
      <div className="flex items-center justify-between gap-4 md:hidden">
        {logo}

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((previous) => !previous)}
          className="shrink-0 rounded-lg p-2 transition hover:bg-white/10"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-navigation"
          className="mt-6 flex flex-col gap-5 border-t border-brand-on-primary/20 pt-6 md:hidden"
        >
          {renderLinks(links)}
        </div>
      )}

      {/* Desktop: default */}
      {variant === "default" && (
        <div className="hidden items-center justify-between gap-8 md:flex">
          {logo}

          <div className="flex flex-wrap items-center justify-end gap-8">
            {renderLinks(links)}
          </div>
        </div>
      )}

      {/* Desktop: centered */}
      {variant === "centered" && (
        <div className="hidden flex-col items-center gap-6 md:flex">
          {logo}

          <div className="flex flex-wrap items-center justify-center gap-8">
            {renderLinks(links)}
          </div>
        </div>
      )}

      {/* Desktop: split */}
      {variant === "split" && (
        <div className="hidden grid-cols-[1fr_auto_1fr] items-center gap-8 md:grid">
          <div className="flex flex-wrap items-center gap-6">
            {renderLinks(links.slice(0, middle))}
          </div>

          {logo}

          <div className="flex flex-wrap items-center justify-end gap-6">
            {renderLinks(links.slice(middle))}
          </div>
        </div>
      )}
    </nav>
  );
}
