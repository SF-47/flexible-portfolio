import { proxyAdminPut } from "@/lib/adminProxy";
import { UpdateNavigationSchema } from "@/schemas/navigationSchemas";

export async function PUT(request: Request) {
  return proxyAdminPut(
    request,
    "/api/admin/navigation",
    UpdateNavigationSchema,
  );
}
