import { NextResponse } from "next/server";
import { axiosClient } from "@/lib/api/client";

export async function POST(request: Request) {
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
      },
    );

    if (backend.status !== 200) {
      return NextResponse.json(
        {
          message:
            backend.status === 401
              ? "Invalid email or password."
              : "Unable to sign in.",
        },
        { status: backend.status === 401 ? 401 : 502 },
      );
    }

    const response = NextResponse.json(backend.data);

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
