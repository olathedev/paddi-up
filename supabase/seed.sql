-- Local only (supabase start / supabase db reset): a blank circle to play in.
-- Matches PADIUP_CIRCLE=padiup-demo in .env.example's local section. Set its event day, socials and
-- missions at /c/padiup-demo/admin → Settings.
insert into quest_circles (slug, name, host_name) values ('padiup-demo', 'PadiUp Demo', 'PadiUp')
on conflict (slug) do nothing;
