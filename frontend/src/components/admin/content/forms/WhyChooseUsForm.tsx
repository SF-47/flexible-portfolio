import { TextField, TextareaField, HeaderFields } from "../fields/TextField";
import ArrayItemsEditor from "../fields/ArrayItemsEditor";
import IconField from "../fields/IconField";
import { asItems, type FormProps } from "./types";

export default function WhyChooseUsForm({
  draft,
  updateField,
  updateValue,
}: FormProps) {
  return (
    <>
      <HeaderFields draft={draft} updateField={updateField} />
      <ArrayItemsEditor
        max={6}
        label="Advantages"
        itemName="advantage"
        items={asItems(draft.items)}
        onChange={(items) => updateValue("items", items)}
        createItem={() => ({ icon: "Star", title: "", description: "" })}
        itemTitle={(item) => String(item.title ?? "")}
        renderItem={(item, update) => (
          <>
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
