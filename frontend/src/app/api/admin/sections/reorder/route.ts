import { NextResponse } from "next/server";
import { reorderSections } from "@/lib/sections";

export async function PUT(request: Request) {
  // Temporary protection until we implement admin authentication.
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ message: "Not available." }, { status: 404 });
  }

  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("sectionIds" in body) ||
      !Array.isArray(body.sectionIds) ||
      !body.sectionIds.every((id) => typeof id === "string")
    ) {
      return NextResponse.json(
        { message: "Invalid section IDs." },
        { status: 400 },
      );
    }

    await reorderSections(body.sectionIds);

    return NextResponse.json({
      message: "Sections reordered successfully.",
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to reorder sections." },
      { status: 500 },
    );
  }
}
