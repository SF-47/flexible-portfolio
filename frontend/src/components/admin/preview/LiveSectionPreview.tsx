"use client";

import { useEffect, useState } from "react";

import SectionRenderer from "@/components/portfolio/sections/SectionRenderer";

import type { ApiSection } from "@/types/apiSections";
import type { CompanyService } from "@/types/companyService";
import type { Project } from "@/types/project";
import type { SiteSettings } from "@/types/siteSettings";
import type { MediaAsset } from "@/types/media";

type Props = {
  section: ApiSection;
  services: CompanyService[];
  projects: Project[];
  siteSettings: SiteSettings;
  media: MediaAsset[];
};

export default function LiveSectionPreview({
  section,
  services,
  projects,
  siteSettings,
  media,
}: Props) {
  const [contentJson, setContentJson] = useState(section.contentJson);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.source !== window.parent) return;

      const message = event.data;

      if (
        !message ||
        message.type !== "SECTION_DRAFT" ||
        message.sectionId !== section.id ||
        typeof message.contentJson !== "string"
      ) {
        return;
      }

      if (message.contentJson.length > 100_000) return;

      setContentJson(message.contentJson);
    }

    window.addEventListener("message", handleMessage);

    // Tell the parent that our listener is ready.
    window.parent.postMessage(
      {
        type: "PREVIEW_READY",
        sectionId: section.id,
      },
      window.location.origin,
    );

    return () => window.removeEventListener("message", handleMessage);
  }, [section.id]);

  return (
    <SectionRenderer
      sections={[{ ...section, contentJson, isVisible: true }]}
      services={services}
      projects={projects}
      siteSettings={siteSettings}
      media={media}
    />
  );
}
