-- Local only (supabase start / supabase db reset): a blank circle to play in.
-- Matches PADIUP_CIRCLE=padi-up-demo in .env.example's local section. Set its event day, socials and
-- missions at /c/padi-up-demo/admin → Settings.
insert into quest_circles (slug, name, host_name) values ('padi-up-demo', 'PadiUp Demo', 'PadiUp')
on conflict (slug) do nothing;
