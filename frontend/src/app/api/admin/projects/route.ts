import { proxyAdminGet, proxyAdminPut } from "@/lib/adminProxy";
import { UpdateProjectsSchema } from "@/schemas/catalogSchemas";

export function GET() {
  return proxyAdminGet("/api/admin/projects");
}

// Add, edit, reorder, feature and delete the project cards in one save.
export function PUT(request: Request) {
  return proxyAdminPut(request, "/api/admin/projects", UpdateProjectsSchema, [
    "/admin/projects",
    "/admin/content",
    "/admin/media",
    "/projects",
  ]);
}
