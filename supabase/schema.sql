-- ════════════════════════════════════════════════════════════════════
-- 3Sixty Protect — Database schema
-- Run in the Supabase SQL editor (or via the CLI) on a fresh project.
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.
-- ════════════════════════════════════════════════════════════════════

-- ── Extensions ──────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── Enums ───────────────────────────────────────────────────────────
do $$ begin
  create type course_type as enum ('door_supervision', 'close_protection');
exception when duplicate_object then null; end $$;

do $$ begin
  create type course_status as enum ('draft', 'published', 'fully_booked', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type booking_status as enum ('new', 'confirmed', 'cancelled', 'completed');
exception when duplicate_object then null; end $$;

-- ── updated_at helper ───────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ════════════════════════════════════════════════════════════════════
-- courses
-- ════════════════════════════════════════════════════════════════════
create table if not exists courses (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  course_type      course_type not null,
  description      text not null default '',
  start_date       date not null,
  end_date         date not null,
  start_time       time,
  end_time         time,
  location         text not null default '',
  price            numeric(10,2) not null default 0,
  max_spaces       integer not null default 0 check (max_spaces >= 0),
  available_spaces integer not null default 0 check (available_spaces >= 0),
  image_url        text,
  status           course_status not null default 'draft',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists courses_status_idx on courses (status);
create index if not exists courses_type_idx on courses (course_type);
create index if not exists courses_start_date_idx on courses (start_date);

drop trigger if exists courses_set_updated_at on courses;
create trigger courses_set_updated_at
  before update on courses
  for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- bookings
-- ════════════════════════════════════════════════════════════════════
create table if not exists bookings (
  id              uuid primary key default gen_random_uuid(),
  course_id       uuid references courses (id) on delete set null,
  customer_name   text not null,
  customer_email  text not null,
  customer_phone  text not null,
  message         text,
  booking_status  booking_status not null default 'new',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists bookings_course_idx on bookings (course_id);
create index if not exists bookings_status_idx on bookings (booking_status);
create index if not exists bookings_created_idx on bookings (created_at desc);

drop trigger if exists bookings_set_updated_at on bookings;
create trigger bookings_set_updated_at
  before update on bookings
  for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- enquiries (contact form submissions)
-- ════════════════════════════════════════════════════════════════════
create table if not exists enquiries (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  phone        text,
  enquiry_type text not null default 'general',
  message      text not null,
  handled      boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists enquiries_created_idx on enquiries (created_at desc);

-- ════════════════════════════════════════════════════════════════════
-- admin_users  (row per authorised admin; id == auth.users.id)
-- ════════════════════════════════════════════════════════════════════
create table if not exists admin_users (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null unique,
  role       text not null default 'admin',
  created_at timestamptz not null default now()
);

-- Is the current authenticated user an admin?
create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from admin_users where id = auth.uid());
$$;

-- ════════════════════════════════════════════════════════════════════
-- Row Level Security
-- ════════════════════════════════════════════════════════════════════
alter table courses     enable row level security;
alter table bookings    enable row level security;
alter table enquiries   enable row level security;
alter table admin_users enable row level security;

-- courses: anyone may read published / fully-booked courses ----------
drop policy if exists "courses public read" on courses;
create policy "courses public read" on courses
  for select using (status in ('published', 'fully_booked'));

drop policy if exists "courses admin all" on courses;
create policy "courses admin all" on courses
  for all using (is_admin()) with check (is_admin());

-- bookings: anyone may create; only admins may read / change ---------
drop policy if exists "bookings public insert" on bookings;
create policy "bookings public insert" on bookings
  for insert with check (true);

drop policy if exists "bookings admin read" on bookings;
create policy "bookings admin read" on bookings
  for select using (is_admin());

drop policy if exists "bookings admin update" on bookings;
create policy "bookings admin update" on bookings
  for update using (is_admin()) with check (is_admin());

drop policy if exists "bookings admin delete" on bookings;
create policy "bookings admin delete" on bookings
  for delete using (is_admin());

-- enquiries: anyone may create; only admins may read ----------------
drop policy if exists "enquiries public insert" on enquiries;
create policy "enquiries public insert" on enquiries
  for insert with check (true);

drop policy if exists "enquiries admin read" on enquiries;
create policy "enquiries admin read" on enquiries
  for select using (is_admin());

-- admin_users: an admin may read the admin list ---------------------
drop policy if exists "admin_users admin read" on admin_users;
create policy "admin_users admin read" on admin_users
  for select using (is_admin());

-- ════════════════════════════════════════════════════════════════════
-- Keep available_spaces / status in sync as bookings come in
-- ════════════════════════════════════════════════════════════════════
create or replace function apply_booking_to_course()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (tg_op = 'INSERT' and new.booking_status <> 'cancelled') then
    update courses
       set available_spaces = greatest(available_spaces - 1, 0)
     where id = new.course_id;

    update courses
       set status = 'fully_booked'
     where id = new.course_id
       and available_spaces = 0
       and status = 'published';
  end if;
  return new;
end $$;

drop trigger if exists bookings_apply_to_course on bookings;
create trigger bookings_apply_to_course
  after insert on bookings
  for each row execute function apply_booking_to_course();

-- ── Storage bucket for course images (optional) ─────────────────────
insert into storage.buckets (id, name, public)
values ('course-images', 'course-images', true)
on conflict (id) do nothing;
