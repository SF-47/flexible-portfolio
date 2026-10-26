import { proxyAdminPut } from "@/lib/api/admin/proxy";
import { UpdateSocialLinksSchema } from "@/schemas/navigationSchemas";

export async function PUT(request: Request) {
  return proxyAdminPut(
    request,
    "/api/admin/social-links",
    UpdateSocialLinksSchema,
  );
}
