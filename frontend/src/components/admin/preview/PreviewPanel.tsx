import type { ReactNode } from "react";
import { Eye } from "lucide-react";
import FullPreviewButton from "./FullPreviewButton";

interface PreviewPanelProps {
  title: string;
  description?: string;
  children: ReactNode;
  showFullPreview?: boolean;
}

export default function PreviewPanel({
  title,
  description,
  children,
  showFullPreview = true,
}: PreviewPanelProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-admin-border bg-admin-surface shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-admin-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
            <Eye size={20} />
          </div>

          <div>
            <h2 className="font-bold text-admin-text">{title}</h2>

            {description && (
              <p className="mt-1 text-xs text-admin-muted">{description}</p>
            )}
          </div>
        </div>

        {showFullPreview && <FullPreviewButton />}
      </div>

      <div className="min-w-0 bg-admin-bg p-4 md:p-6">{children}</div>
    </section>
  );
}
