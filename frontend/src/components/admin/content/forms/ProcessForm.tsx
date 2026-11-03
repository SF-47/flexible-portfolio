import { TextField, TextareaField, HeaderFields } from "../fields/TextField";
import ArrayItemsEditor from "../fields/ArrayItemsEditor";
import IconField from "../fields/IconField";
import { asItems, type FormProps } from "./types";

export default function ProcessForm({
  draft,
  updateField,
  updateValue,
}: FormProps) {
  return (
    <>
      <HeaderFields draft={draft} updateField={updateField} />
      <ArrayItemsEditor
        max={6}
        label="Steps"
        itemName="step"
        items={asItems(draft.steps)}
        onChange={(items) => updateValue("steps", items)}
        createItem={(index) => ({
          number: String(index + 1).padStart(2, "0"),
          icon: "Star",
          title: "",
          description: "",
        })}
        itemTitle={(item) => String(item.title ?? "")}
        renderItem={(item, update) => (
          <>
            <TextField
              label="Number"
              value={item.number}
              onChange={(v) => update("number", v)}
            />
            <IconField
              label="Icon"
              value={item.icon}
              onChange={(v) => update("icon", v)}
            />
            <TextField
              label="Title"
              value={item.title}
              onChange={(v) => update("title", v)}
            />
            <TextareaField
              label="Description"
              value={item.description}
              onChange={(v) => update("description", v)}
            />
          </>
        )}
      />
    </>
  );
}
