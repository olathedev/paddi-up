-- Event details live on the circle, so each circle runs its own event: the event day (drives the
-- game phase), where it is, the community to join and the X post hashtags. Additive and safe to re-run.

alter table quest_circles
  add column if not exists event_date    date,
  add column if not exists venue         text check (char_length(venue) <= 80),
  add column if not exists city          text check (char_length(city) <= 40),
  add column if not exists community_url text check (community_url ~ '^https://'),
  add column if not exists hashtags      text check (hashtags ~ '^#[A-Za-z0-9_]{2,40}( #[A-Za-z0-9_]{2,40}){0,2}$'),
  add column if not exists launch_at     timestamptz;  -- X posts count from here (else created_at)
