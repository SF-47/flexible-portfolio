import { redirect } from "next/navigation";

import LoginForm from "@/components/auth/LoginForm";
import SiteTheme from "@/components/SiteTheme";
import { getAdminSession } from "@/lib/api/admin/client";
import { getActiveTheme } from "@/lib/api/themes";
import type { Theme } from "@/types/theme";

export default async function LoginPage() {
  // Someone who is already signed in goes straight to the dashboard.
  const session = await getAdminSession();

  if (session.status === "authenticated") redirect("/admin");

  let theme: Theme | null = null;

  try {
    theme = await getActiveTheme();
  } catch {
    // Without the API the login falls back to its neutral default palette.
  }

  const form = <LoginForm />;

  return theme ? <SiteTheme theme={theme}>{form}</SiteTheme> : form;
}
