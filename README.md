# PadiUp

Meet people, padi up and climb the leaderboard. Players sign in with Google, build a player card,
scan each other's QR codes and clear four stages: follow the host, padi up, Brain Blitz quiz rounds
and partner stands.

## Circles

Each deployment runs one circle (`PADIUP_CIRCLE`), and every player is in it. Everything
event-specific lives on the circle, not in the code:

- **Event day, venue, city:** the event day sets the phase. Before it, scores are capped; on the day,
  check-in and venue scans open. No event day means no venue features and no cap.
- **Socials:** the Stage 1 follows (X, Instagram, LinkedIn, Facebook, YouTube).
- **Community link, X hashtags, WhatsApp group:** the missions on Home. Each one hides until it's set.

Organisers edit these at `/c/<slug>/admin` → Settings.

## Run it

New here? **[TODO.md](TODO.md)** lists everything to set up (Supabase, Google sign-in, hosting, secrets).

```bash
pnpm install
cp .env.example .env.local
pnpm db:start                # local Supabase (Docker): applies supabase/migrations and seeds padiup-demo
pnpm dev
```

Then open `/<ADMIN_PATH>`, sign in with an `ADMIN_USERS` email and PIN, and check the circle.
Without Supabase keys, local dev signs in by email at `/auth/dev`.

## Database

- Schema changes are Supabase migrations in `supabase/migrations`. Add one with `supabase migration new <name>`,
  test it with `pnpm db:reset`, and ship it with `pnpm db:push`.
- `db/circles/` holds ready-made circle data (settings and quiz content). Apply one with `pnpm db:apply <file>`.
- `db/manual/` holds scripts you fill in and run by hand: first organisers, platform admins, and the X cron.

## Where things are

| Path | What |
| --- | --- |
| `app/(game)` | Everything players see, under the dark/light game theme |
| `app/(game)/(app)` | Signed-in pages with the bottom nav (`/home`, `/board`, `/scan`, `/stage/*` …) |
| `app/(game)/c`, `app/(game)/p` | Circle pages (join, admin, settings) and shared profile links |
| `app/admin-internal` | Owner admin, served only at `/<ADMIN_PATH>` (see `proxy.ts`) |
| `app/api/cron` | X post sync and recheck, called by `db/manual/cron.sql` |
| `lib/current-circle.ts` | The current circle and its event settings |
| `lib/` | Game logic, sessions, DB client, uploads |
| `supabase/` | Supabase config, migrations and the local seed |
| `db/` | Circle data and manual scripts (see Database) |

