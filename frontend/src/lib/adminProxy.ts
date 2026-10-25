import "server-only";

import { isAxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { z } from "zod";

import { axiosClient } from "@/lib/axios";

function fail(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

// The shared body of the admin PUT Route Handlers: development only, validate the
// body, forward it to ASP.NET Core and pass useful errors back. The API repeats the
// validation and is the authority.
export async function proxyAdminPut(
  request: Request,
  backendPath: string,
  schema: z.ZodType,
  // Extra pages to refresh after a successful save (the public layout is always refreshed).
  revalidate: string[] = [],
) {
  // Development only: there is no admin authentication yet.
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "The request body must be JSON.");
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];

    return fail(400, `${issue.path.join(" › ")} ${issue.message}`.trim());
  }

  try {
    const response = await axiosClient.put(backendPath, parsed.data, {
      validateStatus: () => true,
    });

    if (response.status !== 200) {
      const known = [400, 404, 409].includes(response.status);
      const message =
        known && typeof response.data?.message === "string"
          ? response.data.message
          : "Could not save the changes.";

      return fail(known ? response.status : 500, message);
    }

    // The navbar and footer are on every public page.
    revalidatePath("/", "layout");
    for (const path of revalidate) revalidatePath(path, "layout");

    return NextResponse.json(response.data);
  } catch (error) {
    if (isAxiosError(error) && !error.response) {
      return fail(
        502,
        "Could not reach the API server. Is the backend running?",
      );
    }

    return fail(500, "Could not save the changes.");
  }
}

// The shared body of the admin GET Route Handlers: development only, forward and pass on.
export async function proxyAdminGet(backendPath: string) {
  // Development only: there is no admin authentication yet.
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const response = await axiosClient.get(backendPath, {
      validateStatus: () => true,
    });

    if (response.status !== 200) return fail(500, "Could not load the data.");

    return NextResponse.json(response.data);
  } catch (error) {
    if (isAxiosError(error) && !error.response) {
      return fail(
        502,
        "Could not reach the API server. Is the backend running?",
      );
    }

    return fail(500, "Could not load the data.");
  }
}
