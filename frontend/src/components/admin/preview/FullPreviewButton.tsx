import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function FullPreviewButton() {
  return (
    <Link
      href="/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300"
    >
      <ExternalLink size={16} />
      Full Website Preview
    </Link>
  );
}
