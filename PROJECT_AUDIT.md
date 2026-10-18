# PROJECT_AUDIT — Flexible Portfolio (config-driven company website + admin)

> Audit date: 2026-10-16. Based only on `~/Desktop/Projects/flexible-portfolio` (git repo, 31 commits, single author, 2026-10-10 → 2026-10-15). No source code was modified. No secrets are reproduced.
> **IMPORTANT: this project is clearly UNFINISHED / in active development.** The backend content API is largely built, but the admin panel is a static mock-up, there is no authentication, and the public site does not yet render its content from the API.
> **[Evidence]** = verified in code. **[Conclusion]** = my interpretation.

---

## 1. Project Overview

**Intended purpose [Evidence: seeders, admin UI text]** — A reusable, "flexible" company portfolio website whose sections, navigation, theme and content are meant to be configured from an admin dashboard instead of hard-coded. The seed data/demo brand is a fictional construction company ("ATLAS Construction").

**Problem it aims to solve [Conclusion]** — Let a non-developer owner reorder/hide sections, change theme colours/fonts, edit content, upload images and read contact messages without code changes; reuse the same engine for many clients.

**Intended users** — Site visitors (public site) and a site administrator (admin panel).

**Status**
| Part | State |
|---|---|
| Public API (13 endpoints) | Implemented |
| DB schema (10 entities, 2 migrations) + 8 seeders | Implemented |
| Public site rendering of sections | **Partial** — API supplies section type/order/visibility; section content/theme still come from static files |
| Admin panel (8 pages) | **UI mock-up only** — hard-coded arrays, `readOnly` inputs, no API calls |
| Admin authentication / write APIs | **Not implemented** |
| Tests, CI/CD, deployment | None |

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core Web API **.NET 10** (`Portfolio.Api.csproj`), controllers + services |
| ORM/DB | EF Core 10.0.9 + `MySql.EntityFrameworkCore` 10.0.9 (Oracle provider), MySQL with `json` columns, code-first migrations |
| Auth | **None** (an `AdminUser` entity with `PasswordHash` exists but is unused) |
| Frontend | **Next.js 16.4.0** (App Router, server components), React 19.3.0, TypeScript 5, Tailwind CSS 4, Axios, lucide-react, react-icons, `server-only`, React Compiler |
| Third-party | None |
| Tooling | `dotnet-ef`, user-secrets, ESLint 9; a local `.local/mysql.env` (untracked) for a MySQL container; **no Dockerfile/compose in repo** |

---

## 3. Architecture

**Overall [Evidence]** — Next.js server component `app/page.tsx` fetches `GET /api/sections` through a `server-only` Axios client (`lib/axios.ts`, `API_BASE_URL`), then `SectionRenderer` maps each section `type` to a React component via `sectionRegistry` (a `Record<SectionType, ComponentType>` of 15 components). The API is a read-mostly content service over MySQL.

**Key design idea — data-driven sections [Evidence: `Models/Section.cs`]** — a single `Section` table with `Type`, `Variant`, `SortOrder`, `IsVisible`, `NavLabel`, `ContentJson` and `SettingsJson` (MySQL `json` columns) and `SchemaVersion`. New content shapes need no schema migration. 15 section types are seeded (`SectionSeeder`, `SectionContentSeeder`).

**Backend layout** — `Controllers/` (9), `Services/<Feature>/I…Service + …Service` (9 pairs), `DTOs/` (records), `Models/` (10), `Data/AppDbContext.cs` (fluent config), `Data/Seeders/` (8 seeders run via CLI flags such as `dotnet run -- --seed-sections` handled in `Program.cs`).

**Database (10 entities)** — `SiteSettings` (logo/favicon → `MediaAsset`), `Theme` (6 colours as `char(7)`, fonts, `NavbarVariant`, `IsActive`), `Section`, `NavigationItem` (→ optional `Section`, `OnDelete SetNull`), `Project` (unique `Slug`, `FeaturedImage` → `MediaAsset`, `Restrict`), `Service`, `MediaAsset` (unique `StorageKey`), `AdminUser` (unique email), `ContactMessage`, `SocialLink`. Max lengths, required flags and indexes configured explicitly; delete behaviours chosen deliberately (Restrict/SetNull). Second migration `RemoveProjectImages` shows schema evolution (simplified to a single featured image).

**Patterns** — service layer + DI; DTO projection with `AsNoTracking()`; compiled-style projection `Expression<Func<…>>` reuse in `MediaService`; component registry (strategy/lookup) pattern in frontend; seeders for reproducible data.

---

## 4. Implemented Features

### Completed
**Backend (13 endpoints, all under `/api/*`)**
- `GET sections` (visible, ordered), `GET navigation`, `GET site-settings`, `GET company-services`, `GET projects`, `GET projects/{id}`, `GET media`, `GET media/{id}`, `GET themes`, `GET themes/active`, `GET social-links`.
- `POST contact-messages` — validated (`[Required]`, `[EmailAddress]`, length limits), **rate-limited 5 requests / 15 min / IP** (`ContactSubmission` policy).
- `POST media` — image upload: 5 MB cap, extension allow-list (jpg/jpeg/png/webp), **magic-byte signature check matching the extension**, GUID filenames, `FileMode.CreateNew`, cleanup of the file if the DB save fails (`MediaService.UploadAsync`).
- Dev-only `/dev/db-check`, OpenAPI in Development.

**Frontend**
- Public page: Navbar, 15 section components (Hero, About, Stats, Services, Projects, Contact, WhyChooseUs, Testimonials, Clients, Team, FAQ, Process, Gallery, CTA, Certifications), Footer, dark/light toggle, CSS-variable theming (`SiteTheme`).
- Section order/visibility driven by the API (`SectionRenderer`).

### Partially implemented
- **Theming**: themes API + 5-ish presets seeded, but `SiteTheme.tsx` reads colours from static `data/siteConfig.ts`, not from `/api/themes/active`.
- **Section content**: `contentJson` is seeded and delivered, but components (e.g. `Hero.tsx`) read from `siteConfig` and are rendered **without props** (`<Component key=… />`), so DB content is not yet displayed.
- **Contact form**: `Contact.tsx` validates and shows a success state but **does not call** `POST /api/contact-messages` (`handleSubmit` only sets local state).
- **Legacy local state**: `useSections` / `lib/sectionStore.ts` persist a section list in `localStorage` — an earlier prototype approach superseded by the API.

### Mock-up only (no functionality)
Admin pages `/admin` (dashboard), `/admin/sections`, `/admin/content`, `/admin/navigation`, `/admin/media`, `/admin/messages`, `/admin/appearance`, `/admin/editor`: hard-coded arrays, `readOnly` inputs, non-wired "Publish" buttons; `content` and `editor` show a section preview with the real components. Admin dark-mode is functional.

### Not implemented / planned
Admin login & authorization, create/update/delete endpoints for sections, navigation, projects, services, themes, settings, social links; reading/marking contact messages; media delete; project detail pages; SEO fields use (`SeoTitle/SeoDescription` stored only); image rendering from `MediaAsset`.

---

## 5. Technical Complexity

- **Schema-flexible content model** (JSON columns + `Type/Variant/SchemaVersion`) — the central, most interesting design decision.
- **Registry-driven rendering** pipeline from DB → API → server component → component map.
- **Secure image upload** with content sniffing and rollback (`MediaService`).
- **Rate-limited public form endpoint.**
- **Seeding via CLI flags** (functional but repetitive: 8 near-identical `if (args.Contains(...))` blocks in `Program.cs`).
- **Performance**: `AsNoTracking`, projections, indexes on `SortOrder/Type/Slug`; no caching or pagination (lists are small by nature).

---

## 6. Code Quality and Security

**Strengths** — Consistent layering and naming; explicit EF configuration with constraints; nullable reference types; good upload validation; thoughtful FK delete behaviours; clean, conventional commit messages (`feat:`, `refactor:`); `server-only` keeps API base URL off the client; no tracked secrets (appsettings contain no connection string; `.local/mysql.env` is untracked).

**Weaknesses / risks (in priority order)**
1. **No authentication/authorization at all.** `Program.cs` calls `UseAuthorization()` but no authentication scheme is configured and no endpoint has `[Authorize]`. Consequently **`POST /api/media` (file upload) is open to anyone**. This must be fixed before any exposure beyond localhost.
2. **No global exception handling**: `MediaService` throws `ArgumentException` for bad input, but `MediaController.Upload` does not catch it → results in HTTP 500 instead of 400.
3. **No tests**, no CI/CD, no Dockerfile.
4. Contact form is not connected to its API; admin UI is static — risk of the project looking complete when it is not.
5. CORS limited to `http://localhost:3000`; upload dir `backend/wwwroot/uploads` is tracked in git (1 sample image) and local-disk storage would not scale.
6. `contentJson`/`settingsJson` are delivered as raw strings; no server-side schema validation per section type.
7. `ContactMessage` has `Phone`/`Subject`/`IsRead` columns the DTO doesn't populate; no read endpoint.
8. Repetitive seeder dispatch in `Program.cs`; README in `frontend/` is the unmodified create-next-app template.

---

## 7. Development and Deployment

- **Setup**: no project README. Inferred: MySQL (a local `.local/mysql.env` hints at a container), user-secrets for the connection string, `dotnet ef database update`, run each seeder flag, `dotnet run`; frontend needs `API_BASE_URL` in `.env.local` + `npm run dev`.
- **Build**: standard `dotnet build/publish`, `next build`.
- **Deployment / CI/CD**: none present. **Production readiness: not ready** (no auth, tests, error handling, deployment config).

---

## 8. Quantifiable Achievements (verified)

| Metric | Value |
|---|---|
| API endpoints | **13** (11 GET, 2 POST) in 9 controllers |
| DB entities / migrations | **10 / 2** |
| Seeders | 8 |
| Section types (components) | **15** |
| Frontend pages | 1 public + 8 admin (admin static) |
| Reusable UI components | 15 sections + Navbar, Footer, SiteTheme, ThemeToggle, AdminSidebar, PreviewPanel, FullPreviewButton |
| Hand-written LOC | Backend (controllers/services/seeders) ≈ 1.8k; frontend TS/TSX ≈ 3.3k |
| Tests / coverage | 0 |
| Commits | 31 over 6 days |

---

## 9. Missing or Incomplete Features

Admin authentication; all write/admin APIs; wiring admin UI to API; rendering API content/theme/images on the public site; contact form submission; message inbox; media management; tests; README/deployment; error handling middleware; per-section content validation.

---

## 10. Junior Developer Skills Demonstrated

**Directly evidenced**
- Relational + JSON schema design in EF Core/MySQL with fluent configuration, indexes, FK delete behaviours, migrations.
- REST API design with service layer, DTOs, DI, `AsNoTracking`, projections.
- File-upload security (size, extension, magic bytes, safe naming, cleanup).
- Rate limiting; input validation with DataAnnotations.
- Next.js App Router server components, `server-only` data fetching, TypeScript union types, component registry pattern, Tailwind theming with CSS variables, dark mode.
- Incremental development with meaningful commits.

**Partially evidenced**
- Full-stack integration (only the sections endpoint is consumed).
- Security (upload good; no auth).
- Seeding/data management (works but repetitive).

**Not established**
- Authentication implementation in this project (done in PT System instead), testing, deployment, CI/CD, performance work, teamwork.

---

## 11. CV-Ready Achievements (verified, honest about status)

- Built (work in progress) a configurable company-website platform: ASP.NET Core (.NET 10) API with 13 endpoints and a 10-entity MySQL/EF Core schema, consumed by a Next.js 16 / React 19 / TypeScript frontend.
- Designed a data-driven section model (type, variant, order, visibility and JSON content columns) rendered through a component registry of 15 reusable section components.
- Implemented a hardened image-upload service (size limit, extension allow-list, magic-byte verification, GUID file names, rollback on failure) and a rate-limited, validated contact-message endpoint.
- Created reproducible database seeding for settings, themes, navigation, sections, projects, services and social links via CLI flags.
- Developed theme-aware public UI and a dark-mode admin interface prototype (admin screens are currently non-functional mock-ups).

*(Do not describe the admin panel as functional or the project as deployed.)*

---

## 12. Interview Preparation

- Why store section content as **JSON columns**; pros (flexibility, no migrations) vs cons (no relational integrity, validation moved to app, querying).
- How the **section registry** works and how you'd add a new section type end-to-end.
- Why public endpoints are open today and **how you would add authentication** (JWT/cookies, `AdminUser`, `[Authorize]`, protecting `POST /api/media`).
- Walk through upload validation and why magic bytes matter more than extensions; storage alternatives (S3/Blob).
- FK delete behaviours (Restrict vs SetNull) and why.
- Server vs client components; why `server-only` is used; caching/revalidation options.
- What is mocked vs real, and your plan to finish it (be candid).
- How you'd test it (integration tests with a test MySQL, component tests).

---

## 13. Overall Technical Assessment

**Relative to junior expectations:** a promising architecture-focused project, **but incomplete**. The data model and content API are good for the level; integration and admin side are not done, and the missing authentication is a significant gap. As a showcase it's weaker than PT System today, but it shows ambition and design thinking.

**Strongest**: schema design, JSON-driven section concept, upload hardening, clean layering, steady commit history.
**Weakest**: no auth, no admin functionality, static content on the public site, contact form unwired, no tests/docs/deployment.
**Highest-value next steps**: (1) add admin auth + `[Authorize]` on writes; (2) render `contentJson`, active theme and media from the API; (3) wire the contact form; (4) implement admin CRUD endpoints and connect the admin pages; (5) global exception middleware (400 for validation); (6) write README, tests and a Dockerfile/compose; (7) refactor seeder dispatch.
