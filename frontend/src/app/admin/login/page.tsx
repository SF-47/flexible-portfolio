import { redirect } from "next/navigation";

import LoginForm from "@/components/auth/LoginForm";
import { getAdminSession } from "@/lib/api/admin/client";

export default async function LoginPage() {
  // Someone who is already signed in goes straight to the dashboard.
  const session = await getAdminSession();

  if (session.status === "authenticated") redirect("/admin");

  return <LoginForm />;
}
