import { proxyAdminGet, proxyAdminPut } from "@/lib/adminProxy";
import { UpdateServicesSchema } from "@/schemas/catalogSchemas";

export function GET() {
  return proxyAdminGet("/api/admin/services");
}

// Add, edit, reorder, hide and delete the service cards in one save.
export function PUT(request: Request) {
  return proxyAdminPut(request, "/api/admin/services", UpdateServicesSchema, [
    "/admin/services",
    "/admin/content",
    "/admin/media",
  ]);
}
