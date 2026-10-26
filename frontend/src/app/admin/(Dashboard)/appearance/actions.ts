"use server";

import { isAxiosError } from "axios";
import { revalidatePath } from "next/cache";

import { activateTheme, updateTheme } from "@/lib/api/themes";
import type { ThemeConfig } from "@/types/theme";

export type SaveThemeResult =
  | { ok: true }
  | { ok: false; stage: "guard" | "update" | "activate"; message: string };

const hexColor = /^#[0-9a-fA-F]{6}$/;

const colorKeys = [
  "primaryColor",
  "accentColor",
  "backgroundColor",
  "textColor",
  "onPrimaryColor",
  "onAccentColor",
] as const;

// The admin API has no authentication yet. Server actions are public POST
// endpoints, so they only run in local development until admin auth exists.
function writesAllowed() {
  return process.env.NODE_ENV === "development";
}

function errorMessage(error: unknown) {
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
  if (!writesAllowed()) {
    return {
      ok: false,
      stage: "guard",
      message: "Saving is only available in local development for now.",
    };
  }

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
