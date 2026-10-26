import { NextRequest, NextResponse } from "next/server";
import { axiosClient } from "@/lib/api/client";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("portfolio_admin");

  if (!session) {
    return NextResponse.json(
      { message: "Not authenticated." },
      { status: 401 },
    );
  }

  try {
    const backend = await axiosClient.get("/api/auth/me", {
      headers: {
        Cookie: `portfolio_admin=${session.value}`,
      },
      validateStatus: () => true,
    });

    if (backend.status !== 200) {
      return NextResponse.json(
        { message: "Session is invalid or expired." },
        { status: 401 },
      );
    }

    return NextResponse.json(backend.data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Authentication server unavailable." },
      { status: 502 },
    );
  }
}
