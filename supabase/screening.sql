-- ════════════════════════════════════════════════════════════════════
-- 3Sixty Protect — Vetting & Screening module (BS 7858 workflow)
-- Run in the Supabase SQL editor AFTER schema.sql. Safe to re-run.
--
-- Design notes
--  • Every screening record carries case_id, timestamps and created_by /
--    updated_by so the file is fully attributable.
--  • `source` records who supplied a value (admin, candidate, referee or the
--    system). Candidate / referee supplied data is never treated as verified
--    until an administrator verifies it.
--  • screening_audit_events is append-only: a trigger rejects UPDATE/DELETE
--    even for the service role.
--  • Evidence files live in the PRIVATE `screening-evidence` bucket and are
--    only ever served through the authenticated application route.
-- ════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- Shared helpers (also defined in schema.sql; re-declared so this file
-- stands alone).
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from admin_users where id = auth.uid());
$$;

-- ── Granular admin permissions (unioned with role capabilities in code) ──
alter table admin_users add column if not exists permissions text[] not null default '{}';

-- ── Enums ────────────────────────────────────────────────────────────
do $$ begin
  create type screening_case_status as enum (
    'not_started', 'candidate_info_required', 'in_progress', 'awaiting_reference',
    'verification_required', 'discrepancy', 'ready_for_review', 'completed',
    'withdrawn', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type screening_stage as enum (
    'personal', 'identity', 'right_to_work', 'addresses', 'activity', 'references',
    'sia', 'checks', 'issues', 'review', 'complete');
exception when duplicate_object then null; end $$;

do $$ begin
  create type screening_record_source as enum ('admin', 'candidate', 'system', 'referee');
exception when duplicate_object then null; end $$;

do $$ begin
  create type screening_verification_status as enum (
    'candidate_supplied', 'verification_required', 'verified', 'unable_to_verify', 'discrepancy');
exception when duplicate_object then null; end $$;

do $$ begin
  create type screening_identity_status as enum (
    'not_supplied', 'supplied', 'verification_required', 'verified', 'failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type screening_rtw_status as enum ('outstanding', 'verified', 'time_limited', 'failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type screening_reference_status as enum (
    'not_requested', 'requested', 'awaiting_response', 'received',
    'source_verification_required', 'verified', 'unable_to_verify', 'discrepancy');
exception when duplicate_object then null; end $$;

do $$ begin
  create type screening_sia_status as enum (
    'awaiting_check', 'valid', 'expired', 'suspended', 'revoked', 'unable_to_verify');
exception when duplicate_object then null; end $$;

do $$ begin
  create type screening_check_status as enum ('not_required', 'pending', 'complete', 'verified', 'failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type screening_issue_status as enum (
    'open', 'awaiting_candidate', 'awaiting_third_party', 'under_review', 'resolved', 'accepted_risk');
exception when duplicate_object then null; end $$;

do $$ begin
  create type screening_issue_severity as enum ('low', 'medium', 'high');
exception when duplicate_object then null; end $$;

do $$ begin
  create type screening_issue_type as enum (
    'employment_gap', 'address_gap', 'conflicting_dates', 'reference_discrepancy',
    'unable_to_verify_employer', 'missing_documentation', 'identity_discrepancy',
    'right_to_work_issue', 'expired_document', 'sia_issue', 'other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type screening_activity_category as enum (
    'employment', 'self_employment', 'education', 'unemployment', 'job_seeking',
    'government_benefits', 'travelling', 'career_break', 'overseas', 'other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type screening_review_decision as enum (
    'complete', 'further_information_required', 'escalate', 'withdrawn', 'reject');
exception when duplicate_object then null; end $$;

-- ── Screening reference numbers: 3SP-VET-000001 … ───────────────────
create sequence if not exists screening_reference_seq start 1;

-- ════════════════════════════════════════════════════════════════════
-- screening_candidates — the person being screened (personal details)
-- ════════════════════════════════════════════════════════════════════
create table if not exists screening_candidates (
  id                 uuid primary key default gen_random_uuid(),
  legal_name         text not null,
  previous_names     text,
  date_of_birth      date,
  nationality        text,
  email              text,
  telephone          text,
  ni_number          text,
  address_line_1     text,
  address_line_2     text,
  town               text,
  postcode           text,
  country            text,
  sia_licence_number text,
  linked_booking_id  uuid references bookings (id) on delete set null,
  source             screening_record_source not null default 'admin',
  created_by         uuid references admin_users (id) on delete set null,
  updated_by         uuid references admin_users (id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

drop trigger if exists screening_candidates_set_updated_at on screening_candidates;
create trigger screening_candidates_set_updated_at
  before update on screening_candidates for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- screening_cases — one screening workflow run for a candidate
-- ════════════════════════════════════════════════════════════════════
create table if not exists screening_cases (
  id                        uuid primary key default gen_random_uuid(),
  reference                 text not null unique
                              default ('3SP-VET-' || lpad(nextval('screening_reference_seq')::text, 6, '0')),
  candidate_id              uuid not null references screening_candidates (id) on delete restrict,
  workflow                  text not null default 'bs7858',
  status                    screening_case_status not null default 'not_started',
  current_stage             screening_stage not null default 'personal',
  proposed_role             text,
  sia_licence_type          text,
  proposed_start_date       date,
  screening_start_date      date not null default current_date,
  assigned_to               uuid,
  -- Policy snapshot: the history period this case is screened against.
  screening_period_years    integer not null default 5 check (screening_period_years between 1 and 20),
  -- Stored summary (recomputed by the app after every change) so the queue
  -- can filter and sort without evaluating every case.
  progress_percent          integer not null default 0 check (progress_percent between 0 and 100),
  outstanding_count         integer not null default 0,
  awaiting_candidate_count  integer not null default 0,
  awaiting_third_party_count integer not null default 0,
  open_issue_count          integer not null default 0,
  unverified_period_count   integer not null default 0,
  locked                    boolean not null default false,
  completed_at              timestamptz,
  decision                  screening_review_decision,
  decision_at               timestamptz,
  reviewed_by               uuid,
  withdrawn_reason          text,
  created_by                uuid,
  updated_by                uuid,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  constraint screening_cases_assigned_to_fkey foreign key (assigned_to) references admin_users (id) on delete set null,
  constraint screening_cases_reviewed_by_fkey foreign key (reviewed_by) references admin_users (id) on delete set null,
  constraint screening_cases_created_by_fkey foreign key (created_by) references admin_users (id) on delete set null,
  constraint screening_cases_updated_by_fkey foreign key (updated_by) references admin_users (id) on delete set null
);

create index if not exists screening_cases_status_idx on screening_cases (status);
create index if not exists screening_cases_assigned_idx on screening_cases (assigned_to);
create index if not exists screening_cases_candidate_idx on screening_cases (candidate_id);
create index if not exists screening_cases_started_idx on screening_cases (screening_start_date);

drop trigger if exists screening_cases_set_updated_at on screening_cases;
create trigger screening_cases_set_updated_at
  before update on screening_cases for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- screening_addresses — chronological address history
-- ════════════════════════════════════════════════════════════════════
create table if not exists screening_addresses (
  id                  uuid primary key default gen_random_uuid(),
  case_id             uuid not null references screening_cases (id) on delete cascade,
  address_line_1      text not null,
  address_line_2      text,
  town                text,
  postcode            text,
  country             text,
  from_date           date not null,
  to_date             date,
  is_current          boolean not null default false,
  verification_status screening_verification_status not null default 'candidate_supplied',
  verification_method text,
  verified_by         uuid references admin_users (id) on delete set null,
  verified_at         date,
  notes               text,
  source              screening_record_source not null default 'admin',
  created_by          uuid references admin_users (id) on delete set null,
  updated_by          uuid references admin_users (id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  check (to_date is null or to_date >= from_date)
);
create index if not exists screening_addresses_case_idx on screening_addresses (case_id, from_date);
drop trigger if exists screening_addresses_set_updated_at on screening_addresses;
create trigger screening_addresses_set_updated_at
  before update on screening_addresses for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- screening_activities — employment / activity history
-- ════════════════════════════════════════════════════════════════════
create table if not exists screening_activities (
  id                  uuid primary key default gen_random_uuid(),
  case_id             uuid not null references screening_cases (id) on delete cascade,
  category            screening_activity_category not null,
  organisation        text not null,
  position            text,
  address             text,
  contact_name        text,
  contact_email       text,
  contact_telephone   text,
  from_date           date not null,
  to_date             date,
  reason_for_leaving  text,
  requires_reference  boolean not null default false,
  verification_status screening_verification_status not null default 'candidate_supplied',
  verification_method text,
  verified_by         uuid references admin_users (id) on delete set null,
  verified_at         date,
  notes               text,
  source              screening_record_source not null default 'admin',
  created_by          uuid references admin_users (id) on delete set null,
  updated_by          uuid references admin_users (id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  check (to_date is null or to_date >= from_date)
);
create index if not exists screening_activities_case_idx on screening_activities (case_id, from_date);
drop trigger if exists screening_activities_set_updated_at on screening_activities;
create trigger screening_activities_set_updated_at
  before update on screening_activities for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- screening_references — verification of a period with a third party
-- ════════════════════════════════════════════════════════════════════
create table if not exists screening_references (
  id                          uuid primary key default gen_random_uuid(),
  case_id                     uuid not null references screening_cases (id) on delete cascade,
  activity_id                 uuid references screening_activities (id) on delete set null,
  organisation                text not null,
  contact_name                text,
  contact_position            text,
  email                       text,
  telephone                   text,
  status                      screening_reference_status not null default 'not_requested',
  requested_at                date,
  received_at                 date,
  method                      text,
  source_verified             boolean not null default false,
  source_verification_method  text,
  verified_by                 uuid references admin_users (id) on delete set null,
  verified_at                 date,
  notes                       text,
  -- Reserved for the future referee portal (secure one-time link).
  request_token               uuid,
  request_token_expires_at    timestamptz,
  response                    jsonb,
  source                      screening_record_source not null default 'admin',
  created_by                  uuid references admin_users (id) on delete set null,
  updated_by                  uuid references admin_users (id) on delete set null,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);
create index if not exists screening_references_case_idx on screening_references (case_id);
create index if not exists screening_references_activity_idx on screening_references (activity_id);
drop trigger if exists screening_references_set_updated_at on screening_references;
create trigger screening_references_set_updated_at
  before update on screening_references for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- screening_identity_documents
-- ════════════════════════════════════════════════════════════════════
create table if not exists screening_identity_documents (
  id                  uuid primary key default gen_random_uuid(),
  case_id             uuid not null references screening_cases (id) on delete cascade,
  document_type       text not null,
  document_number     text,
  issue_date          date,
  expiry_date         date,
  issuing_country     text,
  status              screening_identity_status not null default 'not_supplied',
  verification_method text,
  checked_by          uuid references admin_users (id) on delete set null,
  checked_at          date,
  notes               text,
  source              screening_record_source not null default 'admin',
  created_by          uuid references admin_users (id) on delete set null,
  updated_by          uuid references admin_users (id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists screening_identity_documents_case_idx on screening_identity_documents (case_id);
drop trigger if exists screening_identity_documents_set_updated_at on screening_identity_documents;
create trigger screening_identity_documents_set_updated_at
  before update on screening_identity_documents for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- screening_right_to_work — one check record per case
-- ════════════════════════════════════════════════════════════════════
create table if not exists screening_right_to_work (
  id            uuid primary key default gen_random_uuid(),
  case_id       uuid not null unique references screening_cases (id) on delete cascade,
  check_type    text,
  status        screening_rtw_status not null default 'outstanding',
  checked_at    date,
  checked_by    uuid references admin_users (id) on delete set null,
  expiry_date   date,
  share_code    text,
  restrictions  text,
  notes         text,
  source        screening_record_source not null default 'admin',
  created_by    uuid references admin_users (id) on delete set null,
  updated_by    uuid references admin_users (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
drop trigger if exists screening_right_to_work_set_updated_at on screening_right_to_work;
create trigger screening_right_to_work_set_updated_at
  before update on screening_right_to_work for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- screening_sia_checks — one SIA licence check record per case
-- (structured so an automated register check can populate it later)
-- ════════════════════════════════════════════════════════════════════
create table if not exists screening_sia_checks (
  id              uuid primary key default gen_random_uuid(),
  case_id         uuid not null unique references screening_cases (id) on delete cascade,
  licence_number  text,
  licence_holder  text,
  licence_type    text,
  status          screening_sia_status not null default 'awaiting_check',
  issue_date      date,
  expiry_date     date,
  checked_at      date,
  checked_by      uuid references admin_users (id) on delete set null,
  check_method    text,
  result_notes    text,
  source          screening_record_source not null default 'admin',
  created_by      uuid references admin_users (id) on delete set null,
  updated_by      uuid references admin_users (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
drop trigger if exists screening_sia_checks_set_updated_at on screening_sia_checks;
create trigger screening_sia_checks_set_updated_at
  before update on screening_sia_checks for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- screening_checks — extensible additional checks
-- ════════════════════════════════════════════════════════════════════
create table if not exists screening_checks (
  id          uuid primary key default gen_random_uuid(),
  case_id     uuid not null references screening_cases (id) on delete cascade,
  check_key   text not null,
  label       text not null,
  required    boolean not null default true,
  status      screening_check_status not null default 'pending',
  notes       text,
  checked_by  uuid references admin_users (id) on delete set null,
  checked_at  date,
  sort_order  integer not null default 0,
  created_by  uuid references admin_users (id) on delete set null,
  updated_by  uuid references admin_users (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (case_id, check_key)
);
create index if not exists screening_checks_case_idx on screening_checks (case_id);
drop trigger if exists screening_checks_set_updated_at on screening_checks;
create trigger screening_checks_set_updated_at
  before update on screening_checks for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- screening_issues — discrepancies raised by the system or an admin
-- ════════════════════════════════════════════════════════════════════
create table if not exists screening_issues (
  id                     uuid primary key default gen_random_uuid(),
  case_id                uuid not null references screening_cases (id) on delete cascade,
  issue_type             screening_issue_type not null,
  title                  text not null,
  description            text,
  severity               screening_issue_severity not null default 'medium',
  status                 screening_issue_status not null default 'open',
  section                screening_stage,
  related_record_id      uuid,
  period_from            date,
  period_to              date,
  raised_by              uuid references admin_users (id) on delete set null,
  raised_at              timestamptz not null default now(),
  assigned_to            uuid references admin_users (id) on delete set null,
  candidate_explanation  text,
  resolution             text,
  resolved_at            timestamptz,
  resolved_by            uuid references admin_users (id) on delete set null,
  source                 screening_record_source not null default 'admin',
  -- Stable identity for system-raised issues (e.g. "address_gap:2023-04-01:2023-05-17")
  fingerprint            text,
  created_by             uuid references admin_users (id) on delete set null,
  updated_by             uuid references admin_users (id) on delete set null,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create index if not exists screening_issues_case_idx on screening_issues (case_id, status);
create unique index if not exists screening_issues_fingerprint_idx
  on screening_issues (case_id, fingerprint) where fingerprint is not null;
drop trigger if exists screening_issues_set_updated_at on screening_issues;
create trigger screening_issues_set_updated_at
  before update on screening_issues for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- screening_evidence — metadata for files in the private bucket
-- ════════════════════════════════════════════════════════════════════
create table if not exists screening_evidence (
  id                   uuid primary key default gen_random_uuid(),
  case_id              uuid not null references screening_cases (id) on delete cascade,
  category             text not null,
  section              screening_stage,
  related_record_type  text,
  related_record_id    uuid,
  file_name            text not null,
  storage_path         text not null unique,
  mime_type            text,
  size_bytes           bigint,
  description          text,
  uploaded_by          uuid references admin_users (id) on delete set null,
  uploaded_at          timestamptz not null default now(),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index if not exists screening_evidence_case_idx on screening_evidence (case_id);
drop trigger if exists screening_evidence_set_updated_at on screening_evidence;
create trigger screening_evidence_set_updated_at
  before update on screening_evidence for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- screening_reviews — each recorded reviewer decision (incl. reopen history)
-- ════════════════════════════════════════════════════════════════════
create table if not exists screening_reviews (
  id              uuid primary key default gen_random_uuid(),
  case_id         uuid not null references screening_cases (id) on delete cascade,
  reviewer_id     uuid references admin_users (id) on delete set null,
  reviewer_email  text,
  decision        screening_review_decision not null,
  comments        text,
  acknowledged    boolean not null default false,
  reviewed_at     timestamptz not null default now(),
  created_at      timestamptz not null default now()
);
create index if not exists screening_reviews_case_idx on screening_reviews (case_id);

-- ════════════════════════════════════════════════════════════════════
-- screening_audit_events — append-only
-- ════════════════════════════════════════════════════════════════════
create table if not exists screening_audit_events (
  id              uuid primary key default gen_random_uuid(),
  case_id         uuid not null references screening_cases (id) on delete restrict,
  actor_id        uuid references admin_users (id) on delete set null,
  actor_email     text,
  action          text not null,
  section         screening_stage,
  record_type     text,
  record_id       uuid,
  previous_state  jsonb,
  new_state       jsonb,
  notes           text,
  created_at      timestamptz not null default now()
);
create index if not exists screening_audit_events_case_idx on screening_audit_events (case_id, created_at desc);

create or replace function screening_audit_immutable()
returns trigger language plpgsql as $$
begin
  raise exception 'screening_audit_events is append-only';
end $$;

drop trigger if exists screening_audit_no_mutation on screening_audit_events;
create trigger screening_audit_no_mutation
  before update or delete on screening_audit_events
  for each row execute function screening_audit_immutable();

-- ════════════════════════════════════════════════════════════════════
-- Row Level Security — admins only. Finer role checks are enforced
-- server-side in the application (see lib/permissions.ts).
-- ════════════════════════════════════════════════════════════════════
alter table screening_candidates         enable row level security;
alter table screening_cases              enable row level security;
alter table screening_addresses          enable row level security;
alter table screening_activities         enable row level security;
alter table screening_references         enable row level security;
alter table screening_identity_documents enable row level security;
alter table screening_right_to_work      enable row level security;
alter table screening_sia_checks         enable row level security;
alter table screening_checks             enable row level security;
alter table screening_issues             enable row level security;
alter table screening_evidence           enable row level security;
alter table screening_reviews            enable row level security;
alter table screening_audit_events       enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'screening_candidates', 'screening_cases', 'screening_addresses',
    'screening_activities', 'screening_references', 'screening_identity_documents',
    'screening_right_to_work', 'screening_sia_checks', 'screening_checks',
    'screening_issues', 'screening_evidence', 'screening_reviews']
  loop
    execute format('drop policy if exists "%s admin all" on %I', t, t);
    execute format(
      'create policy "%s admin all" on %I for all using (is_admin()) with check (is_admin())', t, t);
  end loop;
end $$;

drop policy if exists "screening_audit_events admin read" on screening_audit_events;
create policy "screening_audit_events admin read" on screening_audit_events
  for select using (is_admin());
drop policy if exists "screening_audit_events admin insert" on screening_audit_events;
create policy "screening_audit_events admin insert" on screening_audit_events
  for insert with check (is_admin());

-- ── Private evidence bucket (no public access; served via the app) ────
insert into storage.buckets (id, name, public, file_size_limit)
values ('screening-evidence', 'screening-evidence', false, 10485760)
on conflict (id) do nothing;
