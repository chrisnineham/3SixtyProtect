import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ContactForm } from '@/components/contact/ContactForm';
import { Button } from '@/components/ui/Button';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with 3Sixty Protect about SIA Door Supervision and Close Protection training. Call, email or send an enquiry and our team will be happy to help.',
  alternates: { canonical: '/contact' },
};

const contactCards = [
  {
    icon: Mail,
    label: 'Email us',
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    detail: 'We aim to reply within one working day.',
  },
  {
    icon: Phone,
    label: 'Call us',
    value: SITE.phone,
    href: SITE.phoneHref,
    detail: 'Speak to our team about courses and dates.',
  },
  {
    icon: MapPin,
    label: 'Service area',
    value: SITE.serviceArea,
    detail: 'Training delivered at venues across the region.',
  },
  {
    icon: Clock,
    label: 'Opening hours',
    value: 'Mon–Fri, 9am–6pm',
    detail: 'Enquiries online anytime — we’ll respond promptly.',
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Have a question about a course, a date or your eligibility? We’re here to help you take the next step toward your SIA qualification."
      />

      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-12">
          {/* Contact info */}
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-bold text-ink-900">Ways to reach us</h2>
            <p className="mt-2 text-ink-500">
              Prefer to talk it through? Use whichever works best for you.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {contactCards.map((card) => {
                const inner = (
                  <>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-gold-400">
                      <card.icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-400">
                      {card.label}
                    </p>
                    <p className="mt-1 font-semibold text-ink-900">{card.value}</p>
                    <p className="mt-1 text-sm text-ink-500">{card.detail}</p>
                  </>
                );
                return card.href ? (
                  <a
                    key={card.label}
                    href={card.href}
                    className="group rounded-2xl border border-ink-100 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                  >
                    {inner}
                  </a>
                ) : (
                  <div
                    key={card.label}
                    className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card"
                  >
                    {inner}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl bg-ink-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">Ready to book?</p>
                <p className="text-sm text-ink-300">
                  Skip the queue and reserve your place online.
                </p>
              </div>
              <Button href="/book" className="shrink-0">
                Book a Course
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
