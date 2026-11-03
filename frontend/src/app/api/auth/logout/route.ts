import { NextRequest } from "next/server";

import {
  ADMIN_COOKIE,
  adminClient,
  AdminAuthError,
} from "@/lib/api/admin/client";
import {
  adminErrorResponse,
  adminFail,
  adminJson,
  rejectCrossOrigin,
} from "@/lib/api/admin/http";

export async function POST(request: NextRequest) {
  // Browser-initiated logout must come from our own website.
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  try {
    const backend = await adminClient.post("/api/auth/logout", null, {
      validateStatus: () => true,
    });

    if (backend.status !== 204) return adminFail(502, "Could not log out.");
  } catch (error) {
    // A session the API already rejects is as good as logged out: still clear the cookie.
    if (!(error instanceof AdminAuthError)) {
      return adminErrorResponse(error, "Could not log out.");
    }
  }

  const response = adminJson({ message: "Logged out successfully." });

  response.cookies.delete(ADMIN_COOKIE);

  return response;
}
