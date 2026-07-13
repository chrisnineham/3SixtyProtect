'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Check, Send } from 'lucide-react';
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
      <div className="border border-ink-950 bg-background p-8 text-center sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-ink-950 bg-ink-950 text-white">
          <Check className="h-8 w-8" />
        </div>
        <h2 className="mt-6 font-heading text-headline-md uppercase tracking-tight text-ink-900">
          Thanks{state.name ? `, ${state.name.split(' ')[0]}` : ''}, message sent
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-ink-500">
          We’ve received your enquiry and will get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="flex h-full flex-col border border-ink-950 bg-background p-5 sm:p-6"
    >
      <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.05em] text-ink-500">
        Send an enquiry
      </p>
      <div className="hairline mb-4" />
      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>
      <Field
        label="Message"
        htmlFor="message"
        required
        error={state.errors?.message}
        className="mt-4 flex flex-1 flex-col"
      >
        <Textarea
          id="message"
          name="message"
          className="min-h-[5rem] flex-1"
          placeholder="How can we help? Let us know which course you’re interested in…"
          required
        />
      </Field>

      {state.status === 'error' && state.message ? (
        <p className="mt-6 border border-error px-4 py-3 text-sm font-medium text-error">
          {state.message}
        </p>
      ) : null}

      <div className="mt-5">
        <SubmitButton />
      </div>
    </form>
  );
}
