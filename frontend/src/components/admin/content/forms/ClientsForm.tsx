import { TextField, HeaderFields } from "../fields/TextField";
import ArrayItemsEditor from "../fields/ArrayItemsEditor";
import IconField from "../fields/IconField";
import { asItems, type FormProps } from "./types";

export default function ClientsForm({
  draft,
  updateField,
  updateValue,
}: FormProps) {
  return (
    <>
      <HeaderFields draft={draft} updateField={updateField} />
      <ArrayItemsEditor
        max={6}
        label="Clients & Partners"
        itemName="client"
        items={asItems(draft.items)}
        onChange={(items) => updateValue("items", items)}
        createItem={() => ({ name: "", icon: "Building2" })}
        itemTitle={(item) => String(item.name ?? "")}
        renderItem={(item, update) => (
          <>
            <TextField
              label="Name"
              value={item.name}
              onChange={(v) => update("name", v)}
            />
            <IconField
              label="Icon"
              value={item.icon}
              onChange={(v) => update("icon", v)}
            />
          </>
        )}
      />
    </>
  );
}
