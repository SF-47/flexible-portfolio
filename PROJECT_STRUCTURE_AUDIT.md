# Project structure and security audit

## Authentication architecture

```
Browser ──► Next.js (BFF) ──► ASP.NET Core ──► MySQL
```

- **ASP.NET Core is the authority** for identity and authorization. It issues and validates
  the `portfolio_admin` cookie (ASP.NET Core cookie authentication, Data Protection, 8 hour
  lifetime, no sliding expiry; `HttpOnly`, `SameSite=Lax`, `Secure` always outside Development).
- **Next.js is the browser-facing BFF.** The browser only talks to Next.js; Next.js talks to
  the API. Admin accounts live in the `AdminUsers` table (hashed passwords, `IsActive`).
- There is no public registration. Administrators are created with
  `dotnet run -- --seed-admin` (Development only).

### Login and logout

1. `LoginForm` posts to `POST /api/auth/login` (Next.js Route Handler).
2. The handler rejects a foreign `Origin`, forwards the credentials to
   `POST /api/auth/login` on the API and relays **only** the `portfolio_admin` `Set-Cookie`.
3. The API answers one generic `401` for an unknown e-mail, a wrong password and a disabled
   account, and `429` once the built-in `Login` rate-limit policy (10 requests / 15 min per client IP) is exceeded.
4. Logout (`POST /api/auth/logout`) checks the origin, signs out on the API and clears the
   cookie. A session the API already rejects is still cleared locally.
5. `GET /api/auth/me` returns the profile of the current session (`401` otherwise).

## Centralized authorization (ASP.NET Core)

- `AdminOnly` policy: authenticated user with the `Admin` role.
- `AdminRouteAuthorizationConvention` (an MVC application-model convention) attaches the
  policy as endpoint metadata to every action routed under `api/admin`, for every HTTP
  method. A new admin controller is protected without remembering an attribute, and the app
  throws at startup if such an action carries `[AllowAnonymous]`.
- `AdminEndpointAudit.Verify` runs after `MapControllers` and refuses to start if any
  `/api/admin` endpoint lacks the policy.
- Result: no/invalid/expired cookie → `401`; authenticated without the role → `403`.
- `AdminSessionValidator` (cookie `OnValidatePrincipal`) re-checks `IsActive` in the database
  on every request, so a disabled or deleted administrator loses access immediately.
- Public endpoints and `POST /api/auth/login` stay anonymous. The development-only block on
  `/api/admin/*` was removed; the policy is the single mechanism.
- Writes to `/api/admin` and `/api/auth` with a foreign `Origin` are refused (`403`); the
  Next.js server sends none. The list is `Cors:AllowedOrigins`.

## Next.js: cookie forwarding and protection

| Piece | File |
|---|---|
| Authenticated Axios wrapper, session helpers | `frontend/src/lib/api/admin/client.ts` |
| Route Handler guard, origin check, responses | `frontend/src/lib/api/admin/http.ts` |
| Shared PUT/GET proxies | `frontend/src/lib/api/admin/proxy.ts` |

- `adminClient` reads `portfolio_admin` from the **current incoming request**
  (`cookies()`), forwards only that cookie to the API on that call, and sends
  `Cache-Control: no-store`. Nothing is stored globally, in `localStorage`, or exposed to
  client JavaScript (the cookie is `HttpOnly`). It reuses the existing `axiosClient` and
  `API_BASE_URL`.
- A missing cookie, or a `401`/`403` from the API, becomes `AdminAuthError`. Route Handlers
  answer `401`/`403` JSON; server components redirect to `/admin/login`.
- **Route Handlers** (`app/api/admin/**`): every handler starts with `guardAdminRoute`
  (same-origin check on POST/PUT/PATCH/DELETE, then session-cookie check) and forwards with
  `adminClient`. Validation, status codes, revalidation and multipart upload are unchanged.
  Responses carry `Cache-Control: no-store`.
- **Server Actions** (`appearance/actions.ts`, `sections/actions.ts`): each asks the API
  who is calling (`getAdminSession`) before doing anything and fails closed; the write is
  then authorized again by the API with the forwarded cookie. Next.js itself rejects a
  Server Action whose `Origin` differs from the host.
- **Pages**: `app/admin/(Dashboard)/layout.tsx` checks the session on the server
  (unauthenticated → `/admin/login`; API unreachable → an "unavailable" message, not a
  logout). Because layouts are not re-rendered on client navigation, every dashboard page and
  `/admin/preview` also call `requireAdminSession()`, and every admin read redirects to the
  login when the API refuses the session. `/admin/login` redirects signed-in users to `/admin`.
- `next.config.ts` adds `Cache-Control: no-store`, `nosniff` and `X-Frame-Options:
  SAMEORIGIN` (the live preview is a same-origin iframe) to `/admin`, `/api/admin` and
  `/api/auth`.

## CSRF

Layered, not relying on `SameSite=Lax` alone: (1) Origin/Host and `Sec-Fetch-Site` check in
the Route Handlers, (2) Next.js's built-in Origin check for Server Actions, (3) the API's
Origin allow-list for admin and auth writes, (4) JSON bodies and a non-simple `Content-Type`.

## Remaining limitations and deployment requirements

- **HTTPS** is required outside Development: the cookie is `Secure` there.
- **Persistent Data Protection keys.** Without a shared key ring (`PersistKeysTo...`), cookies
  stop working after a restart or on a second instance.
- **Trusted proxy / forwarded headers.** The login route forwards the first `X-Forwarded-For`
  address it received to the API, which honours it only from a trusted proxy (loopback by
  default, see `UseForwardedHeaders` in `Program.cs`). Configure the real proxies before
  deploying, and make the reverse proxy in front of Next.js overwrite `X-Forwarded-For`,
  otherwise a client can choose its own rate-limit bucket.
- The login limiter is a temporary built-in fixed window (in memory, per process).
- A stolen cookie works until it expires (8 hours) or the account is disabled; there is no
  session list or "log out everywhere".
- A single `Admin` role and no password reset or change flow yet.
- `Cors:AllowedOrigins` must list the production site origin.
