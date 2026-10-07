-- ════════════════════════════════════════════════════════════════════
-- 3Sixty Protect: editable course types
-- Run in the Supabase SQL editor (project dfgevxndlxdyjzdqjajk). Safe to re-run.
--
-- Moves courses.course_type from a fixed enum to a lookup table so admins
-- can add, rename and remove course types from the owner portal.
-- ════════════════════════════════════════════════════════════════════

create table if not exists course_types (
  key         text primary key check (key ~ '^[a-z0-9_]{2,60}$'),
  label       text not null,
  short_label text not null,
  sort_order  integer not null default 100,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists course_types_set_updated_at on course_types;
create trigger course_types_set_updated_at
  before update on course_types for each row execute function set_updated_at();

-- The RQF qualifications on offer. door_supervision and close_protection
-- keep their original keys because their landing pages depend on them.
insert into course_types (key, label, short_label, sort_order) values
  ('cctv_operator', 'Level 2 Award for CCTV Operators (Public Space Surveillance) in the Private Security Industry (RQF)', 'CCTV Operator', 10),
  ('close_protection_refresher', 'Level 2 Award for Close Protection Operatives in the Private Security Industry (Refresher) (RQF)', 'Close Protection Refresher', 20),
  ('door_supervisor_refresher', 'Level 2 Award for Door Supervisors in the Private Security Industry (Refresher) (RQF)', 'Door Supervisor Refresher', 30),
  ('door_supervision', 'Level 2 Award for Door Supervisors in the Private Security Industry (RQF)', 'Door Supervision', 40),
  ('personal_licence_holder', 'Level 2 Award for Personal Licence Holders (RQF)', 'Personal Licence Holder', 50),
  ('security_officer_refresher', 'Level 2 Award for Security Officers in the Private Security Industry (Refresher) (RQF)', 'Security Officer Refresher', 60),
  ('security_officer', 'Level 2 Award for Security Officers in the Private Security Industry (RQF)', 'Security Officer', 70),
  ('basic_life_support', 'Level 2 in Basic Life Support (Adults and Children) (RQF)', 'Basic Life Support', 80),
  ('behavioural_analysis', 'Level 2 Award in Behavioural Analysis of Events, Individual and Crowds (RQF)', 'Behavioural Analysis', 90),
  ('conflict_management', 'Level 2 Award in Conflict Management (RQF)', 'Conflict Management', 100),
  ('customer_service', 'Level 2 Award in Principles of Customer Service (RQF)', 'Customer Service', 110),
  ('security_safety_incidents', 'Level 2 Award in Responding to Security and Safety Incidents (RQF)', 'Security & Safety Incidents', 120),
  ('public_events', 'Level 2 Award in Securing and Monitoring Public Events (RQF)', 'Public Events Security', 130),
  ('venue_security', 'Level 2 Award in Venue Security Operations (RQF)', 'Venue Security', 140),
  ('education_training', 'Level 3 Award in Education and Training (RQF)', 'Education & Training', 150),
  ('emergency_first_aid', 'Level 3 Award in Emergency First Aid at Work (RQF)', 'Emergency First Aid at Work', 160),
  ('first_aid_at_work', 'Level 3 Award in First Aid at Work (RQF)', 'First Aid at Work', 170),
  ('pi_trainer', 'Level 3 Award for Deliverers of Physical Intervention Training in the Private Security Industry (RQF)', 'PI Trainer', 180),
  ('cp_pi_trainer', 'Level 3 Award for Deliverers of Physical Intervention Training for Close Protection Operatives (RQF)', 'CP PI Trainer', 190),
  ('conflict_trainer', 'Level 3 Award in the Delivery of Conflict Management Training (RQF)', 'Conflict Management Trainer', 200),
  ('close_protection_international', 'Level 3 Certificate for Close Protection Operatives (International) (RQF)', 'Close Protection (International)', 210),
  ('close_protection', 'Level 3 Certificate for Close Protection Operatives in the Private Security Industry (RQF)', 'Close Protection', 220)
on conflict (key) do update
  set label = excluded.label, short_label = excluded.short_label, sort_order = excluded.sort_order;

-- Convert the column from the enum to text (only the first time).
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'courses'
      and column_name = 'course_type' and data_type = 'USER-DEFINED'
  ) then
    alter table courses alter column course_type type text using course_type::text;
  end if;
end $$;

-- Every course must use a known type; renaming a key carries through.
alter table courses drop constraint if exists courses_course_type_fkey;
alter table courses
  add constraint courses_course_type_fkey
  foreign key (course_type) references course_types (key)
  on update cascade on delete restrict;

-- Anyone can read the list (the public calendar uses it); only admins edit it.
alter table course_types enable row level security;
drop policy if exists "course_types public read" on course_types;
create policy "course_types public read" on course_types for select using (true);
drop policy if exists "course_types admin all" on course_types;
create policy "course_types admin all" on course_types
  for all using (is_admin()) with check (is_admin());
