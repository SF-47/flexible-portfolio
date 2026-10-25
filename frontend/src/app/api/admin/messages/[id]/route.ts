import { isAxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { axiosClient } from "@/lib/axios";

type Params = { params: Promise<{ id: string }> };

const SetReadSchema = z.object({ isRead: z.boolean() });

const guidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function fail(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

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

    if (response.status === 404) return fail(404, "Message not found.");
    if (response.status !== successStatus) {
      return fail(500, "Could not update the message.");
    }

    revalidateMessagePages();

    return successStatus === 204
      ? new NextResponse(null, { status: 204 })
      : NextResponse.json(response.data);
  } catch (error) {
    if (isAxiosError(error) && !error.response) {
      return fail(
        502,
        "Could not reach the API server. Is the backend running?",
      );
    }

    return fail(500, "Could not update the message.");
  }
}

// Mark a message as read or unread.
export async function PUT(request: Request, { params }: Params) {
  // Development only: there is no admin authentication yet.
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }

  const { id } = await params;
  if (!guidPattern.test(id)) return fail(404, "Message not found.");

  const parsed = SetReadSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) return fail(400, "isRead must be true or false.");

  return forward(
    () =>
      axiosClient.put(`/api/admin/messages/${id}/read`, parsed.data, {
        validateStatus: () => true,
      }),
    200,
  );
}

export async function DELETE(_request: Request, { params }: Params) {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }

  const { id } = await params;
  if (!guidPattern.test(id)) return fail(404, "Message not found.");

  return forward(
    () =>
      axiosClient.delete(`/api/admin/messages/${id}`, {
        validateStatus: () => true,
      }),
    204,
  );
}
