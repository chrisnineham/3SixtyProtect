'use client';

import { useMemo, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import {
  CalendarDays,
  MapPin,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  Mail,
} from 'lucide-react';
import { Field, Input, Textarea, Select } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { createBookingAction, type BookingFormState } from '@/app/(site)/book/actions';
import { COURSE_TYPE_META } from '@/lib/constants';
import {
  formatDateRange,
  formatPrice,
  formatTimeRange,
} from '@/lib/utils';
import type { Course } from '@/lib/types';

const initialState: BookingFormState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? 'Submitting…' : 'Confirm Booking'}
      {!pending && <ArrowRight className="h-4 w-4" />}
    </Button>
  );
}

export function BookingForm({
  courses,
  initialCourseId,
}: {
  courses: Course[];
  initialCourseId?: string;
}) {
  const [state, formAction] = useFormState(createBookingAction, initialState);
  const [selectedId, setSelectedId] = useState(
    initialCourseId && courses.some((c) => c.id === initialCourseId)
      ? initialCourseId
      : '',
  );

  const selected = useMemo(
    () => courses.find((c) => c.id === selectedId) ?? null,
    [courses, selectedId],
  );

  const grouped = useMemo(() => {
    return {
      door_supervision: courses.filter((c) => c.course_type === 'door_supervision'),
      close_protection: courses.filter((c) => c.course_type === 'close_protection'),
    };
  }, [courses]);

  if (state.status === 'success') {
    return <BookingConfirmation state={state} />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Form */}
      <form action={formAction} className="lg:col-span-7">
        <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
          {/* 1 — choose course */}
          <fieldset>
            <legend className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gold-600">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-100 text-xs text-gold-700">
                1
              </span>
              Choose your course
            </legend>
            <div className="mt-4">
              <Field
                label="Course"
                htmlFor="course_id"
                required
                error={state.errors?.course_id}
              >
                <Select
                  id="course_id"
                  name="course_id"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a course date…
                  </option>
                  {grouped.door_supervision.length > 0 && (
                    <optgroup label="SIA Door Supervision">
                      {grouped.door_supervision.map((c) => (
                        <option key={c.id} value={c.id}>
                          {formatDateRange(c.start_date, c.end_date)} — {c.location}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {grouped.close_protection.length > 0 && (
                    <optgroup label="SIA Close Protection">
                      {grouped.close_protection.map((c) => (
                        <option key={c.id} value={c.id}>
                          {formatDateRange(c.start_date, c.end_date)} — {c.location}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </Select>
              </Field>
            </div>
          </fieldset>

          <div className="my-7 hairline" />

          {/* 2 — your details */}
          <fieldset>
            <legend className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gold-600">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-100 text-xs text-gold-700">
                2
              </span>
              Your details
            </legend>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <Field
                label="Full name"
                htmlFor="customer_name"
                required
                error={state.errors?.customer_name}
                className="sm:col-span-2"
              >
                <Input
                  id="customer_name"
                  name="customer_name"
                  autoComplete="name"
                  placeholder="Jordan Taylor"
                  required
                />
              </Field>
              <Field
                label="Email address"
                htmlFor="customer_email"
                required
                error={state.errors?.customer_email}
              >
                <Input
                  id="customer_email"
                  name="customer_email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  required
                />
              </Field>
              <Field
                label="Phone number"
                htmlFor="customer_phone"
                required
                error={state.errors?.customer_phone}
              >
                <Input
                  id="customer_phone"
                  name="customer_phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="07700 900000"
                  required
                />
              </Field>
              <Field
                label="Preferred course date"
                htmlFor="preferred_date"
                hint="Optional — only if you’re flexible on dates."
                error={state.errors?.preferred_date}
                className="sm:col-span-2"
              >
                <Input id="preferred_date" name="preferred_date" type="date" />
              </Field>
              <Field
                label="Message or special requirements"
                htmlFor="message"
                hint="Optional — let us know anything we should be aware of."
                error={state.errors?.message}
                className="sm:col-span-2"
              >
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Any questions, access requirements or notes…"
                />
              </Field>
            </div>
          </fieldset>

          {state.status === 'error' && state.message ? (
            <p className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200">
              {state.message}
            </p>
          ) : null}

          <div className="mt-7">
            <SubmitButton />
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-400">
              <Lock className="h-3.5 w-3.5" />
              No payment is taken now — we’ll confirm your place by email.
            </p>
          </div>
        </div>
      </form>

      {/* Summary */}
      <div className="lg:col-span-5">
        <div className="sticky top-24 space-y-4">
          <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
            <div className="border-b border-ink-100 bg-ink-50/60 px-6 py-4">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-ink-700">
                Booking summary
              </h2>
            </div>
            <div className="p-6">
              {selected ? (
                <>
                  <Badge tone="gold">
                    {COURSE_TYPE_META[selected.course_type].shortLabel}
                  </Badge>
                  <h3 className="mt-3 text-lg font-bold text-ink-900">
                    {selected.title}
                  </h3>
                  <dl className="mt-4 space-y-2.5 text-sm text-ink-600">
                    <div className="flex items-center gap-2.5">
                      <CalendarDays className="h-4 w-4 text-gold-500" />
                      {formatDateRange(selected.start_date, selected.end_date)}
                    </div>
                    {(selected.start_time || selected.end_time) && (
                      <div className="flex items-center gap-2.5">
                        <Clock className="h-4 w-4 text-gold-500" />
                        {formatTimeRange(selected.start_time, selected.end_time)}
                      </div>
                    )}
                    <div className="flex items-center gap-2.5">
                      <MapPin className="h-4 w-4 text-gold-500" />
                      {selected.location}
                    </div>
                  </dl>
                  <div className="mt-5 flex items-end justify-between border-t border-ink-100 pt-4">
                    <span className="text-sm font-medium text-ink-500">
                      Course fee
                    </span>
                    <span className="text-2xl font-bold text-ink-900">
                      {formatPrice(selected.price)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-4 text-center text-sm text-ink-500">
                  <ShieldCheck className="mx-auto h-8 w-8 text-ink-300" />
                  <p className="mt-3">
                    Select a course to see the details and fee here.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card">
            <h3 className="text-sm font-semibold text-ink-900">
              What happens next?
            </h3>
            <ol className="mt-4 space-y-3 text-sm text-ink-600">
              {[
                'We receive your booking instantly.',
                'Our team confirms your place by email.',
                'You’ll get joining details and what to bring.',
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink-900 text-[0.65rem] font-bold text-gold-400">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingConfirmation({ state }: { state: BookingFormState }) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
        <div className="relative overflow-hidden bg-ink-950 px-8 py-12 text-center text-white">
          <div className="absolute inset-0 spotlight" aria-hidden />
          <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-400/15 ring-1 ring-gold-400/40">
              <CheckCircle2 className="h-9 w-9 text-gold-400" />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
              Booking received
            </h1>
            <p className="mt-2 text-ink-200">
              Thank you{state.summary ? `, ${state.summary.name.split(' ')[0]}` : ''}.
              Your place is reserved.
            </p>
            {state.reference ? (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
                <span className="text-ink-300">Reference</span>
                <span className="font-mono font-semibold text-gold-400">
                  {state.reference}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="p-8">
          {state.summary ? (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Course</dt>
                <dd className="text-right font-semibold text-ink-900">
                  {state.summary.courseTitle}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Name</dt>
                <dd className="font-semibold text-ink-900">{state.summary.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Confirmation to</dt>
                <dd className="font-semibold text-ink-900">{state.summary.email}</dd>
              </div>
            </dl>
          ) : null}

          <div className="mt-6 flex items-start gap-3 rounded-xl bg-gold-50 p-4 text-sm text-ink-700 ring-1 ring-gold-200">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
            <p>
              We’ve logged your booking and our team will be in touch shortly to
              confirm your place and share joining instructions.
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/calendar" variant="outline" className="w-full">
              Browse more courses
            </Button>
            <Button href="/" className="w-full">
              Back to home
            </Button>
          </div>
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-ink-500">
        Need to change something?{' '}
        <Link href="/contact" className="font-semibold text-gold-700 hover:underline">
          Contact us
        </Link>
      </p>
    </div>
  );
}
