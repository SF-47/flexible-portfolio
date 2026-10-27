import "server-only";

import { isAxiosError, type AxiosRequestConfig } from "axios";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { axiosClient } from "@/lib/api/client";

export const ADMIN_COOKIE = "portfolio_admin";
export const LOGIN_PATH = "/admin/login";

// The backend refused the session: 401 = no or expired session, 403 = not an administrator.
export class AdminAuthError extends Error {
  constructor(readonly status: 401 | 403) {
    super(status === 401 ? "Not authenticated." : "Not an administrator.");
  }
}

// The current request's session cookie, read per call and never stored: a shared Axios
// default would leak one administrator's session into another's request.
async function sessionCookie(): Promise<string | null> {
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;

  // The value goes into a header, so anything that could split it is rejected.
  if (!value || /[\s;,]/.test(value)) return null;

  return `${ADMIN_COOKIE}=${value}`;
}

export async function hasAdminCookie() {
  return (await sessionCookie()) !== null;
}

function authStatus(status: number | undefined) {
  return status === 401 || status === 403 ? status : null;
}

// Axios for /api/admin/*: it forwards only the administrator cookie of the incoming
// request and turns a 401/403 (or a missing cookie) into AdminAuthError, whatever the
// caller's validateStatus. Other statuses are left to the caller as usual.
async function send<T>(config: AxiosRequestConfig) {
  const cookie = await sessionCookie();
  if (!cookie) throw new AdminAuthError(401);

  try {
    const response = await axiosClient.request<T>({
      ...config,
      headers: {
        ...config.headers,
        Cookie: cookie,
        "Cache-Control": "no-store",
      },
    });

    const denied = authStatus(response.status);
    if (denied) throw new AdminAuthError(denied);

    return response;
  } catch (error) {
    const denied = isAxiosError(error)
      ? authStatus(error.response?.status)
      : null;
    if (denied) throw new AdminAuthError(denied);

    throw error;
  }
}

// Like Axios, an untyped call returns untyped data (callers read `message` and the like).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResponseData = any;

export const adminClient = {
  get: <T = ResponseData>(url: string, config?: AxiosRequestConfig) =>
    send<T>({ ...config, method: "GET", url }),
  post: <T = ResponseData>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => send<T>({ ...config, method: "POST", url, data }),
  put: <T = ResponseData>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => send<T>({ ...config, method: "PUT", url, data }),
  delete: <T = ResponseData>(url: string, config?: AxiosRequestConfig) =>
    send<T>({ ...config, method: "DELETE", url }),
};

// For server components: an admin read whose session is gone sends the visitor to the login.
export async function adminRead<T>(read: () => Promise<T>): Promise<T> {
  try {
    return await read();
  } catch (error) {
    if (error instanceof AdminAuthError) redirect(LOGIN_PATH);

    throw error;
  }
}

export type AdminProfile = { id: string; fullName: string; email: string };

export type AdminSession =
  | { status: "authenticated"; admin: AdminProfile }
  | { status: "unauthenticated" }
  // The API could not be asked: not a reason to log the administrator out.
  | { status: "unavailable" };

// Asks ASP.NET Core, the authority, who the current cookie belongs to. Once per request.
export const getAdminSession = cache(async (): Promise<AdminSession> => {
  const cookie = await sessionCookie();
  if (!cookie) return { status: "unauthenticated" };

  try {
    const response = await axiosClient.get<AdminProfile>("/api/auth/me", {
      headers: { Cookie: cookie, "Cache-Control": "no-store" },
      validateStatus: () => true,
    });

    if (response.status === 200) {
      return { status: "authenticated", admin: response.data };
    }

    if (response.status === 401 || response.status === 403) {
      return { status: "unauthenticated" };
    }

    return { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
});

// The guard of every admin page: signed in, or on to the login. An unreachable API is an
// error, not a logout.
export async function requireAdminSession(): Promise<AdminProfile> {
  const session = await getAdminSession();

  if (session.status === "unauthenticated") redirect(LOGIN_PATH);
  if (session.status === "unavailable") {
    throw new Error("The API server is unavailable. Is the backend running?");
  }

  return session.admin;
}
