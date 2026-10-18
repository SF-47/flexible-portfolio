import ContentEditor from "@/components/admin/ContentEditor";
import { getAdminSections } from "@/lib/adminSections";

export default async function ContentPage({
  searchParams,
}: PageProps<"/admin/content">) {
  const { section } = await searchParams;
  const initialType = Array.isArray(section) ? section[0] : section;

  const sections = await getAdminSections();

  return <ContentEditor sections={sections} initialType={initialType} />;
}
