# GharBari

A simple, mobile-friendly property listing board: visitors share what they're
looking for (or list a property they have available), and everyone can see
the shared board. Built with Next.js (App Router) + Supabase, deployable to
Vercel's free tier.

## Stack

- **Next.js 14 / App Router** + TypeScript + Tailwind CSS v4
- **Supabase** (Postgres) for storage — public can read/submit listings via
  Row Level Security; only the admin dashboard (service-role key, server-side
  only) can edit or delete
- **lucide-react** for icons, `next/font` for DM Sans + Fraunces
- Bilingual UI (English / नेपाली)

## 1. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the
   `listings` table with the RLS policies (public select + insert, no public
   update/delete).
3. Run [`supabase/migration_001_images.sql`](supabase/migration_001_images.sql)
   the same way. This adds the `image_urls` column and creates the
   `listing-photos` storage bucket (public read, 5MB/file limit, images only,
   public upload) that the photo field uses.
4. Run [`supabase/migration_002_broker_fields.sql`](supabase/migration_002_broker_fields.sql)
   the same way. Adds `price_negotiable` and `map_link` columns.
5. Run [`supabase/migration_003_public_contact_privacy.sql`](supabase/migration_003_public_contact_privacy.sql)
   the same way. Revokes the public anon key's ability to read
   `contact_name`/`contact_number` at the database level — see "Broker
   contact model" below for why this matters beyond just the UI not
   rendering them.
6. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret —
     never expose it to the browser or commit it)

## 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in the Supabase values above, plus the admin login:

```bash
# bcrypt hash of the admin password
node -e "console.log(require('bcryptjs').hashSync('your-password', 12))"

# random session-signing secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Put the results in `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET`. Set
`ADMIN_NAME` and `ADMIN_EMAIL` to whoever should be able to log in at
`/admin`. Set `NEXT_PUBLIC_SITE_URL` to wherever the site is actually
deployed (no trailing slash) — it's used to build share links, WhatsApp
message links, and Open Graph preview metadata for individual listing
pages, so it needs to match the real domain to work correctly.

> **In `.env.local`, escape every `$` in the bcrypt hash as `\$`** (e.g.
> `\$2b\$12\$...`). Next.js's env loader does `$VAR`-style interpolation on
> `.env` files, and an unescaped `$2b`/`$12`/etc. segment gets silently
> replaced with an empty string — login fails with no obvious error
> otherwise.
>
> **In the Vercel dashboard, use the hash UNescaped** (no backslashes).
> Vercel injects environment variables directly into `process.env`; it
> doesn't parse them through Next's `.env` interpolation, so a
> backslash-escaped hash pasted there would be wrong in the other direction.

> The admin password was shared in plain text once, in chat, while setting
> this project up. Treat it as already exposed — pick a **new** password
> before this goes live and regenerate the hash above.

## 3. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the public board, `http://localhost:3000/admin`
for the admin dashboard.

## 4. Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the same environment variables from `.env.local` in the Vercel
   project's **Settings → Environment Variables** (all of them, including
   the server-only ones — Vercel keeps `SUPABASE_SERVICE_ROLE_KEY`,
   `ADMIN_PASSWORD_HASH`, and `ADMIN_SESSION_SECRET` out of the browser bundle
   automatically since nothing here imports them from client components).
4. Deploy. No other config needed — there's no build step beyond the default
   `next build`.

## Admin dashboard

`/admin` lets a non-technical admin create, edit, and delete listings without
touching Supabase directly — sign in with the email/password from your env
vars. Public visitors can only submit new requests; they cannot edit or
delete anything (enforced by RLS, not just the UI).

## Broker contact model

GharBari acts as the broker between the two sides of a listing. The public
board never shows a submitter's raw name/phone — every listing card instead
has a **"Message on WhatsApp"** button that opens a chat with the fixed
brokerage number (`lib/constants.ts` → `BROKER_WHATSAPP_NUMBER`), pre-filled
with which property the enquiry is about **and a direct link to that
listing's page** — so whoever answers can open it and know exactly what's
being asked about without back-and-forth. The submitter's real contact info
is still collected (required on the form) and stays visible only in the
admin dashboard, so staff can follow up directly. To change the brokerage
number, edit `BROKER_WHATSAPP_NUMBER` in `lib/constants.ts` and redeploy.

This is enforced at the database level, not just by the UI not rendering
those fields. `migration_003_public_contact_privacy.sql` revokes the anon
role's SELECT on `contact_name`/`contact_number` entirely — the public anon
key is necessarily embedded in the browser bundle, so without this, anyone
could read every submitter's raw phone number straight from Supabase's REST
API (or from Next.js's hydration payload) regardless of what the page
visibly shows. `/api/listings` (public) and `app/page.tsx` both fetch an
explicit public column list matching that grant; the public POST handler
uses the service-role client for the insert itself (so it can still get the
full row back to sync to Google Sheets) but strips those two fields before
the response reaches the browser (`toPublicListing()` in `lib/types.ts`).
`/api/admin/*` is unaffected — it always uses the service-role key, which
bypasses RLS and column grants.

## Search, categories & filters

A search icon in the top nav expands into a live filter over the community
board — matches on location, property type, listing type, description, and
price. Client-side only, no extra request; the admin dashboard has the same
filter behavior in its own search box (shared logic in `lib/search.ts`).

The board also splits listings into two categories — **Looking for**
(Buy/Rent requests) and **Available** (Sell/Rent out listings) — since those
represent opposite intents and mixing them together made the board harder
to scan. A "Property type" and "Bedrooms" filter sit alongside the category
tabs; all of it (search, category, filters) combines with AND logic. Price
and area aren't filterable as numeric ranges since they're free-text fields
on the form (`"NPR 2-3 crore"`, `"5 aana"`, etc.) rather than structured
numbers — search still matches against their text. Turning them into real
numeric ranges would mean redesigning the submission form to collect
structured min/max values instead of free text, which is a bigger change;
happy to do it as a follow-up if stricter filtering turns out to matter.

## Listing pages & sharing

Every listing has its own page at `/listing/[id]` — a full-size photo
gallery, all details, the WhatsApp CTA, and a **Share** button (also on
every card). Share uses the native share sheet on mobile
(`navigator.share`) and falls back to copying the link on desktop. The page
has Open Graph/Twitter Card metadata (title, description, first photo) so
pasting a listing link into WhatsApp, Messenger, etc. shows a real preview
card instead of a bare URL.

## Nav quick-access form

The "Get started" button in the nav opens the same Find/List form in a
modal, so a visitor can submit a request or a listing from anywhere on the
page without scrolling down to the embedded form section
(`components/Modal.tsx` + `components/RequestForm.tsx`'s `variant="bare"`).
Both instances share the same submit handler and update the same listings
state; they're kept from colliding in the DOM via `idPrefix`.

## Photos

Both the public form and the admin dashboard have a photo field — up to 4
images per listing, 5MB each, uploaded directly from the browser to the
`listing-photos` Supabase Storage bucket (not proxied through the Next.js
API, so there's no server-side file size limit to worry about on Vercel).
Deleting a listing does not delete its photos from storage — they're just
orphaned, harmless on the free tier's storage quota.

## Google Sheets sync (optional)

If configured, every listing create/edit/delete — from the public form or
the admin dashboard — automatically mirrors to a Google Sheet, so a
non-technical admin can also see everything in a spreadsheet with no extra
steps. It's entirely optional: unset the env vars below and the app runs
exactly as before, no errors.

1. In [Google Cloud Console](https://console.cloud.google.com/), create (or
   pick) a project, then **APIs & Services → Library** → enable the
   **Google Sheets API**.
2. **APIs & Services → Credentials → Create Credentials → Service Account**.
   Give it any name, no roles needed (access is granted per-sheet in step 4).
3. Open the new service account → **Keys → Add Key → Create new key → JSON**.
   This downloads a JSON file — you need two fields from it:
   - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → `GOOGLE_PRIVATE_KEY` (paste it exactly as it appears,
     `\n` sequences and all)
4. Create a Google Sheet (or use an existing one), then **Share** it with
   the service account's `client_email` as **Editor**. Without this step
   every sync attempt fails with a permissions error.
5. Copy the sheet's ID from its URL —
   `docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit` → `GOOGLE_SHEET_ID`.
6. Set `GOOGLE_SHEET_NAME` to the tab name if it's not the default `Sheet1`.

A header row is written automatically the first time a listing syncs. Sync
failures are logged server-side and never block or fail the actual
create/edit/delete — the Sheet is a convenience mirror, Supabase stays the
source of truth.

## Project structure

```
app/
  page.tsx                 Public single-page board (server component, fetches initial listings)
  listing/[id]/page.tsx    Individual listing page + OG metadata
  listing/[id]/not-found.tsx  Branded 404 for a missing/removed listing
  api/listings/route.ts    Public GET (list) / POST (submit) — validated, rate-limited, honeypot-checked
  admin/
    login/page.tsx         Admin sign-in
    page.tsx                Admin dashboard (protected by proxy.ts)
  api/admin/
    login/route.ts         Verifies credentials, issues a signed session cookie
    logout/route.ts
    listings/route.ts      Admin GET (all) / POST (create) via service-role key
    listings/[id]/route.ts Admin PATCH (update) / DELETE
components/                Public site UI (Hero, RequestForm, ListingsBoard, ...)
components/ImagePicker.tsx  Shared photo upload/preview field (public form + admin)
components/ListingDetail.tsx  The /listing/[id] page's content (gallery, CTA, share)
components/ListingFilters.tsx  Category tabs + property type/bedrooms filters
components/Modal.tsx          Generic dialog (portal, Esc/backdrop close) — used by the nav's quick-access form
components/ShareButton.tsx    navigator.share with copy-link fallback
components/admin/          Admin dashboard UI
lib/
  supabase.ts               Anon-key client (RLS-scoped)
  supabase-admin.ts          Service-role client (server-only, bypasses RLS)
  admin-auth.ts              Session token signing/verification
  upload-image.ts            Direct browser → Supabase Storage upload helper
  google-sheets.ts            Optional Google Sheets mirror (create/update/delete)
  constants.ts                 Broker WhatsApp number + wa.me link builder
  site-url.ts                  Absolute site origin for share/WhatsApp/OG links
  search.ts                    Shared listing search/filter predicate
  translations.ts            EN / NE copy
  validation.ts               Shared zod schema for a listing submission
proxy.ts                     Protects /admin and /api/admin routes (Next.js 16's
                              renamed middleware.ts)
supabase/schema.sql          Table + RLS policies
supabase/migration_001_images.sql  image_urls column + listing-photos bucket
supabase/migration_002_broker_fields.sql  price_negotiable + map_link columns
supabase/migration_003_public_contact_privacy.sql  revokes anon SELECT on contact_name/contact_number
```
