import { revalidatePath } from "next/cache";
import { z } from "zod";

import { adminClient } from "@/lib/api/admin/client";
import {
  adminErrorResponse,
  adminFail,
  adminJson,
  adminNoContent,
  guardAdminRoute,
} from "@/lib/api/admin/http";

type Params = { params: Promise<{ id: string }> };

const SetReadSchema = z.object({ isRead: z.boolean() });

const guidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Messages are shown on the inbox and counted on the dashboard.
function revalidateMessagePages() {
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

// Run the call to ASP.NET and turn its answer into this route's response.
async function forward(
  call: () => Promise<{ status: number; data: unknown }>,
  successStatus: number,
) {
  try {
    const response = await call();

    if (response.status === 404) return adminFail(404, "Message not found.");
    if (response.status !== successStatus) {
      return adminFail(500, "Could not update the message.");
    }

    revalidateMessagePages();

    return successStatus === 204 ? adminNoContent() : adminJson(response.data);
  } catch (error) {
    return adminErrorResponse(error, "Could not update the message.");
  }
}

// Mark a message as read or unread.
export async function PUT(request: Request, { params }: Params) {
  const denied = await guardAdminRoute(request);
  if (denied) return denied;

  const { id } = await params;
  if (!guidPattern.test(id)) return adminFail(404, "Message not found.");

  const parsed = SetReadSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) return adminFail(400, "isRead must be true or false.");

  return forward(
    () =>
      adminClient.put(`/api/admin/messages/${id}/read`, parsed.data, {
        validateStatus: () => true,
      }),
    200,
  );
}

export async function DELETE(request: Request, { params }: Params) {
  const denied = await guardAdminRoute(request);
  if (denied) return denied;

  const { id } = await params;
  if (!guidPattern.test(id)) return adminFail(404, "Message not found.");

  return forward(
    () =>
      adminClient.delete(`/api/admin/messages/${id}`, {
        validateStatus: () => true,
      }),
    204,
  );
}
