import "server-only";

import { isAxiosError } from "axios";
import { NextResponse } from "next/server";

import { AdminAuthError, hasAdminCookie } from "@/lib/api/admin/client";

// Authenticated answers must never be stored or shared between users.
const noStore = { "Cache-Control": "no-store" };

export function adminFail(status: number, message: string, extra?: object) {
  return NextResponse.json({ message, ...extra }, { status, headers: noStore });
}

export function adminJson(data: unknown) {
  return NextResponse.json(data, { headers: noStore });
}

export function adminNoContent() {
  return new NextResponse(null, { status: 204, headers: noStore });
}

// The same-origin check for browser-facing writes. A browser always sends Origin on
// POST, PUT, PATCH and DELETE, so a missing or foreign one is refused. SameSite=Lax
// alone is not relied on.
function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (!origin || !host) return false;

  try {
    if (new URL(origin).host !== host) return false;
  } catch {
    return false;
  }

  const site = request.headers.get("sec-fetch-site");

  return !site || site === "same-origin";
}

export function rejectCrossOrigin(request: Request) {
  return isSameOrigin(request)
    ? null
    : adminFail(403, "Invalid request origin.");
}

// The first line of every admin Route Handler: a cross-site write is refused and a
// request without a session cookie never reaches ASP.NET Core, which still decides.
export async function guardAdminRoute(request?: Request) {
  if (request && !["GET", "HEAD"].includes(request.method)) {
    const crossOrigin = rejectCrossOrigin(request);
    if (crossOrigin) return crossOrigin;
  }

  if (!(await hasAdminCookie())) {
    return adminFail(401, "Your session has expired. Please sign in again.");
  }

  return null;
}

// The answer for an error thrown by a call to ASP.NET Core.
export function adminErrorResponse(error: unknown, fallback: string) {
  if (error instanceof AdminAuthError) {
    return error.status === 401
      ? adminFail(401, "Your session has expired. Please sign in again.")
      : adminFail(403, "You do not have access to this action.");
  }

  if (isAxiosError(error) && !error.response) {
    return adminFail(
      502,
      "Could not reach the API server. Is the backend running?",
    );
  }

  return adminFail(500, fallback);
}
