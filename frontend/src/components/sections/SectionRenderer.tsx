"use client";

import { sectionRegistry } from "./sectionRegistry";
import type { ApiSection } from "@/types/apiSections";

type SectionRendererProps = {
  sections: ApiSection[];
};

export default function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {[...sections]
        .filter((section) => section.isVisible)
        .sort((a, b) => a.order - b.order)
        .map((section) => {
          const Component = sectionRegistry[section.type];

          if (!Component) return null;

          return <Component key={section.id} />;
        })}
    </>
  );
}
