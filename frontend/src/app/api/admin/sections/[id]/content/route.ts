import { isAxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getAdminSections } from "@/lib/api/admin/sections";
import { axiosClient } from "@/lib/api/client";
import { sectionSchemas } from "@/schemas/sectionSchemas";

type SavedContent = {
  contentJson: string;
  updatedAt: string;
  message?: string;
};

function fail(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // Development only: there is no admin authentication yet.
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }

  const { id } = await params;

  // The id is placed in a URL path, so it must be a plain GUID.
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  ) {
    return fail(404, "Section not found.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "The request body must be JSON.");
  }

  const { contentJson, expectedUpdatedAt } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (
    typeof contentJson !== "string" ||
    typeof expectedUpdatedAt !== "string"
  ) {
    return fail(400, "contentJson and expectedUpdatedAt are required.");
  }

  if (Number.isNaN(Date.parse(expectedUpdatedAt))) {
    return fail(400, "expectedUpdatedAt must be a valid date.");
  }

  let content: unknown;
  try {
    content = JSON.parse(contentJson);
  } catch {
    return fail(400, "contentJson is not valid JSON.");
  }

  // The schema comes from the section's real type in the database, never from the client.
  let type: keyof typeof sectionSchemas | undefined;
  try {
    const sections = await getAdminSections();
    type = sections.find((section) => section.id === id)?.type;
  } catch {
    return fail(502, "Could not reach the API server. Is the backend running?");
  }

  if (!type) return fail(404, "Section not found.");

  // Validate only; the original string is forwarded so unknown fields are kept.
  const parsed = sectionSchemas[type].safeParse(content);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return fail(
      400,
      `Invalid ${type} content: ${issue.path.join(".")} ${issue.message}`,
    );
  }

  try {
    const response = await axiosClient.put<SavedContent>(
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

      return fail(known ? response.status : 500, message);
    }

    revalidatePath("/");
    revalidatePath("/admin/content");
    revalidatePath("/admin/preview");

    return NextResponse.json(response.data);
  } catch (error) {
    if (isAxiosError(error) && !error.response) {
      return fail(
        502,
        "Could not reach the API server. Is the backend running?",
      );
    }
    return fail(500, "Could not save the content.");
  }
}
