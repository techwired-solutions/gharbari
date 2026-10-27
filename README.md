# GharBari

**A bilingual property listing board for Nepal.**

[Open GharBari](https://gharbarnepal.vercel.app/) · [Setup and operations](docs/SETUP_AND_OPERATIONS.md)

GharBari lets people list available properties or describe what they are looking
for. Visitors can browse a shared board, inspect listing details and use the
configured contact workflow. English and Nepali interfaces support the local audience.

## Features

- Property offers and requests through a shared listing form.
- Categories, search, filters, photos and individual shareable listing pages.
- Broker/contact handling and administrator-managed edits and removals.
- Server-side admin routes and Supabase database/storage integration.
- Optional Google Sheets synchronization.

## Technology

Next.js 16 App Router · React · TypeScript · Tailwind CSS · Supabase/PostgreSQL · Vercel.

## Local development

Use Node.js 20.9+ and npm:

```sh
npm ci
```

Copy `.env.local.example` to `.env.local`, configure a development Supabase
project and unique admin credentials, and apply the SQL files in `supabase/`
in the order described in the [setup guide](docs/SETUP_AND_OPERATIONS.md).
Keep the service-role key and admin signing secret server-side.

```sh
npm run dev
```

Open `http://localhost:3000`; the administrator interface is at `/admin`.
For deployment, set `NEXT_PUBLIC_SITE_URL=https://gharbarnepal.vercel.app`
so canonical URLs and share links match the hosted site.

## Project layout

- `app/` — public pages, listing routes and admin APIs.
- `components/` — reusable listing and form interfaces.
- `lib/` — Supabase access and application helpers.
- `supabase/` — schema, photo storage and contact-privacy migrations.
- `docs/SETUP_AND_OPERATIONS.md` — configuration, contact model and deployment notes.

## Checks and scope

```sh
npm run lint
npm run build
```

These verify lint/build behavior; there is no dedicated automated regression
suite in this repository. Before using a new deployment, verify listing
submission, admin access, photo handling and contact-field permissions against
its own database. A listing is user-provided information, not verification of
ownership, availability or the underlying property transaction.

Built by Sudip Parajuli / Techwired Solutions.
