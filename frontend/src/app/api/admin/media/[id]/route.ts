import { revalidatePath } from "next/cache";

import { adminClient } from "@/lib/api/admin/client";
import {
  adminErrorResponse,
  adminFail,
  adminJson,
  adminNoContent,
  guardAdminRoute,
} from "@/lib/api/admin/http";
import { UpdateMediaSchema } from "@/schemas/mediaSchemas";

type Params = { params: Promise<{ id: string }> };

// Pages that show or pick images, and the public site that renders them.
function revalidateMediaPages() {
  revalidatePath("/admin/media");
  revalidatePath("/admin/content");
  revalidatePath("/admin/navigation");
  revalidatePath("/", "layout");
}

// The id is placed in a URL path, so it must be a plain number.
function parseId(id: string) {
  return /^[1-9][0-9]{0,9}$/.test(id) ? id : null;
}

// Edit the alt text. The file and the record are not replaced.
export async function PUT(request: Request, { params }: Params) {
  const denied = await guardAdminRoute(request);
  if (denied) return denied;

  const id = parseId((await params).id);
  if (!id) return adminFail(404, "Image not found.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return adminFail(400, "The request body must be JSON.");
  }

  const parsed = UpdateMediaSchema.safeParse(body);
  if (!parsed.success) {
    return adminFail(400, `Alt text: ${parsed.error.issues[0].message}`);
  }

  try {
    const response = await adminClient.put(
      `/api/admin/media/${id}`,
      parsed.data,
      { validateStatus: () => true },
    );

    if (response.status !== 200) {
      const known = [400, 404].includes(response.status);
      const message =
        known && typeof response.data?.message === "string"
          ? response.data.message
          : "Could not save the alt text.";

      return adminFail(known ? response.status : 500, message);
    }

    revalidateMediaPages();

    return adminJson(response.data);
  } catch (error) {
    return adminErrorResponse(error, "Could not save the alt text.");
  }
}

// Delete an unused image. The API answers 409 (with where it is used) when it is in use.
export async function DELETE(request: Request, { params }: Params) {
  const denied = await guardAdminRoute(request);
  if (denied) return denied;

  const id = parseId((await params).id);
  if (!id) return adminFail(404, "Image not found.");

  try {
    const response = await adminClient.delete(`/api/admin/media/${id}`, {
      validateStatus: () => true,
    });

    if (response.status === 204 || response.status === 200) {
      revalidateMediaPages();

      return adminNoContent();
    }

    if (response.status === 409) {
      return adminFail(
        409,
        typeof response.data?.message === "string"
          ? response.data.message
          : "Cannot delete this image because it is in use.",
        {
          usedIn: Array.isArray(response.data?.usedIn)
            ? response.data.usedIn
            : [],
        },
      );
    }

    if (response.status === 404) return adminFail(404, "Image not found.");

    return adminFail(500, "Could not delete the image.");
  } catch (error) {
    return adminErrorResponse(error, "Could not delete the image.");
  }
}
