"use client";

import { useEffect, useState } from "react";

import SectionRenderer from "@/components/portfolio/sections/SectionRenderer";
import { sectionSchemas } from "@/schemas/sectionSchemas";

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

const MAX_DRAFT_LENGTH = 100_000;

// Runs inside the preview iframe. It renders the saved section, then swaps in drafts
// sent by the Content Editor (see PreviewFrame for the message protocol). Drafts that
// are not valid for the section are ignored, so the preview keeps the last good one.
export default function LiveSectionPreview({
  section,
  services,
  projects,
  siteSettings,
  media,
}: Props) {
  const [draft, setDraft] = useState(section);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      // Accept messages only from the admin page that embeds this iframe.
      if (event.origin !== window.location.origin) return;
      if (event.source !== window.parent) return;

      const message = event.data;

      if (
        !message ||
        message.type !== "SECTION_DRAFT" ||
        message.sectionId !== section.id ||
        typeof message.contentJson !== "string" ||
        message.contentJson.length > MAX_DRAFT_LENGTH
      ) {
        return;
      }

      try {
        const content: unknown = JSON.parse(message.contentJson);

        if (!sectionSchemas[section.type].safeParse(content).success) return;
      } catch {
        return;
      }

      setDraft({ ...section, contentJson: message.contentJson });
    }

    window.addEventListener("message", handleMessage);

    // Tell the editor the listener is attached, so it can send the current draft.
    // (Nothing to tell when the preview is opened directly in its own tab.)
    if (window.parent !== window) {
      window.parent.postMessage(
        { type: "PREVIEW_READY", sectionId: section.id },
        window.location.origin,
      );
    }

    return () => window.removeEventListener("message", handleMessage);
  }, [section]);

  return (
    <SectionRenderer
      // A hidden section is previewed too, so it is always rendered as visible.
      sections={[{ ...draft, isVisible: true }]}
      services={services}
      projects={projects}
      siteSettings={siteSettings}
      media={media}
    />
  );
}
