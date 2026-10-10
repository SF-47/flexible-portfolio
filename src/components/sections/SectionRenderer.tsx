import { sectionRegistry } from "./sectionRegistry";
import type { SectionConfig } from "@/types/section";

interface SectionRendererProps {
  sections: SectionConfig[];
}

export default function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {[...sections]
        .filter((section) => section.isVisible)
        .sort((a, b) => a.order - b.order)
        .map((section) => {
          const Component = sectionRegistry[section.type];

          return <Component key={section.id} />;
        })}
    </>
  );
}
