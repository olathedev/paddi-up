-- A circle's first organisers. Replace the placeholders (circle slug and emails), then run.
-- The person must have signed in to PadiUp once. Safe to re-run; it never lowers anyone.
-- Do not commit this file with real emails filled in.

with emails(email) as (values
  ('<organiser email 1>'),
  ('<organiser email 2>')
), granted as (
  insert into quest_circle_roles (circle_id, user_id, role)
  select c.id, p.id, 'organiser'
  from quest_circles c
  join emails e on true
  join quest_profiles p on lower(p.email) = lower(trim(e.email))
  where c.slug = '<circle slug>'
  on conflict (circle_id, user_id) do update set role = 'organiser'
  returning circle_id, user_id
)
select p.full_name, 'organiser' as role from granted g join quest_profiles p on p.id = g.user_id;
