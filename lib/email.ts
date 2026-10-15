import 'server-only';

import { SITE } from './constants';

/**
 * Staff notification emails, sent through Resend (added to the Vercel project
 * from the Vercel Marketplace, which sets RESEND_API_KEY).
 *
 *  RESEND_API_KEY             required; without it emails are skipped
 *  EMAIL_FROM                 sender on a domain verified in Resend,
 *                             e.g. "3Sixty Protect <notifications@3sixtyprotect.com>"
 *  CONTACT_NOTIFICATION_EMAIL inbox that receives alerts (defaults to SITE.email)
 */
const RESEND_URL = 'https://api.resend.com/emails';

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function adminUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || SITE.url;
  return `${base}${path}`;
}

/** A simple label/value email that reads well in any mail client. */
function renderHtml(heading: string, rows: [string, string][], link: { label: string; href: string }): string {
  const body = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 16px 8px 0;vertical-align:top;color:#6b6b6b;font:12px/1.5 monospace;text-transform:uppercase;letter-spacing:.05em;white-space:nowrap">${escapeHtml(label)}</td>
          <td style="padding:8px 0;vertical-align:top;color:#1c1b1b;font:15px/1.5 Arial,sans-serif;white-space:pre-line">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join('');
  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#fcf9f8">
  <div style="max-width:600px;margin:0 auto;border:1px solid #1c1b1b;background:#ffffff">
    <div style="padding:20px 24px;background:#0b0b0b;color:#ffffff;font:bold 18px/1.3 Arial,sans-serif;text-transform:uppercase">${escapeHtml(heading)}</div>
    <div style="padding:16px 24px"><table style="border-collapse:collapse;width:100%">${body}</table></div>
    <div style="padding:0 24px 24px">
      <a href="${escapeHtml(link.href)}" style="display:inline-block;padding:10px 16px;background:#0b0b0b;color:#ffffff;text-decoration:none;font:12px monospace;text-transform:uppercase;letter-spacing:.05em">${escapeHtml(link.label)}</a>
    </div>
  </div>
</body></html>`;
}

function renderText(heading: string, rows: [string, string][], link: { label: string; href: string }): string {
  return [heading, '', ...rows.map(([label, value]) => `${label}: ${value}`), '', `${link.label}: ${link.href}`].join('\n');
}

async function sendStaffEmail(opts: {
  subject: string;
  heading: string;
  rows: [string, string][];
  link: { label: string; href: string };
  replyTo?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const rows = opts.rows.filter(([, value]) => value.trim() !== '');
  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || `${SITE.name} <onboarding@resend.dev>`,
        to: (process.env.CONTACT_NOTIFICATION_EMAIL || SITE.email).split(',').map((s) => s.trim()),
        reply_to: opts.replyTo,
        subject: opts.subject,
        html: renderHtml(opts.heading, rows, opts.link),
        text: renderText(opts.heading, rows, opts.link),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error('[email] send failed:', res.status, await res.text());
  } catch (err) {
    // An email problem must never stop an enquiry or booking going through.
    console.error('[email] send failed:', err);
  }
}

export function notifyNewEnquiry(e: {
  name: string;
  email: string;
  phone?: string | null;
  typeLabel: string;
  message: string;
}): Promise<void> {
  return sendStaffEmail({
    subject: `New enquiry: ${e.typeLabel} from ${e.name}`,
    heading: 'New website enquiry',
    rows: [
      ['Name', e.name],
      ['Email', e.email],
      ['Phone', e.phone ?? ''],
      ['Enquiry', e.typeLabel],
      ['Message', e.message],
    ],
    link: { label: 'Open enquiries', href: adminUrl('/admin/enquiries') },
    replyTo: e.email,
  });
}

export function notifyNewBooking(b: {
  reference: string;
  name: string;
  email: string;
  phone: string;
  courseTitle: string;
  courseDate: string;
  location: string;
  message?: string | null;
}): Promise<void> {
  return sendStaffEmail({
    subject: `New booking ${b.reference}: ${b.courseTitle}`,
    heading: 'New course booking',
    rows: [
      ['Reference', b.reference],
      ['Course', b.courseTitle],
      ['Course date', b.courseDate],
      ['Location', b.location],
      ['Name', b.name],
      ['Email', b.email],
      ['Phone', b.phone],
      ['Notes', b.message ?? ''],
    ],
    link: { label: 'Open bookings', href: adminUrl('/admin/bookings') },
    replyTo: b.email,
  });
}
