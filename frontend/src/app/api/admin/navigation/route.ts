import { proxyAdminPut } from "@/lib/api/admin/proxy";
import { UpdateNavigationSchema } from "@/schemas/navigationSchemas";

export async function PUT(request: Request) {
  return proxyAdminPut(
    request,
    "/api/admin/navigation",
    UpdateNavigationSchema,
  );
}
