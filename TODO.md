# PadiUp setup TODO

Everything that has to be set up outside the code before PadiUp can go live. Work top to bottom and
tick items off as you go. `.env.example` lists every variable with a short note.

## 1. Tools

- [ ] Node 20+ and pnpm 10 (`corepack enable` gives you the pnpm version pinned in `package.json`)
- [ ] Supabase CLI: `brew install supabase/tap/supabase`, then `supabase login`
- [ ] Docker, only if you want a local Supabase (`pnpm db:start`)

## 2. Run it locally (optional, but the quickest check)

- [ ] `pnpm install`
- [ ] `cp .env.example .env.local`
- [ ] `pnpm db:start`. It starts a local Supabase, applies `supabase/migrations` and seeds a `padiup-demo` circle.
- [ ] In `.env.local`, set:
  - `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres`
  - `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
  - `PADIUP_CIRCLE=padiup-demo`
  - `QUEST_SESSION_SECRET`, `ADMIN_PATH`, `ADMIN_USERS` and `ADMIN_SESSION_SECRET` (see step 5)
  - Leave both `NEXT_PUBLIC_SUPABASE_*` empty
- [ ] `pnpm dev`, then open http://localhost:3000. With no Supabase keys, sign-in goes to `/auth/dev`, where any email works.

## 3. Supabase project

- [ ] Create a Supabase account and a project named `padiup`. Pick the region closest to players (eu-west-1 is closest for Nigeria).
  Save the database password somewhere safe.
- [ ] Link the repo: `supabase link --project-ref <project-ref>`
- [ ] Apply the schema: `pnpm db:push`. It applies `supabase/migrations`; `supabase/seed.sql` is for local use only.
- [ ] Copy these from the dashboard into the host's env vars (step 6):
  - `DATABASE_URL`: Connect → **Transaction pooler** (port 6543), with the database password filled in
  - `NEXT_PUBLIC_SUPABASE_URL`: Project Settings → API → Project URL
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Project Settings → API Keys → the `sb_publishable_…` key
- [ ] The security advisor will report "RLS enabled, no policy" on the `quest_*` tables. That's expected: only the
  server connects (as the table owner), and the browser never queries Supabase directly. Don't add policies.

## 4. Google sign-in (the only way players sign in)

- [ ] Google Cloud Console → APIs & Services → OAuth consent screen: app name **PadiUp**, user type External, then publish it.
- [ ] Credentials → Create OAuth client ID → Web application. Under Authorized redirect URIs, add
  `https://<project-ref>.supabase.co/auth/v1/callback`.
- [ ] Supabase → Authentication → Sign In / Providers → Google: turn it on and paste the client ID and secret.
- [ ] Supabase → Authentication → URL Configuration:
  - Site URL: the live site, e.g. `https://padiup.app`
  - Redirect URLs: `https://<live-domain>/auth/callback` and `http://localhost:3000/auth/callback`

## 5. Secrets to generate

Make each one fresh. Never reuse them between projects.

- [ ] `QUEST_SESSION_SECRET`: `openssl rand -hex 32`
- [ ] `ADMIN_SESSION_SECRET`: `openssl rand -hex 32`
- [ ] `ADMIN_PATH`: the admin's secret URL segment, e.g. `ops-$(openssl rand -hex 5)`
- [ ] `ADMIN_USERS`: owners as `email:PIN`, comma separated, with PINs of 6 to 12 digits
- [ ] `QUEST_HALL_KEY`: `openssl rand -hex 12` (the hall screen is at `/hall?key=…`)
- [ ] `CRON_SECRET`: `openssl rand -hex 16`, only needed with X (step 9)

## 6. Hosting (Vercel or similar)

- [ ] Import the GitHub repo. It's a standard Next.js app, built with `pnpm build`.
- [ ] Add every variable from `.env.example`. Set `NEXT_PUBLIC_SITE_URL` to the live domain and `PADIUP_CIRCLE` to
  your circle's slug, e.g. `my-event-2026`. Leave `QUEST_PHASE` empty.
- [ ] Attach the domain, then update Site URL and Redirect URLs in Supabase (step 4) to match it.

## 7. First run

- [ ] Open `https://<domain>/<ADMIN_PATH>` and sign in with an `ADMIN_USERS` email and PIN.
- [ ] Under **Circle**, create the circle. Its slug comes from `PADIUP_CIRCLE`.
- [ ] Click **Edit event, socials and missions**, which goes to `/c/<slug>/admin` → Settings. Owners also have to sign in
  as players once, with Google, to open circle admin. Then fill in:
  - [ ] Event day, venue and city. Before the event day scores are capped; on the day, check-in and venue scans open.
  - [ ] Socials (X, Instagram, LinkedIn, Facebook, YouTube). These are the Stage 1 follows.
  - [ ] Community link, X hashtags and WhatsApp group. Each mission on Home stays hidden until it's set.
- [ ] Add Brain Blitz questions in the admin (Stage 3 starts empty), and the partners for Stage 4.
- [ ] Give organisers their roles with role invite links in circle admin, or with `db/manual/first-organisers.sql`
  (fill in the slug and emails, then `pnpm db:apply db/manual/first-organisers.sql`). Don't commit it with real emails.
- [ ] Optional: make platform admins with `db/manual/platform-admins.sql`, the same way.
- [ ] Optional: to run DevFest Jos 2026, `pnpm db:apply db/circles/devfest-jos-2026.sql` and set
  `PADIUP_CIRCLE=devfest-jos-2026`.

## 8. Profile photos and partner logos (optional)

- [ ] Create a Cloudinary account and copy Cloud name, API key and API secret into `CLOUDINARY_*`. Without them, the
  upload buttons are hidden and players use the preset avatars.

## 9. X post mission checks (optional)

- [ ] On developer.x.com, create an app (pay-per-use) and put its app-only bearer token in `X_BEARER_TOKEN`.
- [ ] Supabase → Database → Extensions: turn on `pg_cron` and `pg_net`.
- [ ] Open `db/manual/cron.sql`, replace `<SITE>` and `<CRON_SECRET>`, and run it once in the Supabase SQL editor.
  Don't commit the filled-in copy.

## Known gaps

- [ ] Dates use Nigerian time (WAT) for every circle. A circle elsewhere needs a timezone setting.
- [ ] Each deployment runs one circle (`PADIUP_CIRCLE`). Running several events from one deployment needs real
  circle membership.
- [ ] Brand pass: the colours and shapes are still Google/DevFest-style, so PadiUp needs its own palette, icon and favicon.
