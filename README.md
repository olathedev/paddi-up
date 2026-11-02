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

```bash
pnpm install
cp .env.example .env.local   # fill in DATABASE_URL, QUEST_SESSION_SECRET and PADIUP_CIRCLE at least
pnpm db:start                # only if using the project-local Postgres in .local-db
pnpm db:migrate              # creates or updates every table; safe to re-run
pnpm dev
```

Then open `/<ADMIN_PATH>`, sign in with an `ADMIN_USERS` email and PIN, and create the circle.
Without Supabase keys, local dev signs in by email at `/auth/dev`.

## Where things are

| Path | What |
| --- | --- |
| `app/(game)` | Everything players see, under the dark/light game theme |
| `app/(game)/(app)` | Signed-in pages with the bottom nav (`/home`, `/board`, `/scan`, `/stage/*` …) |
| `app/(game)/c`, `app/(game)/p` | Circle pages (join, admin, settings) and shared profile links |
| `app/admin-internal` | Owner admin, served only at `/<ADMIN_PATH>` (see `proxy.ts`) |
| `app/api/cron` | X post sync and recheck, called by `db/quest-cron.sql` |
| `lib/current-circle.ts` | The current circle and its event settings |
| `lib/` | Game logic, sessions, DB client, uploads |
| `db/` | SQL migrations, applied in order by `pnpm db:migrate` |
| `db/circles/` | Ready-made circle data (settings and quiz content), applied with `pnpm db:apply <file>` |

## Database setup that isn't automatic

- `db/circles/devfest-jos-2026.sql`: DevFest Jos 2026, PadiUp's first circle, with its quiz bank.
  Apply it with `pnpm db:apply db/circles/devfest-jos-2026.sql` and set `PADIUP_CIRCLE=devfest-jos-2026`.
- `db/quest-07b-first-organisers.sql` and `db/quest-07c-platform-admins.sql`: fill in the slug and emails,
  then run each with `pnpm db:apply <file>`. Don't commit them with real emails.
- `db/quest-cron.sql`: run once in the Supabase SQL editor (needs pg_cron and pg_net).
