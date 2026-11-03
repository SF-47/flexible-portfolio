import { TextField, HeaderFields, CheckboxField } from "../fields/TextField";
import ArrayItemsEditor from "../fields/ArrayItemsEditor";
import IconField from "../fields/IconField";
import ImageField from "../fields/ImageField";
import { asItems, mediaId, type FormProps } from "./types";

export default function GalleryForm({
  draft,
  updateField,
  updateValue,
}: FormProps) {
  return (
    <>
      <HeaderFields draft={draft} updateField={updateField} />
      <IconField
        label="Section Icon"
        value={draft.icon}
        onChange={(v) => updateField("icon", v)}
      />
      <ArrayItemsEditor
        max={12}
        label="Gallery Items"
        itemName="image"
        items={asItems(draft.items)}
        onChange={(items) => updateValue("items", items)}
        createItem={() => ({
          title: "",
          category: "",
          imageMediaId: null,
          featured: false,
        })}
        itemTitle={(item) => String(item.title ?? "")}
        renderItem={(item, update) => (
          <>
            <TextField
              label="Title"
              value={item.title}
              onChange={(v) => update("title", v)}
            />
            <TextField
              label="Category"
              value={item.category}
              onChange={(v) => update("category", v)}
            />
            <ImageField
              label="Image (optional)"
              value={mediaId(item.imageMediaId)}
              onChange={(id) => update("imageMediaId", id)}
            />
            <CheckboxField
              label="Featured (shown larger)"
              checked={item.featured === true}
              onChange={(v) => update("featured", v)}
            />
          </>
        )}
      />
    </>
  );
}
