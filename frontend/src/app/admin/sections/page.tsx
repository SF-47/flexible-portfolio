import SectionsList from "@/components/admin/SectionsList";
import { getAdminSections } from "@/lib/adminSections";

export default async function SectionsPage() {
  const sections = await getAdminSections();

  return (
    <div className="mx-auto max-w-7xl">
      <SectionsList sections={sections} />
    </div>
  );
}
