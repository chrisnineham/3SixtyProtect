'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { DEPOSIT_PERCENT, depositAmount, balanceAmount } from '@/lib/payments';
import type { Course } from '@/lib/types';

const initialState: BookingFormState = { status: 'idle' };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? 'Submitting…' : label}
      {!pending && <ArrowRight className="h-4 w-4" />}
    </Button>
  );
}

export function BookingForm({
  courses,
  initialCourseId,
  paymentEnabled = false,
}: {
  courses: Course[];
  initialCourseId?: string;
  paymentEnabled?: boolean;
}) {
  const [state, formAction] = useFormState(createBookingAction, initialState);

  // When the action returns a Stripe Checkout URL, send the browser there.
  useEffect(() => {
    if (state.status === 'redirect' && state.url) {
      window.location.href = state.url;
    }
  }, [state]);

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
        <div className="border border-ink-950 bg-background p-6 sm:p-8">
          {/* 1 — choose course */}
          <fieldset>
            <legend className="flex items-baseline gap-3 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-400">
              <span>01 /</span>
              <span className="text-ink-900">Choose your course</span>
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
                          {formatDateRange(c.start_date, c.end_date)}, {c.location}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {grouped.close_protection.length > 0 && (
                    <optgroup label="SIA Close Protection">
                      {grouped.close_protection.map((c) => (
                        <option key={c.id} value={c.id}>
                          {formatDateRange(c.start_date, c.end_date)}, {c.location}
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
            <legend className="flex items-baseline gap-3 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-400">
              <span>02 /</span>
              <span className="text-ink-900">Your details</span>
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
                hint="Optional: only if you’re flexible on dates."
                error={state.errors?.preferred_date}
                className="sm:col-span-2"
              >
                <Input id="preferred_date" name="preferred_date" type="date" />
              </Field>
              <Field
                label="Message or special requirements"
                htmlFor="message"
                hint="Optional: let us know anything we should be aware of."
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
            <p className="mt-6 border border-error px-4 py-3 text-sm font-medium text-error">
              {state.message}
            </p>
          ) : null}

          <div className="mt-7">
            <SubmitButton
              label={paymentEnabled ? 'Continue to Secure Payment' : 'Confirm Booking'}
            />
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center font-mono text-[12px] uppercase tracking-[0.05em] text-ink-400">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              {paymentEnabled
                ? `A ${DEPOSIT_PERCENT}% deposit secures your place. Balance due before the course.`
                : 'No payment is taken now. We’ll confirm your place by email.'}
            </p>
          </div>
        </div>
      </form>

      {/* Summary */}
      <div className="lg:col-span-5">
        <div className="sticky top-24 space-y-6">
          <div className="border border-ink-950 bg-background">
            <div className="bg-ink-950 px-5 py-3 font-mono text-[12px] uppercase tracking-[0.1em] text-white">
              Booking summary
            </div>
            <div className="p-6">
              {selected ? (
                <>
                  <Badge tone="gold">
                    {COURSE_TYPE_META[selected.course_type].shortLabel}
                  </Badge>
                  <h3 className="mt-3 font-heading text-xl uppercase tracking-tight text-ink-900">
                    {selected.title}
                  </h3>
                  <dl className="mt-4 space-y-2.5 text-sm text-ink-800">
                    <div className="flex items-center gap-2.5">
                      <CalendarDays className="h-4 w-4 text-ink-500" />
                      {formatDateRange(selected.start_date, selected.end_date)}
                    </div>
                    {(selected.start_time || selected.end_time) && (
                      <div className="flex items-center gap-2.5">
                        <Clock className="h-4 w-4 text-ink-500" />
                        {formatTimeRange(selected.start_time, selected.end_time)}
                      </div>
                    )}
                    <div className="flex items-center gap-2.5">
                      <MapPin className="h-4 w-4 text-ink-500" />
                      {selected.location}
                    </div>
                  </dl>
                  <div className="mt-5 space-y-3 border-t border-ink-950 pt-4">
                    <div className="flex items-end justify-between">
                      <span className="font-mono text-[12px] uppercase tracking-[0.05em] text-ink-500">
                        Course fee
                      </span>
                      <span className="font-heading text-headline-md text-ink-900">
                        {formatPrice(selected.price)}
                      </span>
                    </div>
                    {paymentEnabled && (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-ink-600">
                            Deposit due today ({DEPOSIT_PERCENT}%)
                          </span>
                          <span className="font-semibold text-ink-900">
                            {formatPrice(depositAmount(selected.price))}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-ink-600">
                            Balance before course
                          </span>
                          <span className="font-semibold text-ink-900">
                            {formatPrice(balanceAmount(selected.price))}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-4 text-center text-sm text-ink-500">
                  <ShieldCheck className="mx-auto h-8 w-8 text-ink-400" />
                  <p className="mt-3">
                    Select a course to see the details and fee here.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border border-ink-950 bg-background p-6">
            <h3 className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-900">
              What happens next?
            </h3>
            <ol className="mt-4 space-y-3 text-sm text-ink-800">
              {[
                'We receive your booking instantly.',
                'Our team confirms your place by email.',
                'You’ll get joining details and what to bring.',
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="font-mono text-ink-400">
                    {String(i + 1).padStart(2, '0')}
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
      <div className="border border-ink-950 bg-background">
        <div className="bg-ink-950 px-8 py-12 text-center text-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center border border-white">
            <CheckCircle2 className="h-9 w-9 text-white" />
          </div>
          <h1 className="mt-5 font-heading text-headline-md uppercase tracking-tight text-white md:text-display-lg">
            Booking received
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-ink-200">
            Thank you{state.summary ? `, ${state.summary.name.split(' ')[0]}` : ''}.
            Your place is reserved.
          </p>
          {state.reference ? (
            <div className="mt-5 inline-flex items-center gap-2 border border-white/40 px-4 py-2 font-mono text-[12px] uppercase tracking-[0.05em]">
              <span className="text-ink-300">Reference</span>
              <span className="font-semibold text-white">{state.reference}</span>
            </div>
          ) : null}
        </div>

        <div className="p-8">
          {state.summary ? (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="font-mono text-[12px] uppercase tracking-[0.05em] text-ink-500">Course</dt>
                <dd className="text-right font-semibold text-ink-900">
                  {state.summary.courseTitle}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-mono text-[12px] uppercase tracking-[0.05em] text-ink-500">Name</dt>
                <dd className="font-semibold text-ink-900">{state.summary.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-mono text-[12px] uppercase tracking-[0.05em] text-ink-500">Confirmation to</dt>
                <dd className="font-semibold text-ink-900">{state.summary.email}</dd>
              </div>
            </dl>
          ) : null}

          <div className="mt-6 flex items-start gap-3 border border-ink-950 p-4 text-sm text-ink-800">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-ink-500" />
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
        <Link href="/contact" className="font-semibold text-ink-900 underline underline-offset-4">
          Contact us
        </Link>
      </p>
    </div>
  );
}
