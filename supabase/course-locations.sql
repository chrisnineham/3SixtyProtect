-- ════════════════════════════════════════════════════════════════════
-- 3Sixty Protect: editable course locations
-- Run in the Supabase SQL editor (project dfgevxndlxdyjzdqjajk). Safe to re-run.
--
-- The options in the course form's "Location" menu. courses.location keeps
-- the chosen name as text, so the website needs no other changes.
-- ════════════════════════════════════════════════════════════════════

create table if not exists course_locations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique check (char_length(name) between 2 and 160),
  sort_order  integer not null default 100,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists course_locations_set_updated_at on course_locations;
create trigger course_locations_set_updated_at
  before update on course_locations for each row execute function set_updated_at();

insert into course_locations (name, sort_order) values
  ('London, E14', 10),
  ('West Midlands - Wednesbury - WS10', 20),
  ('Birmingham', 30),
  ('Leicester - LE4', 40),
  ('Edinburgh, Scotland', 50)
on conflict (name) do nothing;

-- Anyone can read the list; only admins edit it.
alter table course_locations enable row level security;
drop policy if exists "course_locations public read" on course_locations;
create policy "course_locations public read" on course_locations for select using (true);
drop policy if exists "course_locations admin all" on course_locations;
create policy "course_locations admin all" on course_locations
  for all using (is_admin()) with check (is_admin());
