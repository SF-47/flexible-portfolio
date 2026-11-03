import LinkField from "../fields/LinkField";
import { TextField, TextareaField, HeaderFields } from "../fields/TextField";
import ArrayItemsEditor from "../fields/ArrayItemsEditor";
import IconField from "../fields/IconField";
import { asItems, type FormProps } from "./types";

export default function FAQForm({
  draft,
  updateField,
  updateValue,
}: FormProps) {
  return (
    <>
      <HeaderFields draft={draft} updateField={updateField} />
      <IconField
        label="Help Icon"
        value={draft.helpIcon}
        onChange={(v) => updateField("helpIcon", v)}
      />
      <TextField
        label="Help Title"
        value={draft.helpTitle}
        onChange={(v) => updateField("helpTitle", v)}
      />
      <TextField
        label="Help Link Text"
        value={draft.helpLinkText}
        onChange={(v) => updateField("helpLinkText", v)}
      />
      <LinkField
        label="Help Link Destination (optional)"
        value={draft.helpLinkUrl}
        onChange={(v) => updateField("helpLinkUrl", v)}
      />
      <ArrayItemsEditor
        max={5}
        label="Questions"
        itemName="question"
        items={asItems(draft.items)}
        onChange={(items) => updateValue("items", items)}
        createItem={() => ({ question: "", answer: "" })}
        itemTitle={(item) => String(item.question ?? "")}
        renderItem={(item, update) => (
          <>
            <TextField
              label="Question"
              value={item.question}
              onChange={(v) => update("question", v)}
            />
            <TextareaField
              label="Answer"
              value={item.answer}
              onChange={(v) => update("answer", v)}
            />
          </>
        )}
      />
    </>
  );
}
