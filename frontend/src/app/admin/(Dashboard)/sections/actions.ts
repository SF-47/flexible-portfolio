"use server";

import { isAxiosError } from "axios";
import { revalidatePath } from "next/cache";

import { AdminAuthError, getAdminSession } from "@/lib/api/admin/client";
import { saveSectionsLayout } from "@/lib/api/sections";

export type SaveSectionsResult = { ok: true } | { ok: false; message: string };

// Server actions are public POST endpoints (Next.js already rejects a foreign Origin), so
// this one asks the API who is calling. The API checks the session again on the write.
export async function saveSections(
  sections: { id: string; isVisible: boolean }[],
): Promise<SaveSectionsResult> {
  const session = await getAdminSession();

  if (session.status !== "authenticated") {
    return {
      ok: false,
      message:
        session.status === "unavailable"
          ? "Could not reach the API server. Is the backend running?"
          : "Your session has expired. Please sign in again.",
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
    if (error instanceof AdminAuthError) {
      return {
        ok: false,
        message:
          error.status === 401
            ? "Your session has expired. Please sign in again."
            : "You do not have access to this action.",
      };
    }

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
