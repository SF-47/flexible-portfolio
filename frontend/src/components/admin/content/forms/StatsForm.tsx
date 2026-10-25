import { TextField } from "../fields/TextField";
import ArrayItemsEditor from "../fields/ArrayItemsEditor";
import { asItems, type FormProps } from "./types";

export default function StatsForm({ draft, updateValue }: FormProps) {
  return (
    <ArrayItemsEditor
      label="Statistics"
      max={6}
      itemName="statistic"
      items={asItems(draft.items)}
      onChange={(items) => updateValue("items", items)}
      createItem={() => ({ value: "", label: "" })}
      itemTitle={(item) => `${item.value ?? ""} ${item.label ?? ""}`.trim()}
      renderItem={(item, update) => (
        <>
          <TextField
            label="Value (e.g. 250+)"
            value={item.value}
            onChange={(v) => update("value", v)}
          />
          <TextField
            label="Label"
            value={item.label}
            onChange={(v) => update("label", v)}
          />
        </>
      )}
    />
  );
}
