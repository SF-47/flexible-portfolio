import { proxyAdminPut } from "@/lib/adminProxy";
import { UpdateSocialLinksSchema } from "@/schemas/navigationSchemas";

export async function PUT(request: Request) {
  return proxyAdminPut(
    request,
    "/api/admin/social-links",
    UpdateSocialLinksSchema,
  );
}
