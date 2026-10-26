import type { Metadata } from "next";
import SectionsList from "@/components/admin/SectionsList";
import { getAdminSections } from "@/lib/api/admin/sections";

export const metadata: Metadata = { title: "Sections" };

export default async function SectionsPage() {
  const sections = await getAdminSections();

  return (
    <div className="mx-auto max-w-7xl">
      <SectionsList sections={sections} />
    </div>
  );
}
