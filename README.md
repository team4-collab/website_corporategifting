# Premium Corporate Gifting — Website

A catalogue-style corporate gifting site built with Next.js (App Router) and Supabase. Customers browse categories, build a custom gift box, and submit an enquiry — there is no cart checkout or online payment. Admins manage products, categories, discounts, the festive countdown banner, contact/WhatsApp settings, media, and enquiries from `/admin/dashboard`.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables** — already written to `.env.local` (gitignored, never commit it):

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
   SUPABASE_SECRET_KEY=...       # server-only, bypasses RLS — never expose client-side
   ADMIN_EMAIL=...
   ADMIN_PASSWORD=...
   ```

3. **Run the database migration.** This repo does not have a stored DB password / Postgres connection string, so the migration can't be applied automatically from here. In the Supabase dashboard, open **SQL Editor** for this project and run the contents of [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) once. It creates all tables, enables RLS with the policies described in the file's comments, seeds the 5 homepage categories, and creates the public `media` storage bucket.

4. **Create the admin user.** Supabase Auth needs one user to log into `/admin/dashboard`. Run:

   ```bash
   node scripts/create-admin.mjs
   ```

   This reads `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env.local` and creates (or resets the password for) that user via the Supabase Admin API. **Change the password after first login** — it currently matches the email, which is easy to guess.

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` for the site and `http://localhost:3000/admin/login` for the admin panel.

## Project structure

- `src/app/(site)/` — public pages: homepage, `/category/[slug]`, `/build-your-gift-box`
- `src/app/admin/` — `/admin/login` and the protected `/admin/dashboard/*` panel (session-gated by `src/middleware.ts`)
- `src/lib/supabase/` — browser client, session-aware server client, and the secret-key admin client used for all mutations
- `src/lib/actions/` — Server Actions for every admin mutation and for enquiry submission
- `supabase/migrations/0001_init.sql` — full schema, RLS policies, seed data, storage bucket
- `scripts/create-admin.mjs` — one-off admin bootstrap/password-reset script

## Notes

- Gift box contents persist in the browser (`localStorage`) — only the submitted enquiry is saved server-side, per the "no checkout" scope of this project.
- Prices are optional per product (admin-toggleable) and hidden from the enquiry total when not shown.
- Enquiries are not currently emailed anywhere — they land in Supabase and show up in `/admin/dashboard/enquiries`, and customers also get a "Continue on WhatsApp" option. Add an email integration later if needed.
