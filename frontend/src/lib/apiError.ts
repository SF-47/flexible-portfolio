import "server-only";

import { isAxiosError } from "axios";

// Turns an API failure into a message that is safe to show to the admin.
// The API answers with { message } for validation (400) and conflict (409) errors.
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError(error)) return fallback;

  const message = error.response?.data?.message;

  if (typeof message === "string") return message;

  return error.response ? fallback : "Could not reach the API.";
}
