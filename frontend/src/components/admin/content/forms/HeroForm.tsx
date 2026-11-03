import LinkField from "../fields/LinkField";
import { TextField, TextareaField } from "../fields/TextField";
import ImageField from "../fields/ImageField";
import { mediaId, type FormProps } from "./types";

export default function HeroForm({
  draft,
  updateField,
  updateValue,
}: FormProps) {
  return (
    <>
      <TextField
        label="Tagline"
        value={draft.tagline}
        onChange={(v) => updateField("tagline", v)}
      />
      <TextField
        label="Hero Heading"
        value={draft.title}
        onChange={(v) => updateField("title", v)}
      />
      <TextareaField
        label="Description"
        value={draft.description}
        onChange={(v) => updateField("description", v)}
      />
      <TextField
        label="Button Text"
        value={draft.buttonText}
        onChange={(v) => updateField("buttonText", v)}
      />
      <LinkField
        label="Button Destination (optional)"
        value={draft.buttonLink}
        onChange={(v) => updateField("buttonLink", v)}
      />
      <ImageField
        label="Background Image (optional)"
        value={mediaId(draft.imageMediaId)}
        onChange={(id) => updateValue("imageMediaId", id)}
      />
    </>
  );
}
