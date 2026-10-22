"use client";

import MediaField from "@/components/admin/content/MediaField";
import { SAFE_LINK_PATTERN } from "@/schemas/sectionSchemas";

import type { FieldDef } from "./sectionForms";

const inputClass =
  "w-full rounded-lg border border-admin-border bg-admin-subtle px-4 py-3 text-sm outline-none focus:border-amber-400";

// One editable ContentJson value, rendered with the input that suits its kind.
// Used for a section's own fields and for the fields of each repeated item.
export default function FieldInput({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const kind = field.kind ?? "text";
  const text = typeof value === "string" ? value : "";

  if (kind === "boolean") {
    return (
      <label htmlFor={id} className="flex items-center gap-3 text-sm font-medium">
        <input
          id={id}
          type="checkbox"
          checked={value === true}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 accent-amber-400"
        />
        {field.label}
      </label>
    );
  }

  const label = (
    <label htmlFor={id} className="mb-2 block text-sm font-medium">
      {field.label}
    </label>
  );

  if (kind === "media") {
    return (
      <div>
        <p id={`${id}-label`} className="mb-2 text-sm font-medium">
          {field.label}
        </p>
        <MediaField
          labelledBy={`${id}-label`}
          value={typeof value === "number" ? value : null}
          onChange={onChange}
        />
      </div>
    );
  }

  if (kind === "icon") {
    const options = field.options ?? [];
    // Keep a value the list does not know, so opening the form never changes it.
    const unknown = text !== "" && !options.includes(text);

    return (
      <div>
        {label}
        <select
          id={id}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        >
          {unknown && <option value={text}>{text} (not available)</option>}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (kind === "rating") {
    return (
      <div>
        {label}
        <select
          id={id}
          value={typeof value === "number" ? value : 5}
          onChange={(event) => onChange(Number(event.target.value))}
          className={inputClass}
        >
          {[1, 2, 3, 4, 5].map((stars) => (
            <option key={stars} value={stars}>
              {stars} {stars === 1 ? "star" : "stars"}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (kind === "textarea") {
    return (
      <div>
        {label}
        <textarea
          id={id}
          rows={4}
          maxLength={5000}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} resize-y`}
        />
      </div>
    );
  }

  const invalidLink =
    kind === "link" && text !== "" && !SAFE_LINK_PATTERN.test(text);

  return (
    <div>
      {label}
      <input
        id={id}
        type="text"
        inputMode={kind === "link" ? "url" : undefined}
        maxLength={kind === "link" ? 2000 : 5000}
        value={text}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={invalidLink}
        aria-describedby={invalidLink ? `${id}-error` : undefined}
        className={inputClass}
      />
      {invalidLink && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-700">
          Use #section, /path, https://…, mailto: or tel:
        </p>
      )}
    </div>
  );
}
