import { revalidatePath } from "next/cache";

import { adminClient } from "@/lib/api/admin/client";
import {
  adminErrorResponse,
  adminFail,
  adminJson,
  guardAdminRoute,
} from "@/lib/api/admin/http";
import { fetchAdminSections } from "@/lib/api/admin/sections";
import { sectionSchemas } from "@/schemas/sectionSchemas";

type SavedContent = {
  contentJson: string;
  updatedAt: string;
  message?: string;
};

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await guardAdminRoute(request);
  if (denied) return denied;

  const { id } = await params;

  // The id is placed in a URL path, so it must be a plain GUID.
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  ) {
    return adminFail(404, "Section not found.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return adminFail(400, "The request body must be JSON.");
  }

  const { contentJson, expectedUpdatedAt } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (
    typeof contentJson !== "string" ||
    typeof expectedUpdatedAt !== "string"
  ) {
    return adminFail(400, "contentJson and expectedUpdatedAt are required.");
  }

  if (Number.isNaN(Date.parse(expectedUpdatedAt))) {
    return adminFail(400, "expectedUpdatedAt must be a valid date.");
  }

  let content: unknown;
  try {
    content = JSON.parse(contentJson);
  } catch {
    return adminFail(400, "contentJson is not valid JSON.");
  }

  // The schema comes from the section's real type in the database, never from the client.
  let type: keyof typeof sectionSchemas | undefined;
  try {
    const sections = await fetchAdminSections();
    type = sections.find((section) => section.id === id)?.type;
  } catch (error) {
    return adminErrorResponse(error, "Could not load the section.");
  }

  if (!type) return adminFail(404, "Section not found.");

  // Validate only; the original string is forwarded so unknown fields are kept.
  const parsed = sectionSchemas[type].safeParse(content);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return adminFail(
      400,
      `Invalid ${type} content: ${issue.path.join(".")} ${issue.message}`,
    );
  }

  try {
    const response = await adminClient.put<SavedContent>(
      `/api/admin/sections/${id}/content`,
      { contentJson, expectedUpdatedAt },
      { validateStatus: () => true },
    );

    if (response.status !== 200) {
      // Pass through meaningful errors (400, 404, 409); hide anything else.
      const known = [400, 404, 409].includes(response.status);
      const message =
        known && typeof response.data?.message === "string"
          ? response.data.message
          : "Could not save the content.";

      return adminFail(known ? response.status : 500, message);
    }

    revalidatePath("/");
    revalidatePath("/admin/content");
    revalidatePath("/admin/preview");

    return adminJson(response.data);
  } catch (error) {
    return adminErrorResponse(error, "Could not save the content.");
  }
}
