"use server";

import { revalidatePath } from "next/cache";

import { getApiErrorMessage } from "@/lib/apiError";
import { uploadMedia } from "@/lib/media";
import { updateSectionContent } from "@/lib/sections";
import type { ApiSection } from "@/types/apiSections";
import type { MediaAsset } from "@/types/media";

export type SaveContentResult =
  | { ok: true; section: ApiSection }
  | { ok: false; message: string };

export type UploadMediaResult =
  | { ok: true; media: MediaAsset }
  | { ok: false; message: string };

const MAX_CONTENT_LENGTH = 100_000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

// The admin API has no authentication yet. Server actions are public POST
// endpoints, so they only run in local development until admin auth exists.
// The API itself also refuses /api/admin requests outside Development.
function writesAllowed() {
  return process.env.NODE_ENV === "development";
}

const notAllowed = {
  ok: false,
  message: "Saving is only available in local development for now.",
} as const;

// The editor validates with the section's Zod schema before calling this. The API
// repeats that validation (SectionContentValidator) and is the authority.
export async function saveSectionContent(
  id: string,
  contentJson: string,
  expectedUpdatedAt: string,
): Promise<SaveContentResult> {
  if (!writesAllowed()) return notAllowed;

  if (
    typeof id !== "string" ||
    typeof contentJson !== "string" ||
    typeof expectedUpdatedAt !== "string" ||
    contentJson.length > MAX_CONTENT_LENGTH
  ) {
    return { ok: false, message: "Invalid request." };
  }

  try {
    const section = await updateSectionContent(
      id,
      contentJson,
      expectedUpdatedAt,
    );

    // The homepage and the admin pages are prerendered, so refresh them.
    revalidatePath("/", "layout");

    return { ok: true, section };
  } catch (error) {
    return {
      ok: false,
      message: getApiErrorMessage(error, "Could not save the content."),
    };
  }
}

export async function uploadImage(
  formData: FormData,
): Promise<UploadMediaResult> {
  if (!writesAllowed()) {
    return { ok: false, message: "Uploading is only available in local development for now." };
  }

  const file = formData.get("file");
  const altText = formData.get("altText");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Please choose an image." };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, message: "Image must not exceed 5 MB." };
  }

  try {
    const media = await uploadMedia(
      file,
      typeof altText === "string" ? altText.slice(0, 200) : "",
    );

    revalidatePath("/", "layout");

    return { ok: true, media };
  } catch (error) {
    return {
      ok: false,
      message: getApiErrorMessage(error, "Could not upload the image."),
    };
  }
}
