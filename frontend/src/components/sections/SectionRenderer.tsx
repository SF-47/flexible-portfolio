"use client";

import { sectionRegistry } from "./sectionRegistry";
import { useSections } from "@/hooks/useSections";

export default function SectionRenderer() {
  const { sections } = useSections();

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
