import { isAxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { axiosClient } from "@/lib/axios";
import type { AdminMediaAsset, MediaAsset } from "@/types/media";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Pages that show or pick images.
function revalidateMediaPages() {
  revalidatePath("/admin/media");
  revalidatePath("/admin/content");
  revalidatePath("/admin/navigation");
}

function fail(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

// Admin read: every image with its usage (the Media Library page loads this on the server).
export async function GET() {
  // Development only: there is no admin authentication yet.
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const response = await axiosClient.get<AdminMediaAsset[]>(
      "/api/admin/media",
      { validateStatus: () => true },
    );

    if (response.status !== 200) {
      return fail(500, "Could not load the images.");
    }

    return NextResponse.json(response.data);
  } catch (error) {
    if (isAxiosError(error) && !error.response) {
      return fail(
        502,
        "Could not reach the API server. Is the backend running?",
      );
    }

    return fail(500, "Could not load the images.");
  }
}

export async function POST(request: Request) {
  // Development only: there is no admin authentication yet.
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, "The request must be a form upload.");
  }

  const file = form.get("file");
  const altText = form.get("altText");

  if (!(file instanceof File) || file.size === 0) {
    return fail(400, "Please choose an image.");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return fail(400, "Image must not exceed 5 MB.");
  }

  if (!IMAGE_TYPES.includes(file.type)) {
    return fail(400, "Use a JPG, PNG or WebP image.");
  }

  const body = new FormData();
  body.append("file", file, file.name);
  body.append(
    "altText",
    typeof altText === "string" ? altText.slice(0, 200) : "",
  );

  try {
    const response = await axiosClient.post<MediaAsset & { message?: string }>(
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

      return fail(response.status === 400 ? 400 : 500, message);
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
    return fail(500, "Could not upload the image.");
  }
}
