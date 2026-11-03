export type Content = Record<string, unknown>;

// Every section form receives the draft and these two update functions.
// updateField is for text; updateValue is for arrays, numbers, booleans and ids.
export type FormProps = {
  draft: Content;
  updateField: (field: string, value: string) => void;
  updateValue: (field: string, value: unknown) => void;
};

export type Item = Record<string, unknown>;

// Safe readers for values that come from stored JSON.
export function mediaId(value: unknown): number | null {
  return typeof value === "number" ? value : null;
}

export function asItems(value: unknown): Item[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is Item =>
      typeof item === "object" && item !== null && !Array.isArray(item),
  );
}
