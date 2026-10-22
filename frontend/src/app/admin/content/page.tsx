import ContentEditor from "@/components/admin/content/ContentEditor";
import { getAdminSections } from "@/lib/adminSections";
import { getMedia } from "@/lib/media";

export default async function ContentPage({
  searchParams,
}: PageProps<"/admin/content">) {
  const { section } = await searchParams;
  const initialType = Array.isArray(section) ? section[0] : section;

  const [sections, media] = await Promise.all([getAdminSections(), getMedia()]);

  return (
    <ContentEditor
      sections={sections}
      media={media}
      initialType={initialType}
    />
  );
}
