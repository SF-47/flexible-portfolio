import "server-only";

import { revalidatePath } from "next/cache";
import type { z } from "zod";

import { adminClient } from "@/lib/api/admin/client";
import {
  adminErrorResponse,
  adminFail,
  adminJson,
  guardAdminRoute,
} from "@/lib/api/admin/http";

// The shared body of the admin PUT Route Handlers: check the session and origin, validate
// the body, forward it to ASP.NET Core with the administrator's cookie and pass useful
// errors back. The API repeats the validation and is the authority.
export async function proxyAdminPut(
  request: Request,
  backendPath: string,
  schema: z.ZodType,
  // Extra pages to refresh after a successful save (the public layout is always refreshed).
  revalidate: string[] = [],
) {
  const denied = await guardAdminRoute(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return adminFail(400, "The request body must be JSON.");
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];

    return adminFail(400, `${issue.path.join(" › ")} ${issue.message}`.trim());
  }

  try {
    const response = await adminClient.put(backendPath, parsed.data, {
      validateStatus: () => true,
    });

    if (response.status !== 200) {
      const known = [400, 404, 409].includes(response.status);
      const message =
        known &&
        typeof (response.data as { message?: unknown })?.message === "string"
          ? (response.data as { message: string }).message
          : "Could not save the changes.";

      return adminFail(known ? response.status : 500, message);
    }

    // The navbar and footer are on every public page.
    revalidatePath("/", "layout");
    for (const path of revalidate) revalidatePath(path, "layout");

    return adminJson(response.data);
  } catch (error) {
    return adminErrorResponse(error, "Could not save the changes.");
  }
}

// The shared body of the admin GET Route Handlers: check the session, forward and pass on.
export async function proxyAdminGet(backendPath: string) {
  const denied = await guardAdminRoute();
  if (denied) return denied;

  try {
    const response = await adminClient.get(backendPath, {
      validateStatus: () => true,
    });

    if (response.status !== 200) {
      return adminFail(500, "Could not load the data.");
    }

    return adminJson(response.data);
  } catch (error) {
    return adminErrorResponse(error, "Could not load the data.");
  }
}
