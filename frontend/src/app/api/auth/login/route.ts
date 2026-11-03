import { NextResponse } from "next/server";
import { adminFail, rejectCrossOrigin } from "@/lib/api/admin/http";
import { axiosClient } from "@/lib/api/client";

// The visitor's address for the API's login rate limit. A browser can send any
// X-Forwarded-For it likes, so the header is only used when TRUST_PROXY_HEADERS=true, which
// the deployment sets when Next.js runs behind a reverse proxy that adds the real address.
// That proxy appends it, so the LAST entry is the trustworthy one, never the first.
// Without it nothing is forwarded and the API limits by the Next.js server's own address:
// safe, but all visitors then share one login limit.
function clientIpHeader(request: Request) {
  if (process.env.TRUST_PROXY_HEADERS !== "true") return {};

  const ip = request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();

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
        // The API only trusts this header from its configured proxies (loopback by default).
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
