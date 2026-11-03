# Flexible Portfolio

A flexible company website with an admin dashboard. Administrators choose and reorder 15
section types, edit their content with live previews, pick or customise a theme, manage
navigation, social links, services, projects, media and contact messages. The public site
shows the result.

```
Browser ──► Next.js (website + admin BFF) ──► ASP.NET Core API ──► MySQL
```

| Folder | Contents |
| --- | --- |
| `backend/` | ASP.NET Core 10 API: Controller → Service → EF Core → MySQL |
| `frontend/` | Next.js 16 (React 19, Tailwind 4, Zod, Axios) |
| [`API.md`](API.md) | Every endpoint: method, auth, request/response shape, status codes |
| [`PROJECT_STRUCTURE_AUDIT.md`](PROJECT_STRUCTURE_AUDIT.md) | Authentication, authorization, CSRF and deployment notes |

## Requirements

.NET 10 SDK, Node.js 20+, MySQL 8, and the `dotnet-ef` tool (`dotnet tool install -g dotnet-ef`).

## Backend setup

1. Create an empty MySQL database and a user with full rights on it.
2. Give the API its connection string (do not commit it):
   ```bash
   cd backend
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=127.0.0.1;Port=3306;Database=<db>;User=<user>;Password=<password>;"
   ```
   In production use the environment variable `ConnectionStrings__DefaultConnection`.
3. Create the tables: `dotnet ef database update`
4. Load the starter data, in this order (each command seeds once and exits; media must come
   before services/projects, and sections before navigation and section content):
   ```bash
   for s in media sections site-settings themes company-services projects navigation social-links section-content; do
     dotnet run -- --seed-$s
   done
   ```
5. Create the first administrator (**Development only**; the password needs 12+ characters):
   ```bash
   ADMIN_FULL_NAME="Your Name" ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="<password>" \
     dotnet run -- --seed-admin
   ```
6. Start the API: `dotnet run --launch-profile http` (http://localhost:5271).

Optional settings: `Cors:AllowedOrigins` (array; the website origin, default
`http://localhost:3000`) and `ForwardedHeaders:KnownProxies` (array of proxy IP addresses, see
the notes below).

## Frontend setup

Create `frontend/.env.local` (not committed):

```
API_BASE_URL=http://localhost:5271
NEXT_PUBLIC_API_BASE_URL=http://localhost:5271
# TRUST_PROXY_HEADERS=true   # only behind a reverse proxy that adds the visitor's address
```

`API_BASE_URL` is used by the Next.js server; `NEXT_PUBLIC_API_BASE_URL` is used by the
browser for the public contact form. Then:

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000, admin at /admin
```

## API documentation

See [`API.md`](API.md) for the full endpoint reference (public content API, auth, admin
CRUD, the 15 section content shapes, error format and rate limits). A generated OpenAPI
document is also served at `/openapi/v1.json` while the API runs in Development.

## Checks

```bash
cd backend && dotnet build
cd frontend && npx tsc --noEmit && npx eslint . && npm run build
```

There is currently no automated test suite — `dotnet build`, `tsc` and `eslint` are the only
checks. Testing is manual: run both apps and exercise the admin dashboard and public site.

## Notes for the deployment team

- **`npm run build` needs the API running** (and `API_BASE_URL` set): the home page is
  prerendered at build time. After an admin saves, the page is regenerated automatically;
  admin pages and admin API responses are never cached.
- **HTTPS is required** outside Development; the admin cookie is `Secure` there.
- **ASP.NET Data Protection keys are not persisted.** Configure a shared, persistent key
  location (`PersistKeysTo...`), or every restart (or a second instance) logs the admins out.
- **Rate limits** (built-in, in memory): login 10 / 15 min per IP, contact form 5 / 15 min per
  IP. The visitor's IP is only believed from trusted proxies:
  - API: loopback plus the addresses in `ForwardedHeaders:KnownProxies`. If a reverse proxy
    sits in front of the API, add it there, otherwise every visitor shares one limit.
  - Next.js: set `TRUST_PROXY_HEADERS=true` only if a reverse proxy in front of Next.js adds
    the visitor's address to `X-Forwarded-For` (the last entry is used). Without it, all admin
    logins share one limit, which is safe but coarse.
- Set `Cors:AllowedOrigins` to the production website origin; it also limits cross-site admin
  writes.
- Uploaded images are stored in `backend/wwwroot/uploads` and must be kept (volume/backup).
  The images committed there are seed/demo images.
- Admin accounts can only be created with `--seed-admin`, which is disabled outside
  Development. There is no password reset or change flow.
- More detail on authentication, CSRF and authorization: `PROJECT_STRUCTURE_AUDIT.md`.
