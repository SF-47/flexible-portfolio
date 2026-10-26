import { NextRequest, NextResponse } from "next/server";
import { axiosClient } from "@/lib/api/client";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const expectedOrigin = request.nextUrl.origin;

  // Browser-initiated logout must come from our own website.
  if (origin !== expectedOrigin) {
    return NextResponse.json(
      { message: "Invalid request origin." },
      { status: 403 },
    );
  }

  const session = request.cookies.get("portfolio_admin");

  if (!session) {
    return NextResponse.json(
      { message: "Not authenticated." },
      { status: 401 },
    );
  }

  try {
    const backend = await axiosClient.post(
      "/api/auth/logout",
      null,
      {
        headers: {
          Cookie: `portfolio_admin=${session.value}`,
        },
        validateStatus: () => true,
      },
    );

    if (backend.status !== 204) {
      return NextResponse.json(
        { message: "Could not log out." },
        { status: backend.status === 401 ? 401 : 502 },
      );
    }

    const response = NextResponse.json(
      { message: "Logged out successfully." },
      { headers: { "Cache-Control": "no-store" } },
    );

    response.cookies.delete("portfolio_admin");

    return response;
  } catch {
    return NextResponse.json(
      { message: "Authentication server unavailable." },
      { status: 502 },
    );
  }
}