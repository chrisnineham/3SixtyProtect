import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Mail, CalendarClock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getStripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { isServiceRoleConfigured } from '@/lib/supabase/config';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Booking confirmed',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  const stripe = getStripe();

  let paid = false;
  let reference = '';
  let courseTitle = '';
  let customerEmail = '';
  let depositPaid = 0;
  let balance = 0;

  if (stripe && sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const m = session.metadata ?? {};
      paid = session.payment_status === 'paid';
      reference = m.reference ?? '';
      courseTitle = m.courseTitle ?? '';
      customerEmail =
        session.customer_details?.email ?? session.customer_email ?? '';
      depositPaid = (session.amount_total ?? 0) / 100;
      balance = Math.max(0, Number(m.fee ?? 0) - depositPaid);

      // Safety net: reconcile the booking here too, in case the webhook
      // isn't configured yet. Idempotent.
      if (paid && m.bookingId && isServiceRoleConfigured()) {
        const supabase = createAdminClient();
        await supabase
          .from('bookings')
          .update({
            payment_status: 'deposit_paid',
            stripe_session_id: session.id,
          })
          .eq('id', m.bookingId);
      }
    } catch (err) {
      console.error('[book/success] retrieve session failed:', err);
    }
  }

  return (
    <section className="section">
      <div className="container">
        {paid ? (
          <div className="mx-auto max-w-2xl">
            <div className="border border-ink-950 bg-background">
              <div className="bg-ink-950 px-8 py-12 text-center text-white">
                <div className="mx-auto flex h-16 w-16 items-center justify-center border border-white">
                  <CheckCircle2 className="h-9 w-9 text-white" />
                </div>
                <h1 className="mt-5 font-heading text-headline-md uppercase tracking-tight text-white md:text-display-lg">
                  Deposit paid — place reserved
                </h1>
                <p className="mt-3 text-lg leading-relaxed text-ink-200">
                  Thank you. Your deposit has been received and your place is
                  secured.
                </p>
                {reference ? (
                  <div className="mt-5 inline-flex items-center gap-2 border border-white/40 px-4 py-2 font-mono text-[12px] uppercase tracking-[0.05em]">
                    <span className="text-ink-300">Reference</span>
                    <span className="font-semibold text-white">{reference}</span>
                  </div>
                ) : null}
              </div>

              <div className="p-8">
                <dl className="space-y-3 text-sm">
                  {courseTitle ? (
                    <div className="flex justify-between gap-4">
                      <dt className="font-mono text-[12px] uppercase tracking-[0.05em] text-ink-500">
                        Course
                      </dt>
                      <dd className="text-right font-semibold text-ink-900">
                        {courseTitle}
                      </dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between gap-4">
                    <dt className="font-mono text-[12px] uppercase tracking-[0.05em] text-ink-500">
                      Deposit paid
                    </dt>
                    <dd className="font-semibold text-ink-900">
                      {formatPrice(depositPaid)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-mono text-[12px] uppercase tracking-[0.05em] text-ink-500">
                      Balance due before course
                    </dt>
                    <dd className="font-semibold text-ink-900">
                      {formatPrice(balance)}
                    </dd>
                  </div>
                  {customerEmail ? (
                    <div className="flex justify-between gap-4">
                      <dt className="font-mono text-[12px] uppercase tracking-[0.05em] text-ink-500">
                        Receipt to
                      </dt>
                      <dd className="font-semibold text-ink-900">
                        {customerEmail}
                      </dd>
                    </div>
                  ) : null}
                </dl>

                <div className="mt-6 flex items-start gap-3 border border-ink-950 p-4 text-sm text-ink-800">
                  <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-ink-500" />
                  <p>
                    Our team will email your joining instructions and arrange the
                    remaining balance ({formatPrice(balance)}) before your course
                    start date.
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
              Questions about your booking?{' '}
              <Link
                href="/contact"
                className="font-semibold text-ink-900 underline underline-offset-4"
              >
                Contact us
              </Link>
            </p>
          </div>
        ) : (
          <div className="mx-auto flex max-w-xl flex-col items-center border border-ink-950 bg-background px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center border border-ink-950 text-ink-800">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h1 className="mt-5 font-heading text-headline-md uppercase tracking-tight text-ink-900">
              We couldn’t confirm your payment
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-ink-500">
              If you completed payment, it may still be processing — you’ll get an
              email shortly. If you didn’t, you can start your booking again.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="/book">Try booking again</Button>
              <Button href="/contact" variant="outline">
                <Mail className="h-4 w-4" />
                Contact us
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
