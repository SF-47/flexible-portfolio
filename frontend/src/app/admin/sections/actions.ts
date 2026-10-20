"use server";

import { isAxiosError } from "axios";
import { revalidatePath } from "next/cache";

import { saveSectionsLayout } from "@/lib/sections";

export type SaveSectionsResult = { ok: true } | { ok: false; message: string };

// The admin API has no authentication yet. Server actions are public POST
// endpoints, so they only run in local development until admin auth exists.
export async function saveSections(
  sections: { id: string; isVisible: boolean }[],
): Promise<SaveSectionsResult> {
  if (process.env.NODE_ENV !== "development") {
    return {
      ok: false,
      message: "Saving is only available in local development for now.",
    };
  }

  if (
    !Array.isArray(sections) ||
    sections.some(
      (section) =>
        typeof section?.id !== "string" ||
        typeof section?.isVisible !== "boolean",
    )
  ) {
    return { ok: false, message: "Invalid sections." };
  }

  try {
    await saveSectionsLayout(sections);
  } catch (error) {
    const message = isAxiosError(error)
      ? error.response?.data?.message
      : undefined;

    return {
      ok: false,
      message:
        typeof message === "string" ? message : "Could not save the sections.",
    };
  }

  revalidatePath("/", "layout");

  return { ok: true };
}
