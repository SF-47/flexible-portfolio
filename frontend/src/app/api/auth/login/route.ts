import { NextResponse } from "next/server";
import { adminFail, rejectCrossOrigin } from "@/lib/api/admin/http";
import { axiosClient } from "@/lib/api/client";

// The visitor's address as set by the reverse proxy in front of Next.js (none in development).
function clientIpHeader(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim();

  return ip ? { "X-Forwarded-For": ip } : {};
}

export async function POST(request: Request) {
  // Refuse a login form posted from another site (login CSRF).
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  let credentials: unknown;

  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  if (
    typeof credentials !== "object" ||
    credentials === null ||
    !("email" in credentials) ||
    !("password" in credentials) ||
    typeof credentials.email !== "string" ||
    typeof credentials.password !== "string"
  ) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 },
    );
  }

  try {
    const backend = await axiosClient.post(
      "/api/auth/login",
      {
        email: credentials.email,
        password: credentials.password,
      },
      {
        validateStatus: () => true,
        // Lets the API rate-limit per visitor instead of per Next.js server. Only the
        // first (client) address is sent, and the API trusts it from loopback only.
        headers: clientIpHeader(request),
      },
    );

    if (backend.status === 429) {
      const retryAfter = backend.headers["retry-after"];
      const response = adminFail(
        429,
        "Too many failed attempts. Please try again later.",
      );
      if (typeof retryAfter === "string") {
        response.headers.set("Retry-After", retryAfter);
      }

      return response;
    }

    if (backend.status !== 200) {
      return adminFail(
        backend.status === 401 ? 401 : 502,
        backend.status === 401
          ? "Invalid email or password."
          : "Unable to sign in.",
      );
    }

    const response = NextResponse.json(backend.data, {
      headers: { "Cache-Control": "no-store" },
    });

    // The ASP.NET server issues the authentication cookie.
    // Relay only the expected cookie to the browser.
    const setCookies = backend.headers["set-cookie"] ?? [];

    const adminCookie = setCookies.find((header) =>
      header.startsWith("portfolio_admin="),
    );

    if (!adminCookie) {
      return NextResponse.json(
        { message: "Authentication cookie was not issued." },
        { status: 502 },
      );
    }

    response.headers.append("Set-Cookie", adminCookie);

    return response;
  } catch {
    return NextResponse.json(
      { message: "Could not reach the authentication server." },
      { status: 502 },
    );
  }
}
