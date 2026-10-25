import { TextField, TextareaField, HeaderFields } from "../fields/TextField";
import ArrayItemsEditor from "../fields/ArrayItemsEditor";
import ImageField from "../fields/ImageField";
import { asItems, mediaId, type FormProps } from "./types";

export default function TeamForm({
  draft,
  updateField,
  updateValue,
}: FormProps) {
  return (
    <>
      <HeaderFields draft={draft} updateField={updateField} />
      <ArrayItemsEditor
        max={6}
        label="Team Members"
        itemName="member"
        items={asItems(draft.members)}
        onChange={(items) => updateValue("members", items)}
        createItem={() => ({
          name: "",
          position: "",
          description: "",
          imageMediaId: null,
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
              label="Position"
              value={item.position}
              onChange={(v) => update("position", v)}
            />
            <TextareaField
              label="Description"
              value={item.description}
              onChange={(v) => update("description", v)}
            />
            <ImageField
              label="Photo (optional)"
              value={mediaId(item.imageMediaId)}
              onChange={(id) => update("imageMediaId", id)}
            />
          </>
        )}
      />
    </>
  );
}
