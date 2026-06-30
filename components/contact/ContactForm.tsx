'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { CheckCircle2, Send } from 'lucide-react';
import { Field, Input, Textarea, Select } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { ENQUIRY_TYPES } from '@/lib/constants';
import {
  createEnquiryAction,
  type EnquiryFormState,
} from '@/app/(site)/contact/actions';

const initialState: EnquiryFormState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? 'Sending…' : 'Send Enquiry'}
      {!pending && <Send className="h-4 w-4" />}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState(createEnquiryAction, initialState);

  if (state.status === 'success') {
    return (
      <div className="rounded-3xl border border-ink-100 bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-ink-900">
          Thanks{state.name ? `, ${state.name.split(' ')[0]}` : ''} — message sent
        </h2>
        <p className="mt-2 text-ink-500">
          We’ve received your enquiry and will get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          htmlFor="name"
          required
          error={state.errors?.name}
        >
          <Input id="name" name="name" autoComplete="name" placeholder="Jordan Taylor" required />
        </Field>
        <Field
          label="Email"
          htmlFor="email"
          required
          error={state.errors?.email}
        >
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            required
          />
        </Field>
        <Field label="Phone" htmlFor="phone" hint="Optional" error={state.errors?.phone}>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="07700 900000" />
        </Field>
        <Field
          label="Enquiry type"
          htmlFor="enquiry_type"
          required
          error={state.errors?.enquiry_type}
        >
          <Select id="enquiry_type" name="enquiry_type" defaultValue="general" required>
            {ENQUIRY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Message"
          htmlFor="message"
          required
          error={state.errors?.message}
          className="sm:col-span-2"
        >
          <Textarea
            id="message"
            name="message"
            placeholder="How can we help? Let us know which course you’re interested in…"
            required
          />
        </Field>
      </div>

      {state.status === 'error' && state.message ? (
        <p className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200">
          {state.message}
        </p>
      ) : null}

      <div className="mt-7">
        <SubmitButton />
      </div>
    </form>
  );
}
