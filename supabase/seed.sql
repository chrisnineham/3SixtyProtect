-- ════════════════════════════════════════════════════════════════════
-- 3Sixty Protect — Seed data (optional)
-- Run AFTER schema.sql to populate a few published courses so the public
-- site has content. Mirrors lib/mock-data.ts.
-- ════════════════════════════════════════════════════════════════════

insert into courses
  (title, course_type, description, start_date, end_date, start_time, end_time, location, price, max_spaces, available_spaces, status)
values
  ('SIA Door Supervision — Level 2 Award', 'door_supervision',
   'Our flagship 6-day Door Supervisor course delivers everything you need to apply for your SIA licence — physical intervention, conflict management, and the law, taught by working professionals.',
   '2026-07-13', '2026-07-18', '09:00', '17:00', 'London — Stratford Training Centre', 249, 16, 5, 'published'),

  ('SIA Close Protection — Level 3 Award', 'close_protection',
   'An intensive 14-day Close Protection programme covering operational planning, foot and vehicle drills, threat assessment and professional conduct — the standard required to work as a CPO.',
   '2026-07-20', '2026-08-02', '08:30', '18:00', 'London — Stratford Training Centre', 1895, 12, 3, 'published'),

  ('SIA Door Supervision — Level 2 Award', 'door_supervision',
   'The complete Door Supervisor qualification delivered over six days in central Birmingham. Small group sizes, experienced trainers and full exam support included.',
   '2026-08-10', '2026-08-15', '09:00', '17:00', 'Birmingham — City Centre Venue', 239, 16, 11, 'published'),

  ('SIA Door Supervision — Level 2 Award (Weekend Friendly)', 'door_supervision',
   'Same comprehensive Door Supervisor qualification, scheduled across two weeks to suit those balancing work commitments. Includes first aid and physical intervention modules.',
   '2026-08-24', '2026-08-29', '09:00', '17:00', 'London — Stratford Training Centre', 249, 16, 16, 'published'),

  ('SIA Close Protection — Level 3 Award', 'close_protection',
   'Our Close Protection course returns to Manchester. Build the operational skillset and professional standards expected of a modern Close Protection Officer across a focused 15-day programme.',
   '2026-09-07', '2026-09-21', '08:30', '18:00', 'Manchester — Training Academy', 1850, 12, 9, 'published'),

  ('SIA Door Supervision — Level 2 Award', 'door_supervision',
   'Start your security career this autumn. A complete six-day Door Supervisor qualification with full SIA licence application support on completion.',
   '2026-09-14', '2026-09-19', '09:00', '17:00', 'London — Stratford Training Centre', 249, 16, 14, 'published');

-- ── Promote an existing auth user to admin ──────────────────────────
-- 1. Create the user in Supabase Auth (Dashboard → Authentication → Users).
-- 2. Then run, with their email:
--
--   insert into admin_users (id, email, role)
--   select id, email, 'owner' from auth.users where email = 'owner@3sixtyprotect.co.uk'
--   on conflict (id) do nothing;
