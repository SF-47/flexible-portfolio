import { ArrowUpRight } from "lucide-react";
import type { SocialLink } from "@/types/socialLink";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import type { SiteSettings } from "@/types/siteSettings";
import type { NavigationItem } from "@/types/navigation";
import { getNavigationHref } from "@/lib/navigationLinks";

type FooterProps = {
  siteSettings: SiteSettings;
  navigation: NavigationItem[];
  socialLinks: SocialLink[];
};

const socialIcons = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  twitter: FaXTwitter,
  x: FaXTwitter,
};

export default function Footer({
  siteSettings,
  navigation,
  socialLinks,
}: FooterProps) {
  return (
    <footer className="bg-brand-primary px-8 pt-20 text-brand-on-primary md:px-20">
      <div className="mx-auto grid max-w-7xl gap-12 pb-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <h2 className="mb-6 text-3xl font-bold tracking-widest">
            {siteSettings.companyName}
          </h2>

          {siteSettings.footerDescription && (
            <p className="max-w-md leading-8 text-brand-on-primary/70">
              {siteSettings.footerDescription}
            </p>
          )}

          <div className="mt-8 flex gap-5 text-brand-on-primary/80">
            {[...socialLinks]
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((social) => {
                const platform = social.platform.trim().toLowerCase();

                const Icon = socialIcons[platform as keyof typeof socialIcons];

                if (!Icon) return null;

                let safeUrl: URL;

                try {
                  safeUrl = new URL(social.url);
                } catch {
                  return null;
                }

                if (
                  safeUrl.protocol !== "https:" &&
                  safeUrl.protocol !== "http:"
                ) {
                  return null;
                }

                return (
                  <a
                    key={social.id}
                    href={safeUrl.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    title={social.platform}
                    className="transition hover:text-brand-accent"
                  >
                    <Icon size={22} />
                  </a>
                );
              })}
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-lg font-semibold">Quick Links</h3>

          <ul className="space-y-4 text-brand-on-primary/70">
            {[...navigation]
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((item) => {
                const href = getNavigationHref(item);

                if (!href) return null;

                return (
                  <li key={item.id}>
                    <a
                      href={href}
                      target={item.openInNewTab ? "_blank" : undefined}
                      rel={
                        item.openInNewTab ? "noopener noreferrer" : undefined
                      }
                      className="hover:text-brand-accent"
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-lg font-semibold">Contact</h3>

          <div className="space-y-4 text-brand-on-primary/70">
            {siteSettings.address && <p>{siteSettings.address}</p>}

            {siteSettings.phone && (
              <a
                href={`tel:${siteSettings.phone.replace(/\s+/g, "")}`}
                className="block hover:text-brand-accent"
              >
                {siteSettings.phone}
              </a>
            )}

            {siteSettings.email && (
              <a
                href={`mailto:${siteSettings.email}`}
                className="block hover:text-brand-accent"
              >
                {siteSettings.email}
              </a>
            )}
          </div>

          <a
            href="#contact"
            className="mt-8 inline-flex items-center gap-2 font-semibold text-brand-accent"
          >
            Start a Project
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 border-t border-brand-on-primary/15 py-7 text-sm text-brand-on-primary/70 md:flex-row">
        <p>
          © {new Date().getFullYear()} {siteSettings.companyName}. All rights
          reserved.
        </p>

        <p>Built with precision and purpose.</p>
      </div>
    </footer>
  );
}
