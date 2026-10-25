import { proxyAdminPut } from "@/lib/adminProxy";
import { UpdateBrandSchema } from "@/schemas/navigationSchemas";

export async function PUT(request: Request) {
  return proxyAdminPut(request, "/api/admin/site-settings", UpdateBrandSchema);
}
