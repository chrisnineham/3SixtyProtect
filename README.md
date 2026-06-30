# 3Sixty Protect

A modern, premium marketing **and** booking website for **3Sixty Protect**, a professional
SIA security training company specialising in **Door Supervision** and **Close Protection**
courses. Built with Next.js, TypeScript, Tailwind CSS and Supabase, and ready to deploy on
Vercel.

> **Works out of the box.** The site ships with built-in demo data, so you can run it and
> click through every page (including the admin portal in read-only "demo mode") before
> connecting a database. Add your Supabase keys to switch on real data, auth and bookings.

---

## ✨ Features

**Public website**
- Striking, responsive homepage with hero, course overviews, trust and booking-journey sections
- Dedicated **Door Supervision** and **Close Protection** course pages
- **Training Calendar** with live course-type filtering
- Online **booking flow** with a live summary and confirmation screen (Stripe-ready)
- **Contact** page with enquiry form
- SEO-friendly metadata, Open Graph tags, `sitemap.xml` and `robots.txt`

**Owner / admin portal** (`/admin`)
- Secure email + password login (Supabase Auth), restricted to authorised admins
- Dashboard with live stats, recent bookings and upcoming courses
- Full course management — create, edit, publish/unpublish, delete
- Booking management — view enquiries and update booking status

---

## 🧱 Tech stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) + React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database & Auth | Supabase (Postgres + Auth + Storage) |
| Payments (optional) | Stripe (wired, switched off until configured) |
| Icons | lucide-react |
| Validation | Zod |
| Hosting | Vercel |

---

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template (optional for demo mode)
cp .env.example .env.local

# 3. Run the dev server
npm run dev
```

Open <http://localhost:3000>. With no env vars set, the site runs in **demo mode** using the
built-in sample courses and bookings.

---

## 🗄️ Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql) to create the
   tables, enums, row-level-security policies and triggers.
3. *(Optional)* Run [`supabase/seed.sql`](supabase/seed.sql) to insert a few published
   courses so the site has content.
4. In **Project Settings → API**, copy your keys into `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
   SUPABASE_SERVICE_ROLE_KEY=ey...     # server only — never expose
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```

5. **Create an admin user:**
   - In **Authentication → Users**, add a user (email + password).
   - In the **SQL Editor**, promote them to admin:

     ```sql
     insert into admin_users (id, email, role)
     select id, email, 'owner' from auth.users
     where email = 'owner@3sixtyprotect.co.uk'
     on conflict (id) do nothing;
     ```

6. Restart the dev server. You can now sign in at `/admin/login`, and published courses will
   appear on the public site automatically.

### Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | for live data | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | for live data | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | recommended | Server-only key for trusted writes |
| `NEXT_PUBLIC_SITE_URL` | recommended | Used for SEO/canonical URLs |
| `STRIPE_SECRET_KEY` | optional | Enables online payment (see below) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | optional | Stripe.js publishable key |
| `STRIPE_WEBHOOK_SECRET` | optional | For payment webhooks |

---

## 💳 Stripe (payments) — ready when you are

The booking flow is structured so card payment can be switched on without restructuring:

- [`lib/stripe.ts`](lib/stripe.ts) holds a guarded Stripe client and a `createCheckoutSession()`
  helper. It returns `null` until `STRIPE_SECRET_KEY` is set.
- In [`app/(site)/book/actions.ts`](app/(site)/book/actions.ts) there's a marked hook where you
  create a checkout session after the booking row is inserted, then redirect to Stripe.

Until then, bookings are stored with `booking_status = 'new'` and confirmed manually from the
admin portal.

---

## 📁 Project structure

```
app/
  (site)/            Public website (header + footer layout)
    page.tsx           Homepage
    door-supervision/  Door Supervision course page
    close-protection/  Close Protection course page
    calendar/          Training calendar (filterable)
    book/              Booking flow + server action
    contact/           Contact form + server action
  admin/
    login/             Admin login
    (panel)/           Authenticated portal (dashboard, courses, bookings)
    _actions/          Server actions (auth, course CRUD, bookings)
  sitemap.ts, robots.ts
components/            Reusable UI, layout, course, booking, admin components
lib/                  Supabase clients, data access, types, content, utils, validation
supabase/             schema.sql + seed.sql
```

---

## 🎨 Branding

The visual identity (deep charcoal base + premium gold accent) is themed via
[`tailwind.config.ts`](tailwind.config.ts) (`ink` and `gold` colour scales) and
[`app/globals.css`](app/globals.css). Change those tokens to re-skin the whole site.

Course imagery uses branded gradient panels by default; add a real `image_url` to a course
(any public URL, e.g. Supabase Storage) and it will render automatically.

---

## ☁️ Deploying to Vercel

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Add the environment variables above in **Project Settings → Environment Variables**.
4. Deploy. (Build command `next build` and output are auto-detected.)

---

## 🛣️ Built to extend

The structure is ready for the natural next features: online payments (Stripe is wired),
learner accounts, certificate uploads, automated email confirmations and reminders.
