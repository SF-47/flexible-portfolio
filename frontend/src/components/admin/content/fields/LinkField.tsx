import { useContext, useId, useState } from "react";

import Combobox from "@/components/admin/Combobox";
import { LinkTargetsContext } from "@/components/admin/content/LinkTargetsContext";
import { sectionAnchors } from "@/lib/site/sectionAnchors";

const CUSTOM = "__custom__";
const NONE = "__none__";
const inputClass =
  "w-full rounded-lg border border-admin-border bg-admin-subtle px-4 py-3 text-sm";

// A destination dropdown. The stored value stays a plain link ("#contact"); any
// stored link that is not a section anchor (a URL, mailto:, /path) is kept and shown
// under "Custom link" so it is never silently replaced.
export default function LinkField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: unknown;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const link = typeof value === "string" ? value : "";
  const targets = useContext(LinkTargetsContext);

  const options = Object.entries(sectionAnchors).map(([type, info]) => {
    const target = targets.find((item) => item.type === type);
    // Only sections that exist and are visible have an anchor on the public page.
    const available = target?.isVisible === true;

    return { ...info, available };
  });

  const matched = options.find((option) => option.anchor === link);
  const [customMode, setCustomMode] = useState(
    link !== "" && matched === undefined,
  );

  // A stored section anchor always wins, so Reset shows the saved destination again.
  const selected = matched
    ? matched.anchor
    : customMode || link !== ""
      ? CUSTOM
      : NONE;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <Combobox
        id={id}
        value={selected}
        onChange={(next) => {
          if (next === CUSTOM) {
            setCustomMode(true);
            if (matched || link === "") onChange("https://");
          } else {
            setCustomMode(false);
            onChange(next === NONE ? "" : next);
          }
        }}
        options={[
          { value: NONE, label: "No link" },
          ...options.map((option) => ({
            value: option.anchor,
            label:
              option.label + (option.available ? "" : " (hidden on website)"),
            disabled: !option.available && option.anchor !== link,
          })),
          { value: CUSTOM, label: "Custom link (URL, email or phone)…" },
        ]}
      />

      {customMode && (
        <input
          type="text"
          aria-label={`${label} (custom link)`}
          value={link}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://example.com, mailto:name@example.com or tel:+123456"
          className={inputClass}
        />
      )}
    </div>
  );
}
