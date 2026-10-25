import {
  TextField,
  TextareaField,
  HeaderFields,
  SelectField,
} from "../fields/TextField";
import ArrayItemsEditor from "../fields/ArrayItemsEditor";
import { asItems, type FormProps } from "./types";

const ratings = [1, 2, 3, 4, 5].map((n) => ({
  value: String(n),
  label: `${n} / 5`,
}));

export default function TestimonialsForm({
  draft,
  updateField,
  updateValue,
}: FormProps) {
  return (
    <>
      <HeaderFields draft={draft} updateField={updateField} />
      <ArrayItemsEditor
        max={6}
        label="Testimonials"
        itemName="testimonial"
        items={asItems(draft.items)}
        onChange={(items) => updateValue("items", items)}
        createItem={() => ({
          name: "",
          role: "",
          initials: "",
          rating: 5,
          message: "",
        })}
        itemTitle={(item) => String(item.name ?? "")}
        renderItem={(item, update) => (
          <>
            <TextField
              label="Name"
              value={item.name}
              onChange={(v) => update("name", v)}
            />
            <TextField
              label="Role"
              value={item.role}
              onChange={(v) => update("role", v)}
            />
            <TextField
              label="Initials"
              value={item.initials}
              onChange={(v) => update("initials", v)}
            />
            <SelectField
              label="Rating"
              value={String(item.rating ?? 5)}
              options={ratings}
              onChange={(v) => update("rating", Number(v))}
            />
            <TextareaField
              label="Message"
              value={item.message}
              onChange={(v) => update("message", v)}
            />
          </>
        )}
      />
    </>
  );
}
