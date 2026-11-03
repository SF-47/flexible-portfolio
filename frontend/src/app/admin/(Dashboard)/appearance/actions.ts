"use server";

import { isAxiosError } from "axios";
import { revalidatePath } from "next/cache";

import { AdminAuthError, getAdminSession } from "@/lib/api/admin/client";
import { activateTheme, updateTheme } from "@/lib/api/themes";
import type { ThemeConfig } from "@/types/theme";

export type SaveThemeResult =
  | { ok: true }
  | {
      ok: false;
      stage: "auth" | "guard" | "update" | "activate";
      message: string;
    };

const hexColor = /^#[0-9a-fA-F]{6}$/;

const colorKeys = [
  "primaryColor",
  "accentColor",
  "backgroundColor",
  "textColor",
  "onPrimaryColor",
  "onAccentColor",
] as const;

// Server actions are public POST endpoints (Next.js already rejects a foreign Origin), so
// each one asks the API who is calling. The API checks the session again on every write.
async function authFailure(): Promise<SaveThemeResult | null> {
  const session = await getAdminSession();

  if (session.status === "authenticated") return null;

  return {
    ok: false,
    stage: "auth",
    message:
      session.status === "unavailable"
        ? "Could not reach the API server. Is the backend running?"
        : "Your session has expired. Please sign in again.",
  };
}

function errorMessage(error: unknown) {
  if (error instanceof AdminAuthError) {
    return error.status === 401
      ? "Your session has expired. Please sign in again."
      : "You do not have access to this action.";
  }

  if (isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string") return message;

    return error.response
      ? `The server responded with ${error.response.status}.`
      : "Could not reach the API.";
  }

  return "Something went wrong.";
}

// Predefined themes are only activated. A custom theme (config given) is updated
// first and activated second, and a failure reports which step failed.
export async function saveTheme(
  id: number,
  config: ThemeConfig | null,
): Promise<SaveThemeResult> {
  const denied = await authFailure();
  if (denied) return denied;

  if (config) {
    if (colorKeys.some((key) => !hexColor.test(config[key]))) {
      return {
        ok: false,
        stage: "guard",
        message: "Every color must be a HEX value like #1a2b3c.",
      };
    }

    try {
      await updateTheme(id, config);
    } catch (error) {
      return { ok: false, stage: "update", message: errorMessage(error) };
    }
  }

  try {
    await activateTheme(id);
  } catch (error) {
    // The custom theme may already have been saved at this point.
    revalidatePath("/admin/appearance");
    return { ok: false, stage: "activate", message: errorMessage(error) };
  }

  revalidatePath("/", "layout");

  return { ok: true };
}
