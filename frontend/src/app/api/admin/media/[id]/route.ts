import { isAxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { axiosClient } from "@/lib/api/client";
import { UpdateMediaSchema } from "@/schemas/mediaSchemas";

type Params = { params: Promise<{ id: string }> };

function fail(status: number, message: string, extra?: object) {
  return NextResponse.json({ message, ...extra }, { status });
}

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
  // Development only: there is no admin authentication yet.
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }

  const id = parseId((await params).id);
  if (!id) return fail(404, "Image not found.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "The request body must be JSON.");
  }

  const parsed = UpdateMediaSchema.safeParse(body);
  if (!parsed.success) {
    return fail(400, `Alt text: ${parsed.error.issues[0].message}`);
  }

  try {
    const response = await axiosClient.put(
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

      return fail(known ? response.status : 500, message);
    }

    revalidateMediaPages();

    return NextResponse.json(response.data);
  } catch (error) {
    if (isAxiosError(error) && !error.response) {
      return fail(
        502,
        "Could not reach the API server. Is the backend running?",
      );
    }

    return fail(500, "Could not save the alt text.");
  }
}

// Delete an unused image. The API answers 409 (with where it is used) when it is in use.
export async function DELETE(_request: Request, { params }: Params) {
  // Development only: there is no admin authentication yet.
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }

  const id = parseId((await params).id);
  if (!id) return fail(404, "Image not found.");

  try {
    const response = await axiosClient.delete(`/api/admin/media/${id}`, {
      validateStatus: () => true,
    });

    if (response.status === 204 || response.status === 200) {
      revalidateMediaPages();

      return new NextResponse(null, { status: 204 });
    }

    if (response.status === 409) {
      return fail(
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

    if (response.status === 404) return fail(404, "Image not found.");

    return fail(500, "Could not delete the image.");
  } catch (error) {
    if (isAxiosError(error) && !error.response) {
      return fail(
        502,
        "Could not reach the API server. Is the backend running?",
      );
    }

    return fail(500, "Could not delete the image.");
  }
}
