"use client";

import FieldInput from "@/components/admin/content/FieldInput";

import type { Content } from "./contentJson";
import type { FieldDef } from "./sectionForms";

// The fields a section stores directly in its ContentJson (as opposed to the
// repeated items handled by ItemsEditor). Other keys of the content are kept as is.
export default function TextFieldsEditor({
  fields,
  content,
  onChange,
}: {
  fields: FieldDef[];
  content: Content;
  onChange: (content: Content) => void;
}) {
  return (
    <div className="space-y-5">
      {fields.map((field) => (
        <FieldInput
          key={field.key}
          id={`content-${field.key}`}
          field={field}
          value={content[field.key]}
          onChange={(value) => onChange({ ...content, [field.key]: value })}
        />
      ))}
    </div>
  );
}
