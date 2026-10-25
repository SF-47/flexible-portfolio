import Link from "next/link";

// "Service Cards" / "Project Cards": a short list of the current records and a button
// to the management page.
export default function CardsSummary({
  heading,
  items,
  max,
  href,
  buttonLabel,
}: {
  heading: string;
  items: { id: number; title: string; note?: string }[];
  max: number;
  href: string;
  buttonLabel: string;
}) {
  return (
    <section
      aria-label={heading}
      className="space-y-3 rounded-lg border border-admin-border bg-admin-subtle p-4"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold">{heading}</h3>
        <span className="text-xs text-admin-muted">
          {items.length} of {max}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-admin-muted">None yet.</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3">
              <span className="truncate">{item.title}</span>
              {item.note && (
                <span className="shrink-0 text-xs text-admin-muted">
                  {item.note}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <Link
        href={href}
        className="inline-block rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950"
      >
        {buttonLabel}
      </Link>
    </section>
  );
}
