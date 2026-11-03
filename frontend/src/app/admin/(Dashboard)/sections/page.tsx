import type { Metadata } from "next";
import SectionsList from "@/components/admin/SectionsList";
import { getAdminSections } from "@/lib/api/admin/sections";
import { requireAdminSession } from "@/lib/api/admin/client";

export const metadata: Metadata = { title: "Sections" };

export default async function SectionsPage() {
  await requireAdminSession();

  const sections = await getAdminSections();

  return (
    <div className="mx-auto max-w-7xl">
      <SectionsList sections={sections} />
    </div>
  );
}
