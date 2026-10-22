export type Content = Record<string, unknown>;

// Parses a section's ContentJson. Returns null unless it is a JSON object.
export function parseContent(json: string): Content | null {
  try {
    const value: unknown = JSON.parse(json);

    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return null;
    }

    return value as Content;
  } catch {
    return null;
  }
}

// JSON with sorted keys, so two contents compare equal whatever their key order or
// spacing (MySQL rewrites both when it stores a json column).
function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`;
  }

  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value as Content)
      .filter(([, item]) => item !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`);

    return `{${entries.join(",")}}`;
  }

  return JSON.stringify(value) ?? "null";
}

export function sameContent(a: unknown, b: unknown): boolean {
  return canonicalJson(a) === canonicalJson(b);
}
