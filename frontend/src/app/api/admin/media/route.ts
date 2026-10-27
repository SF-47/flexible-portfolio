import { revalidatePath } from "next/cache";

import { adminClient } from "@/lib/api/admin/client";
import {
  adminErrorResponse,
  adminFail,
  adminJson,
  guardAdminRoute,
} from "@/lib/api/admin/http";
import type { AdminMediaAsset, MediaAsset } from "@/types/media";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Pages that show or pick images.
function revalidateMediaPages() {
  revalidatePath("/admin/media");
  revalidatePath("/admin/content");
  revalidatePath("/admin/navigation");
}

// Admin read: every image with its usage (the Media Library page loads this on the server).
export async function GET() {
  const denied = await guardAdminRoute();
  if (denied) return denied;

  try {
    const response = await adminClient.get<AdminMediaAsset[]>(
      "/api/admin/media",
      { validateStatus: () => true },
    );

    if (response.status !== 200) {
      return adminFail(500, "Could not load the images.");
    }

    return adminJson(response.data);
  } catch (error) {
    return adminErrorResponse(error, "Could not load the images.");
  }
}

export async function POST(request: Request) {
  const denied = await guardAdminRoute(request);
  if (denied) return denied;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return adminFail(400, "The request must be a form upload.");
  }

  const file = form.get("file");
  const altText = form.get("altText");

  if (!(file instanceof File) || file.size === 0) {
    return adminFail(400, "Please choose an image.");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return adminFail(400, "Image must not exceed 5 MB.");
  }

  if (!IMAGE_TYPES.includes(file.type)) {
    return adminFail(400, "Use a JPG, PNG or WebP image.");
  }

  const body = new FormData();
  body.append("file", file, file.name);
  body.append(
    "altText",
    typeof altText === "string" ? altText.slice(0, 200) : "",
  );

  try {
    const response = await adminClient.post<MediaAsset & { message?: string }>(
      "/api/admin/media",
      body,
      {
        validateStatus: () => true,
      },
    );

    if (response.status !== 200) {
      const message =
        response.status === 400 && typeof response.data?.message === "string"
          ? response.data.message
          : "Could not upload the image.";

      return adminFail(response.status === 400 ? 400 : 500, message);
    }

    revalidateMediaPages();

    return adminJson(response.data);
  } catch (error) {
    return adminErrorResponse(error, "Could not upload the image.");
  }
}
