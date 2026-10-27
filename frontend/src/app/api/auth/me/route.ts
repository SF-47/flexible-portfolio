import { adminFail, adminJson } from "@/lib/api/admin/http";
import { getAdminSession } from "@/lib/api/admin/client";

// Who the current session cookie belongs to, as answered by ASP.NET Core.
export async function GET() {
  const session = await getAdminSession();

  if (session.status === "authenticated") return adminJson(session.admin);

  if (session.status === "unavailable") {
    return adminFail(502, "Authentication server unavailable.");
  }

  return adminFail(401, "Not authenticated.");
}
