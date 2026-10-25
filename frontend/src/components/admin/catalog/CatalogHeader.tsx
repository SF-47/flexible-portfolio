import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// The title block shared by the Services and Projects management pages.
export default function CatalogHeader({
  title,
  description,
  count,
  max,
}: {
  title: string;
  description: string;
  count: number;
  max: number;
}) {
  return (
    <div className="space-y-4">
      <Link
        href="/admin/content"
        className="inline-flex items-center gap-2 text-sm font-medium text-admin-muted hover:text-admin-text"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Website Content
      </Link>

      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-admin-muted">{description}</p>
        <p className="mt-2 text-sm font-medium">
          {count} of {max}
        </p>
      </div>

      {count > max && (
        <p
          role="status"
          className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-900"
        >
          This website already has {count}, which is more than the limit of{" "}
          {max}. Nothing was removed or hidden. You can edit and delete, but you
          cannot add more until there are fewer than {max}.
        </p>
      )}
    </div>
  );
}
