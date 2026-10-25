import LinkField from "../fields/LinkField";
import { TextField, HeaderFields } from "../fields/TextField";
import type { FormProps } from "./types";

export default function CTAForm({ draft, updateField }: FormProps) {
  return (
    <>
      <HeaderFields draft={draft} updateField={updateField} />
      <TextField
        label="Primary Button Text"
        value={draft.primaryButtonText}
        onChange={(v) => updateField("primaryButtonText", v)}
      />
      <LinkField
        label="Primary Button Destination (optional)"
        value={draft.primaryButtonLink}
        onChange={(v) => updateField("primaryButtonLink", v)}
      />
      <TextField
        label="Secondary Button Text"
        value={draft.secondaryButtonText}
        onChange={(v) => updateField("secondaryButtonText", v)}
      />
      <LinkField
        label="Secondary Button Destination (optional)"
        value={draft.secondaryButtonLink}
        onChange={(v) => updateField("secondaryButtonLink", v)}
      />
    </>
  );
}
