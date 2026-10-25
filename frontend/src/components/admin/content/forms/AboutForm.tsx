import LinkField from "../fields/LinkField";
import { TextField, TextareaField } from "../fields/TextField";
import ImageField from "../fields/ImageField";
import { mediaId, type FormProps } from "./types";

export default function AboutForm({
  draft,
  updateField,
  updateValue,
}: FormProps) {
  return (
    <>
      <TextField
        label="Label"
        value={draft.label}
        onChange={(v) => updateField("label", v)}
      />
      <TextField
        label="Title"
        value={draft.title}
        onChange={(v) => updateField("title", v)}
      />
      <TextareaField
        label="Description"
        value={draft.description}
        onChange={(v) => updateField("description", v)}
      />
      <TextareaField
        label="Second Description (optional)"
        value={draft.secondDescription}
        onChange={(v) => updateField("secondDescription", v)}
      />
      <TextField
        label="Link Text"
        value={draft.linkText}
        onChange={(v) => updateField("linkText", v)}
      />
      <LinkField
        label="Link Destination (optional)"
        value={draft.linkUrl}
        onChange={(v) => updateField("linkUrl", v)}
      />
      <ImageField
        label="Image (optional)"
        value={mediaId(draft.imageMediaId)}
        onChange={(id) => updateValue("imageMediaId", id)}
      />
      <TextField
        label="Image Alt Text (optional)"
        value={draft.imageAlt}
        onChange={(v) => updateField("imageAlt", v)}
      />
    </>
  );
}
