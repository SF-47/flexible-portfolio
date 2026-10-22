# Content Editor: Architecture Guide

Written for studying the code file by file. Everything here describes the code as it is now.
(The earlier audit version of this file is replaced. Its findings are summarised in section I.)

**Status in one paragraph.** All 15 sections have a working editor with a live preview, validation and a Save button that writes to MySQL. Image fields use the Media Library, and new images can be uploaded from the picker. Writes are *development-only*: the API refuses every `/api/admin/*` request outside the `Development` environment, and the Next.js server actions refuse outside `next dev`. **Not done:** admin CRUD for Services and Projects records (section I.5), and the Media Library *page* is still a mock.

---

## A. Folder structure

### A.1 Frontend (`frontend/src`)

| File | What it does | Why it exists | Imported by | Depends on | Runs on |
|---|---|---|---|---|---|
| `app/admin/content/page.tsx` | Loads sections + media, renders the editor | Entry point of `/admin/content` | Next router | `lib/adminSections`, `lib/media`, `ContentEditor` | **Server** (dynamic: reads `searchParams`) |
| `app/admin/content/actions.ts` | Server Actions `saveSectionContent`, `uploadImage` | The only place the browser can trigger writes | `ContentEditor`, `MediaPicker` | `lib/sections`, `lib/media`, `lib/apiError` | **Server** (`"use server"`) |
| `app/admin/preview/page.tsx` | The page loaded *inside the iframe*. Fetches all data, renders one section | Gives the preview the real theme, media, services, projects | iframe `src` in `PreviewFrame` | six `lib/*` helpers, `SiteTheme`, `LiveSectionPreview` | **Server** |
| `components/admin/content/ContentEditor.tsx` | Coordinator: section picker, drafts, validation, save, reset, preview panel | The one stateful component of the editor | `app/admin/content/page.tsx` | everything below | **Client** |
| `components/admin/content/sectionForms.ts` | Table: for each of the 15 types, which fields/lists to show and how | Keeps 15 forms as *data*, not 15 components | `ContentEditor`, `ItemsEditor` | the public components' `icons` maps | Client-bundled module |
| `components/admin/content/TextFieldsEditor.tsx` | Renders a section's own fields | Used by every section | `ContentEditor` | `FieldInput` | Client |
| `components/admin/content/ItemsEditor.tsx` | Renders an array (add / remove / move) | Stats, team, FAQ, … all share it | `ContentEditor` | `FieldInput`, `sectionForms` | Client |
| `components/admin/content/FieldInput.tsx` | One input, chosen by field `kind` (text, textarea, link, boolean, rating, icon, media) | Single place for input markup and a11y | `TextFieldsEditor`, `ItemsEditor` | `MediaField`, `SAFE_LINK_PATTERN` | Client |
| `components/admin/content/MediaField.tsx` | Thumbnail + Choose / Change / Remove for one image | Image fields | `FieldInput` | `MediaContext`, `MediaPicker`, `getMediaUrl` | Client |
| `components/admin/content/MediaPicker.tsx` | Modal `<dialog>` listing Media Library assets + upload form | Pick or upload an image | `MediaField` | `uploadImage` action, `MediaContext` | Client |
| `components/admin/content/MediaContext.ts` | React context holding the media list and an "uploaded" callback | Avoids passing `media` through 4 levels | `ContentEditor`, `MediaField`, `MediaPicker` | none | Client |
| `components/admin/content/contentJson.ts` | `parseContent` and `sameContent` | Safe JSON parsing; compares contents ignoring key order/spacing | `ContentEditor` | none | Client |
| `components/admin/preview/PreviewFrame.tsx` | The iframe, scaling, height tracking, loading/timeout, the draft **handshake**. Also exports `devices` | Shared by Sections page and Content Editor | `SectionPreviewPanel`, `ContentEditor`, `DeviceSwitcher` | none | Client |
| `components/admin/preview/DeviceSwitcher.tsx` | Desktop/Tablet/Mobile buttons (two styles) | Removed duplicated markup | `SectionPreviewPanel`, `ContentEditor` | `PreviewFrame` | Client |
| `components/admin/preview/SectionPreviewPanel.tsx` | Slide-over on `/admin/sections` | Sections-page specific | `SectionsList` | `PreviewFrame`, `DeviceSwitcher` | Client |
| `components/admin/preview/LiveSectionPreview.tsx` | Runs **inside the iframe**: listens for drafts, renders with `SectionRenderer` | Makes the preview live | `app/admin/preview/page.tsx` | `SectionRenderer`, `sectionSchemas` | Client |
| `components/portfolio/sections/SectionRenderer.tsx` | `JSON.parse` → Zod validate → pick the component | Used by the public page **and** the preview | `app/page.tsx`, `LiveSectionPreview` | all section components, schemas | Server (public) / client bundle (preview) |
| `components/portfolio/sections/*.tsx` | The 15 public section components | The public site | `SectionRenderer` | `types/sectionContent`, `lib/mediaUrl` | Server (Contact, HeroFrame, Reveal are client) |
| `schemas/sectionSchemas.ts` | 15 Zod schemas, `sectionSchemas` map, `SAFE_LINK_PATTERN` | Single frontend definition of every ContentJson shape | renderer, editor, preview, types | `zod` | Both |
| `types/apiSections.ts` | `ApiSection` (API shape, now with `updatedAt`) | Typing | many | `types/section` | n/a |
| `lib/sections.ts` | `getSections`, `saveSectionsLayout`, `updateSectionContent`, … (axios) | API access | pages, actions | `lib/axios` | **Server-only** |
| `lib/media.ts` | `getMedia`, `uploadMedia` | API access | pages, actions | `lib/axios` | **Server-only** |
| `lib/apiError.ts` | Turns an axios error into a message for the admin | One place for error text | `content/actions.ts` | axios | **Server-only** |
| `lib/mediaUrl.ts` | `getMediaUrl(id, media)` → safe absolute URL | Resolves `imageMediaId` | public components, editor | none | Both |

### A.2 Backend (`backend`)

| File | What it does |
|---|---|
| `Controllers/Admin/AdminController.cs` | `GET /api/admin/sections`, `PUT …/reorder`, `PUT …/layout`, **`PUT …/{id}/content`** |
| `Controllers/AdminMediaController.cs` | **`POST /api/admin/media`** (multipart upload) |
| `Services/Sections/SectionService.cs` | `UpdateContentAsync`: validate, check media ids, concurrency, save |
| `Services/Sections/SectionContentValidator.cs` | Server-side rules for all 15 section types (mirrors the Zod schemas) |
| `Services/Media/MediaService.cs` | `UploadAsync` (already existed: 5 MB, extension + magic-byte checks) |
| `DTOs/Sections/UpdateSectionContentRequest.cs` | `{ ContentJson, ExpectedUpdatedAt }` |
| `DTOs/Sections/SectionResponse.cs` | Now includes `UpdatedAt` |
| `Program.cs` | Closes `/api/admin/*` outside Development |

---

## B. Content loading flow (read)

```
MySQL  Sections.ContentJson (json column)
  │  EF Core, AsNoTracking, projected to SectionResponse
ASP.NET  GET /api/sections (visible)   /   GET /api/admin/sections (all)
  │  axios, server-only (lib/sections.ts), timeout 10 s
Next.js server component (app/page.tsx)  →  <SectionRenderer sections services projects siteSettings media />
  │  for each visible section, in order:  JSON.parse → schema.safeParse → <Hero content=… media=… />
Public website
```

If a section's JSON is malformed or fails its schema, `SectionRenderer` logs to the server console and renders nothing for it. That is why the editor validates *before* saving.

## C. Live preview flow

```
 input onChange (FieldInput)
   → TextFieldsEditor / ItemsEditor build the next content object
   → ContentEditor.changeDraft()  →  drafts[sectionId] = next   (React state, no network)
   → previewJson = JSON.stringify(draft)
   → PreviewFrame effect:  iframe.contentWindow.postMessage({type:"SECTION_DRAFT", sectionId, contentJson})
   → LiveSectionPreview (inside iframe) message listener
        checks origin, source === window.parent, type, sectionId, size ≤ 100 000, JSON.parse, section Zod schema
   → setDraft(...)  →  <SectionRenderer sections={[draft forced visible]} />  →  the real public component
```

### The handshake (replaces the old "send on `load`")

```
PreviewFrame mounts → starts listening for messages, renders the iframe
iframe loads → React hydrates LiveSectionPreview → its effect attaches the listener,
               THEN posts  { type: "PREVIEW_READY", sectionId }  to the parent
PreviewFrame receives it (origin + source === this iframe + sectionId checked)
               → readyCount++  → effect sends the latest draft
every later change of the draft → effect sends it again
```

Why a counter (`readyCount`) and not a boolean: if the iframe reloads itself (dev hot reload, "Try again"), it announces readiness again and the draft is re-sent.

Stale drafts: `PreviewFrame` is keyed by section id, so switching sections creates a fresh iframe. Messages from an older iframe fail the `event.source === iframeRef.current.contentWindow` check. **Reset** removes the draft, so `previewJson` falls back to the saved content and is sent like any other change.

Read-only iframe: `<main inert>` inside, `pointer-events-none` outside, `tabIndex={-1}` on the iframe. Hidden sections preview normally because the preview route reads *all* sections and forces `isVisible: true`.

Height: `PreviewFrame` observes the iframe's `<main>` with the iframe's own `ResizeObserver`, so adding or removing items resizes the frame by itself. Device switching changes width only; the iframe is **not** reloaded.

## D. Saving flow

```
Save button (ContentEditor.handleSave)           ← enabled only if: dirty, valid, not already saving
  → saveSectionContent(id, contentJson, expectedUpdatedAt)         (Server Action, app/admin/content/actions.ts)
      guard: NODE_ENV === "development" else { ok:false, "only in local development" }
      checks argument types and length
  → lib/sections.ts  PUT /api/admin/sections/{id}/content  { contentJson, expectedUpdatedAt }   (axios, server-only)
  → ASP.NET: Program.cs guard (404 outside Development)
  → AdminController.UpdateSectionContent → SectionService.UpdateContentAsync
       1. section exists?                          no  → 404
       2. length ≤ 100 000, valid JSON object?     no  → 400
       3. SectionContentValidator (per type)       no  → 400 with the exact path, e.g. "content.items[0].rating must be …"
       4. every imageMediaId exists in MediaAssets no  → 400
       5. expectedUpdatedAt == stored UpdatedAt?   no  → 409 "changed elsewhere"
       6. write ContentJson + UpdatedAt only       (type, order, visibility, settings are untouched)
  → 200 SectionResponse (new contentJson + updatedAt)
  → action: revalidatePath("/", "layout")  (the homepage and admin pages are prerendered)
  → ContentEditor: baseline = response, draft removed, "Content saved."
```

While a save is running the form is inside a `<fieldset disabled>`, so edits and double submits are impossible. `expectedUpdatedAt` is the baseline's timestamp; after a successful save the baseline moves forward to the returned one.

## E. Every section editor

All values below are stored in `Sections.ContentJson`. "Image" fields hold a `MediaAssets.Id` (or `null`).

| Section | Own fields | Repeated list |
|---|---|---|
| hero | tagline, title, description (textarea), buttonText, buttonLink (link), **imageMediaId** (image, optional key) | none |
| about | label, title, description, secondDescription, linkText, linkUrl (link), **imageMediaId**, imageAlt | none |
| stats | none | `items`: value, label |
| services | label, title, description | none. Cards come from the Services table |
| projects | label, title | none. Cards come from the Projects table |
| whyChooseUs | label, title, description | `items`: icon (select), title, description |
| process | label, title, description | `steps`: number (auto "01", "02" for new), icon (select), title, description |
| gallery | label, title, description, icon (select) | `items`: title, category, **imageMediaId**, featured (checkbox) |
| team | label, title, description | `members`: name, position, description, **imageMediaId** |
| clients | label, title, description | `items`: name, icon (select) |
| testimonials | label, title, description | `items`: name, role, initials, rating (1 to 5 select), message |
| certifications | label, title, description | `items`: icon (select), title, subtitle, description |
| faq | label, title, description, helpIcon (select), helpTitle, helpLinkText, helpLinkUrl (link) | `items`: question, answer |
| cta | label, title, description, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink | none |
| contact | label, title, description, addressTitle, phoneTitle, emailTitle, nameLabel, namePlaceholder, emailLabel, emailPlaceholder, messageLabel, messagePlaceholder, buttonText | none. Phone, email and address are **Site Settings**, not in ContentJson |

**Icons.** Each public component resolves icon names through its own `icons` map and falls back to a default. I exported those maps (`export const icons`) and the dropdowns are built from `Object.keys(icons)`, so the editor can only offer names the component can draw. A stored name that is not in the list is kept and shown as "(not available)".

**Unknown properties are preserved.** Editors always do `{ ...content, [key]: value }`, so keys the form doesn't know about survive a save.

## F. Reusable components

Shared: `FieldInput` (all inputs), `TextFieldsEditor` (any section's own fields), `ItemsEditor` (any list), `MediaField` / `MediaPicker`, `PreviewFrame`, `DeviceSwitcher`.
Section-specific: nothing. Per-section differences live in `sectionForms.ts` (data), so adding a field to a section is a one-line change there plus the Zod schema, the API validator and the public component.

Adding a field `foo` to the CTA, step by step:
1. `schemas/sectionSchemas.ts`: add `foo: text` to `CTASchema`.
2. `SectionContentValidator.cs`: add `F("foo", Text)` to `["cta"]`.
3. `sectionForms.ts`: add `{ key: "foo", label: "Foo" }` to `cta.fields`.
4. `CTA.tsx`: render `content.foo`.

## G. Media integration

1. The content page fetches `GET /api/media` (all `MediaAsset` rows) and passes them to `ContentEditor`, which puts them in `MediaContext`.
2. A `media`-kind field stores the numeric id: `imageMediaId: 1`. `MediaField` shows `getMediaUrl(id, media)`, the file name and alt text, or "Image #7 was not found" if the row is gone.
3. `MediaPicker` (native `<dialog>`: Esc and focus trapping come free) lists the assets, offers "Use no image" and an upload form. Upload → `uploadImage` action → `POST /api/admin/media` → `MediaService.UploadAsync` → new row; the new asset is added to the list and selected.
4. The public components call the same `getMediaUrl`, which only accepts `/uploads/<name>.jpg|jpeg|png|webp`.
5. On save, the API checks every id exists (400 otherwise).

## H. API endpoints (relevant)

| Method and path | Request | Success | Errors |
|---|---|---|---|
| `GET /api/sections` | none | visible `SectionResponse[]` | none |
| `GET /api/admin/sections` | none | all `SectionResponse[]` (includes `updatedAt`) | 404 outside Development |
| `PUT /api/admin/sections/{id}/content` | `{ contentJson: string, expectedUpdatedAt?: datetime }` | `200 SectionResponse` | `400 {message}` invalid JSON, not an object, schema rule broken, unknown media id · `404` unknown section · `409 {message}` changed since loaded |
| `PUT /api/admin/sections/layout`, `…/reorder` | unchanged | unchanged | unchanged |
| `POST /api/admin/media` | multipart: `file`, `altText?` | `200 MediaAssetResponse` | `400` (no file, >5 MB, wrong type, content doesn't match extension) |
| `GET /api/media` | none | `MediaAssetResponse[]` | none |

`SectionResponse` = `{ id, type, name, variant, order, isVisible, navLabel, contentJson, settingsJson, updatedAt }`.

Rules enforced by both Zod (editor) and `SectionContentValidator` (API): every listed key present with the right type; strings ≤ 5000 chars; links empty or starting with `#`, `/`, `http(s)://`, `mailto:`, `tel:` (never `javascript:`); media id `null` or a positive int; rating whole number 1 to 5; booleans really boolean. Extra keys are allowed.

---

## I. Changes made

### I.1 Created
Frontend: `app/admin/content/actions.ts`, `components/admin/content/{FieldInput,ItemsEditor,MediaContext,MediaField,MediaPicker,TextFieldsEditor}.tsx|ts`, `contentJson.ts`, `sectionForms.ts`, `components/admin/preview/{DeviceSwitcher,PreviewFrame}.tsx`, `lib/apiError.ts`.
(`preview/LiveSectionPreview.tsx` existed untracked and was rewritten.)
Backend: `Controllers/AdminMediaController.cs`, `DTOs/Sections/UpdateSectionContentRequest.cs`, `Services/Sections/SectionContentValidator.cs`.

### I.2 Modified
- `schemas/sectionSchemas.ts`: shared `text`/`link`/`mediaId` pieces, safe-link rule, rating 1 to 5, `sectionSchemas` map.
- `types/apiSections.ts` (+`updatedAt`), `lib/sections.ts` (+`updateSectionContent`), `lib/media.ts` (+`uploadMedia`).
- `app/admin/content/page.tsx` (also loads media), `SectionsList.tsx` and `app/page.tsx` (import paths).
- `WhyChooseUs`, `Process`, `Gallery`, `Clients`, `Certifications`, `FAQ`: only `const icons` → `export const icons`. No visual change.
- Backend: `SectionResponse` (+`UpdatedAt`), `ISectionService`/`SectionService` (+`UpdateContentAsync`), `AdminController` (+content action), `Program.cs` (admin guard).

### I.3 Moved / renamed
- `components/admin/ContentEditor.tsx` → `components/admin/content/ContentEditor.tsx`
- `components/admin/SectionPreviewPanel.tsx` → `components/admin/preview/SectionPreviewPanel.tsx` (`PreviewFrame` and `devices` split out into `PreviewFrame.tsx`)
- `components/portfolio/sections/SectionRederer.tsx` → `SectionRenderer.tsx` (typo fixed with `git mv`; all imports updated; `grep` finds no remaining `Rederer`).

### I.4 Deleted (and why it was safe)
| File | Evidence it was unused |
|---|---|
| `components/admin/preview/PreviewPanel.tsx` | `grep` found no importer. It was the old fake-preview wrapper from before the iframe preview |
| `components/admin/preview/FullPreviewButton.tsx` | Only importer was `PreviewPanel.tsx` (deleted above) |
| `components/admin/StatsEditor.tsx`, `TextFieldEditor.tsx` | Your untracked work-in-progress. Their behaviour (stats add/remove/reorder, text fields, unknown keys preserved) now lives in `ItemsEditor` / `TextFieldsEditor`. **They were never committed**, so I copied them first to `/tmp/claude-1000/-home-samifarhat-Desktop-Projects-flexible-portfolio/19fb45d1-22da-464f-8ff9-f5a3ebcacdd4/scratchpad/backup/` (also holds the previous `ContentEditor.tsx`) |

Removed in a later cleanup (each had zero references): the unused reorder route `app/api/admin/sections/reorder/route.ts` and `reorderSections` in `lib/sections.ts` (the Sections page uses the layout save instead); the mock page `app/admin/editor/page.tsx`; the unused mock arrays in `mockData.ts`; `data/siteConfig.ts`; the five default Next.js SVGs in `frontend/public`; `backend/Portfolio.Api.http` (it only called a non-existent weather endpoint); `PROJECT_AUDIT.md` (outdated, replaced by this guide); and the repo-root `package.json`, `package-lock.json` and `node_modules` (only a stray copy of zod).

### I.5 Not implemented
- **Services / Projects administration.** The only endpoints are read-only (`GET /api/company-services`, `GET /api/projects`); there are no admin pages and no create/update/delete. This is a separate feature (two admin controllers + two pages) that I did not build. The Services and Projects *sections* (heading text) are fully editable; the cards are not.
- **Media Library page** (`/admin/media`) is still the mock. Upload and selection work through the picker inside the Content Editor.

### I.6 Known limitations
- **Development-only writes.** Nothing can be saved in production until authentication exists. In production `/api/admin/*` returns 404 (including reads), so the admin pages will fail to load there. That is the intended fail-closed behaviour.
- `zod` (4.6.7) is declared in `frontend/package.json` and installed there, so building from `frontend/` works.
- The API process you have running was started *before* these changes. **Restart `dotnet run`** to get the new endpoints and `updatedAt`.
- Two admins editing at once: the second save gets a 409 and must reload. Reloading discards that tab's unsaved drafts.
- Saving the same section after the Sections page changed its order/visibility also produces a 409 (that save updates `UpdatedAt` too). Reload and retry.
- Switching sections keeps drafts in memory, but a reload loses them (the browser asks first).
- A section whose stored JSON is not an object offers "Start from empty content".
- The homepage and `/admin/sections` are prerendered; direct database edits show only after a rebuild or `revalidatePath`.

## J. Recommended study order

1. `schemas/sectionSchemas.ts`: what content each section holds.
2. `components/portfolio/sections/CTA.tsx` then `Hero.tsx`: how content becomes HTML.
3. `components/portfolio/sections/SectionRenderer.tsx`: parse, validate, pick.
4. `components/admin/content/contentJson.ts`: two tiny helpers.
5. `components/admin/content/sectionForms.ts`: the form table (data only).
6. `FieldInput.tsx`, `TextFieldsEditor.tsx`, `ItemsEditor.tsx`: rendering from that table.
7. `MediaContext.ts`, `MediaField.tsx`, `MediaPicker.tsx`: images.
8. `components/admin/preview/LiveSectionPreview.tsx`, then `PreviewFrame.tsx`: the handshake, scaling and height tracking (the hardest front-end file).
9. `components/admin/content/ContentEditor.tsx`: drafts, baselines, dirty/valid logic, save.
10. `app/admin/content/actions.ts` and `lib/sections.ts`: the server boundary.
11. Backend: `UpdateSectionContentRequest.cs` → `SectionContentValidator.cs` → `SectionService.UpdateContentAsync` → `AdminController` → `Program.cs` guard.

How `ContentEditor` keeps state (the key idea):
```ts
baselines[id] = { contentJson, updatedAt }   // last saved version (moves forward on save)
drafts[id]    = content object               // exists only while it differs from the baseline
draft         = drafts[id] ?? parse(baseline)
isDirty       = drafts[id] !== undefined
```
