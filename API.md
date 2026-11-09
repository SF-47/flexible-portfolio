# API reference

Base URL: `http://localhost:5271` in development (`API_BASE_URL` in production). All
responses are JSON. All request bodies are JSON except the media upload, which is
`multipart/form-data`.

This is a hand-written reference of the stable contract. The backend also serves a
generated OpenAPI document at `/openapi/v1.json` in Development
(`builder.Services.AddOpenApi()` in [backend/Program.cs](backend/Program.cs)) if you want a
machine-readable schema or want to import it into Postman/Insomnia.

## Conventions

- **Auth** column: `Public` (no credentials needed), `Admin` (needs the `portfolio_admin`
  session cookie and the `Admin` role), or `Admin, rate-limited` / `Public, rate-limited`.
- **Errors**: a failed request returns `{ "message": "..." }` (400/404/409 from a service
  result) or an RFC 7807 Problem Details body with a `message` field (unhandled exceptions,
  oversized bodies). Validation attribute failures (`[Required]`, etc.) return the default
  ASP.NET Core 400 validation-error shape.
- **Optimistic concurrency**: endpoints that save content the admin may have loaded a while
  ago take an `UpdatedAt` (or `LoadedIds`) value and return `409 Conflict` if the stored data
  has changed since, instead of silently overwriting someone else's edit.
- **Admin routes** (`/api/admin/**`, `/api/auth/**` except login): every non-GET request is
  rejected with `403` if its `Origin` header isn't in `Cors:AllowedOrigins` — only the Next.js
  server, which sends no `Origin`, or a listed browser origin, may write. See
  [Authentication and Authorization](README.md#authentication-and-authorization) in the README.
- All `/api/admin/**` endpoints require the `Admin` role regardless of what's documented per
  route — this is enforced by a route convention and verified at startup
  (`AdminEndpointAudit.Verify`), so it can't be forgotten on a new controller.

---

## Public content API

Read-only, no cookie required. This is what the public website renders.

| Method & path | Returns | Notes |
| --- | --- | --- |
| `GET /api/sections` | `SectionResponse[]` | Only sections with `isVisible: true`, in display order. |
| `GET /api/company-services` | `CompanyServiceResponse[]` | Only `isActive: true`, in `sortOrder`. |
| `GET /api/projects` | `ProjectResponse[]` | All projects, in `sortOrder`. |
| `GET /api/projects/{id}` | `ProjectDetailResponse` | `404` if `id` doesn't exist. |
| `GET /api/projects/slug/{slug}` | `ProjectDetailResponse` | Used by `/projects/[slug]`; `404` if not found. |
| `GET /api/site-settings` | `SiteSettingsResponse` | `404` if settings were never seeded. |
| `GET /api/social-links` | `SocialLinkResponse[]` | Only `isVisible: true`, in `sortOrder`. |
| `GET /api/themes` | `ThemeResponse[]` | All themes (built-in + custom). |
| `GET /api/themes/active` | `ThemeResponse` | `404` if no theme is active. |
| `GET /api/navigation` | `NavigationResponse[]` | Only `isVisible` items, in `sortOrder`. |
| `GET /api/media` | `MediaAssetResponse[]` | All uploaded media (metadata only; files are served as static files under `/uploads`). |
| `GET /api/media/{id}` | `MediaAssetResponse` | `404` if not found. |
| `POST /api/contact-messages` | `ContactMessageResponse` (201) | `Public, rate-limited` — 5 requests / 15 min per IP (`ContactSubmission` policy). Body: `CreateContactMessageRequest`. |

### `SectionResponse`

```ts
{
  id: string;          // GUID
  type: string;         // one of the 15 section types below
  name: string;
  variant: string;
  order: number;
  isVisible: boolean;
  navLabel: string | null;
  contentJson: string;  // JSON-encoded content, shape depends on `type` — see below
  settingsJson: string;
  updatedAt: string;    // ISO 8601
}
```

### `CreateContactMessageRequest` → `ContactMessageResponse`

| Field | Type | Validation |
| --- | --- | --- |
| `name` | string | required, ≤ 100 chars |
| `email` | string | required, valid e-mail, ≤ 254 chars |
| `message` | string | required, ≤ 3000 chars |

Response: `{ "message": "..." }` (a human-readable confirmation, not an echo of the input).

---

## Auth API

| Method & path | Auth | Body → Response |
| --- | --- | --- |
| `POST /api/auth/login` | `Public, rate-limited` (10 / 15 min per IP) | `LoginRequest` → `AdminProfileResponse` (200) or `401` (bad credentials — same answer for an unknown e-mail, wrong password, or disabled account) |
| `GET /api/auth/me` | Admin | → `AdminProfileResponse` (200) or `401` |
| `POST /api/auth/logout` | Admin | → `204 No Content` |

A successful login sets the `portfolio_admin` cookie (`HttpOnly`, `SameSite=Lax`, `Secure`
outside Development, 8-hour fixed lifetime, no sliding expiration). There is no
refresh/registration/password-reset endpoint — admins are created with `dotnet run --
--seed-admin` (Development only; see the root [README](README.md)).

| Type | Fields |
| --- | --- |
| `LoginRequest` | `email` (string, required, e-mail format), `password` (string, required) |
| `AdminProfileResponse` | `id` (GUID), `fullName` (string), `email` (string) |

---

## Admin API

Every route below is under `/api/admin` (or `/api/auth`) and requires the `portfolio_admin`
cookie with the `Admin` role (`401` without a cookie, `403` with one that isn't an admin's).
Writes additionally require a same-origin `Origin` header, which the Next.js BFF supplies
automatically — see [Authentication and Authorization](README.md#authentication-and-authorization).

### Dashboard

| Method & path | Returns |
| --- | --- |
| `GET /api/admin/dashboard/stats` | `DashboardStatsResponse` — `totalSections`, `visibleSections`, `hiddenSections`, `totalProjects`, `totalServices`, `totalMessages`, `readMessages`, `unreadMessages` |

### Sections

| Method & path | Body | Response |
| --- | --- | --- |
| `GET /api/admin/sections` | — | `SectionResponse[]` (all sections, visible or not) |
| `PUT /api/admin/sections/reorder` | `ReorderSectionsRequest` — `{ sectionIds: string[] }`, every section id exactly once | `200` or `400` if a section is missing/duplicated |
| `PUT /api/admin/sections/layout` | `UpdateSectionsLayoutRequest` — `{ sections: { id, isVisible }[] }`, every section exactly once | `200` or `400` |
| `PUT /api/admin/sections/{id}/content` | `UpdateSectionContentRequest` — `{ contentJson: string, expectedUpdatedAt: string }` | `UpdateSectionContentResponse` (`{ contentJson, updatedAt }`), `400` if `contentJson` fails the type's schema (see below), `404` if the section doesn't exist, `409` if `expectedUpdatedAt` doesn't match the stored value (someone else saved first) |

`contentJson` is validated server-side against the section's `type` (mirrors
`frontend/src/schemas/sectionSchemas.ts`); see **Section content types** below for the shape
each type expects. Any media id referenced inside it must already exist, or the save is
rejected.

### Company services

| Method & path | Body | Response |
| --- | --- | --- |
| `GET /api/admin/services` | — | `AdminServiceResponse[]` |
| `PUT /api/admin/services` | `UpdateServicesRequest` — `{ items: ServiceItemRequest[], deletedIds?: number[] }` | `AdminServiceResponse[]`, `409` if an item's `updatedAt` is stale |

`ServiceItemRequest`: `id` (number, `null` for a new service), `updatedAt` (the value the
admin loaded, `null` for new), `title`, `description`, `iconName?`, `imageMediaId?`,
`isActive`. The position in `items` becomes `sortOrder`. Services not in `items` are kept
unless their id is listed in `deletedIds`.

### Projects

| Method & path | Body | Response |
| --- | --- | --- |
| `GET /api/admin/projects` | — | `AdminProjectResponse[]` |
| `PUT /api/admin/projects` | `UpdateProjectsRequest` — `{ items: ProjectItemRequest[], deletedIds?: number[] }` | `AdminProjectResponse[]`, `409` on a stale item |

`ProjectItemRequest` adds `slug`, `fullDescription?`, `category?`, `location?`,
`completionDate?` (date-only), `featuredImageId?` on top of the service shape.

### Navigation

| Method & path | Body | Response |
| --- | --- | --- |
| `GET /api/admin/navigation` | — | `AdminNavigationItemResponse[]` |
| `PUT /api/admin/navigation` | `UpdateNavigationRequest` — `{ items: NavigationItemRequest[] }` | `AdminNavigationItemResponse[]` |

A navigation item's label and destination are always derived from its linked section — the
admin only controls `isVisible` and order (`NavigationItemRequest`: `id?`, `sectionId?`,
`isVisible`). An item without `id` adds the given section to the menu.

### Social links

| Method & path | Body | Response |
| --- | --- | --- |
| `GET /api/admin/social-links` | — | `AdminSocialLinkResponse[]` |
| `PUT /api/admin/social-links` | `UpdateSocialLinksRequest` — `{ items: SocialLinkRequest[], loadedIds: number[] }` | `AdminSocialLinkResponse[]`, `409` if the stored list's ids don't match `loadedIds` (someone else changed it first) |

`SocialLinkRequest`: `id?`, `platform`, `url`, `isVisible`. Links missing from `items` are
deleted — this endpoint replaces the whole list, which is why `loadedIds` guards against a
lost update.

### Site settings (brand)

| Method & path | Body | Response |
| --- | --- | --- |
| `PUT /api/admin/site-settings` | `UpdateBrandRequest` — `{ companyName, logoMediaId?, footerDescription? }` | `SiteSettingsResponse` |

Only these three fields can be changed through the API; everything else in
`SiteSettingsResponse` (SEO title/description, contact info, favicon) is seed-only in the
current build.

### Media

| Method & path | Body | Response |
| --- | --- | --- |
| `POST /api/admin/media` | `multipart/form-data`: `file` (required, ≤ 6 MB), `altText?` | `AdminMediaAssetResponse` (includes `usedIn: string[]`) |
| `GET /api/admin/media` | — | `AdminMediaAssetResponse[]` |
| `PUT /api/admin/media/{id}` | `UpdateMediaRequest` — `{ altText?: string }` | `AdminMediaAssetResponse` |
| `DELETE /api/admin/media/{id}` | — | `204`, or `409` with `{ message, usedIn: string[] }` if the image is still referenced by a section/project/service/theme |

### Themes

| Method & path | Body | Response |
| --- | --- | --- |
| `PUT /api/admin/themes/{id}` | `UpdateThemeRequest` — 6 `#RRGGBB` color fields, `headingFont`, `bodyFont`, `navbarVariant` | `ThemeResponse`, `400` if a color fails the hex pattern |
| `PUT /api/admin/themes/{id}/activate` | — | `ThemeResponse`, `404` if the theme doesn't exist |

`GET /api/themes` and `GET /api/themes/active` (public, listed above) are how the admin UI
reads themes — there's no separate admin-only list endpoint.

### Contact messages

| Method & path | Body | Response |
| --- | --- | --- |
| `GET /api/admin/messages` | — | `AdminContactMessageResponse[]` (newest first) |
| `PUT /api/admin/messages/{id}/read` | `{ isRead: boolean }` | `AdminContactMessageResponse`, `404` if not found |
| `DELETE /api/admin/messages/{id}` | — | `204`, `404` if not found |

---

## Section content types

`contentJson` on a `SectionResponse` is a type-specific JSON object. The 15 types and their
fields (as enforced by
[`SectionContentValidator`](backend/Services/Sections/SectionContentValidator.cs), mirrored in
`frontend/src/schemas/sectionSchemas.ts`):

| Type | Fields |
| --- | --- |
| `hero` | `tagline`, `title`, `description`, `buttonText`, `buttonLink`, `imageMediaId?` |
| `about` | `label`, `title`, `description`, `secondDescription`, `linkText`, `linkUrl`, `imageMediaId`, `imageAlt` |
| `stats` | `items[]` (≤ 6): `value`, `label` |
| `services` | `label`, `title`, `description` (cards come from `/api/company-services`) |
| `projects` | `label`, `title` (cards come from `/api/projects`) |
| `whyChooseUs` | `label`, `title`, `description`, `items[]` (≤ 6): `icon`, `title`, `description` |
| `process` | `label`, `title`, `description`, `steps[]` (≤ 6): `number`, `icon`, `title`, `description` |
| `gallery` | `label`, `title`, `description`, `icon`, `items[]` (≤ 12): `title`, `category`, `imageMediaId`, `featured` |
| `team` | `label`, `title`, `description`, `members[]` (≤ 6): `name`, `position`, `description`, `imageMediaId` |
| `clients` | `label`, `title`, `description`, `items[]` (≤ 6): `name`, `icon` |
| `testimonials` | `label`, `title`, `description`, `items[]` (≤ 6): `name`, `role`, `initials`, `rating` (1–5), `message` |
| `certifications` | `label`, `title`, `description`, `items[]` (≤ 6): `icon`, `title`, `subtitle`, `description` |
| `faq` | `label`, `title`, `description`, `helpIcon`, `helpTitle`, `helpLinkText`, `helpLinkUrl`, `items[]` (≤ 5): `question`, `answer` |
| `cta` | `label`, `title`, `description`, `primaryButtonText`, `primaryButtonLink`, `secondaryButtonText`, `secondaryButtonLink` |
| `contact` | `label`, `title`, `description`, `addressTitle`, `phoneTitle`, `emailTitle`, `nameLabel`, `namePlaceholder`, `emailLabel`, `emailPlaceholder`, `messageLabel`, `messagePlaceholder`, `buttonText` |

Field kinds: text (≤ 5000 chars), link (`""`, `#...`, `/...`, `https://...`, `mailto:...` or
`tel:...`, ≤ 2000 chars — never `javascript:`), icon (a Lucide icon name, e.g.
`ShieldCheck`), media (an existing media asset id), rating (integer 1–5), boolean. Unknown
extra keys in `contentJson` are allowed and preserved; missing or mistyped required keys are
rejected with `400`.

---

## Rate limits

| Policy | Limit | Applies to |
| --- | --- | --- |
| `Login` | 10 requests / 15 min per client IP | `POST /api/auth/login` |
| `ContactSubmission` | 5 requests / 15 min per client IP | `POST /api/contact-messages` |

Both return `429 Too Many Requests` once exceeded. The client IP is only trusted from the
addresses in `ForwardedHeaders:KnownProxies` (loopback by default) — see the root
[README](README.md#notes-for-the-deployment-team).
