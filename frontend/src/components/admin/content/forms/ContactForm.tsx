import { HeaderFields } from "../fields/TextField";
import type { FormProps } from "./types";

// Only the heading is edited here. The form labels, placeholders and button text stay
// in the saved content untouched, and the company address, phone and email come
// from Site Settings.
export default function ContactForm({ draft, updateField }: FormProps) {
  return <HeaderFields draft={draft} updateField={updateField} />;
}
