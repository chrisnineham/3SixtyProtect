// ─────────────────────────────────────────────────────────────
// Deposit configuration for course bookings.
// A percentage of the course fee is taken at booking time via
// Stripe Checkout; the balance is collected later.
// Shared by client (booking summary) and server (checkout).
// ─────────────────────────────────────────────────────────────

import type { PaymentStatus } from './types';

/** How a booking's payment status is shown in the admin. */
export const PAYMENT_STATUS_META: Record<PaymentStatus, { label: string; tone: 'neutral' | 'success' | 'warning' | 'danger' }> = {
  paid: { label: 'Paid', tone: 'success' },
  deposit_paid: { label: 'Deposit paid', tone: 'success' },
  unpaid: { label: 'Awaiting payment', tone: 'warning' },
  expired: { label: 'Payment not completed', tone: 'danger' },
};

/** Deposit taken at booking, as a percentage of the course fee. */
export const DEPOSIT_PERCENT = 20;

/**
 * Deposit due today for a given course fee (GBP), rounded to whole pounds.
 * Never less than £1, never more than the full fee.
 */
export function depositAmount(price: number): number {
  const raw = (price * DEPOSIT_PERCENT) / 100;
  return Math.min(price, Math.max(1, Math.round(raw)));
}

/** Balance remaining after the deposit is paid. */
export function balanceAmount(price: number): number {
  return Math.max(0, price - depositAmount(price));
}
