import type { ReactNode } from "react";
import { Loader2, RotateCcw, Save } from "lucide-react";

// The Save / Reset bar shared by the editable admin pages. It is only the visual part:
// every page keeps its own state and its own save and reset handlers. It sticks to the
// bottom of the page content, so it respects the sidebar and never covers the form.
export default function StickyActionBar({
  visible,
  message,
  onReset,
  onSave,
  saving = false,
  resetDisabled = false,
  saveDisabled = false,
  saveLabel = "Save Changes",
  resetLabel = "Reset Changes",
  className = "",
}: {
  // Show the bar (usually: there are unsaved changes or feedback to read).
  visible: boolean;
  // Status text on the left: "You have unsaved changes", errors, results…
  message?: ReactNode;
  onReset: () => void;
  onSave: () => void;
  saving?: boolean;
  resetDisabled?: boolean;
  saveDisabled?: boolean;
  saveLabel?: string;
  resetLabel?: string;
  className?: string;
}) {
  if (!visible) return null;

  return (
    <div
      className={`sticky bottom-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-admin-border bg-admin-surface p-4 shadow-lg ${className}`}
    >
      <div
        role="status"
        aria-live="polite"
        className="min-w-0 flex-1 basis-40 text-sm font-medium"
      >
        {message}
      </div>

      <div className="flex shrink-0 gap-3">
        <button
          type="button"
          onClick={onReset}
          disabled={resetDisabled || saving}
          className="inline-flex items-center gap-2 rounded-lg border border-admin-border px-4 py-2 text-sm font-semibold hover:bg-admin-subtle disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw size={16} />
          {resetLabel}
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={saveDisabled || saving}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Saving…" : saveLabel}
        </button>
      </div>
    </div>
  );
}
