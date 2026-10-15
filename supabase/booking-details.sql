-- ════════════════════════════════════════════════════════════════════
-- 3Sixty Protect: pay-online bookings
-- Run in the Supabase SQL editor (project dfgevxndlxdyjzdqjajk). Safe to re-run.
--
-- Adds the delegate's personal details and full-payment tracking to bookings.
-- payment_status values: unpaid | paid | deposit_paid (older bookings) | expired
-- ════════════════════════════════════════════════════════════════════

alter table bookings add column if not exists date_of_birth           date;
alter table bookings add column if not exists address_line_1          text;
alter table bookings add column if not exists address_line_2          text;
alter table bookings add column if not exists town                    text;
alter table bookings add column if not exists postcode                text;
alter table bookings add column if not exists emergency_contact_name  text;
alter table bookings add column if not exists emergency_contact_phone text;
alter table bookings add column if not exists amount_paid             numeric(10,2);
alter table bookings add column if not exists paid_at                 timestamptz;
alter table bookings add column if not exists terms_accepted_at       timestamptz;

create index if not exists bookings_payment_status_idx on bookings (payment_status);
