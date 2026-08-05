# Thomex

An electronics & gadget storefront built with Next.js 14 (App Router) + TypeScript + Tailwind CSS.

## What's in here

- `app/` — homepage, `product/[id]` (product detail + reviews), `category/[slug]` (category listing), `search`, `cart`, `checkout`, `track` (order lookup), `about` (about/contact), `signin`, `signup`, `account`, `wishlist`, `admin`, `terms`, `privacy`
- `components/` — Header, Hero, category grid, flash sales, product cards, product detail, footer
- `context/CartContext.tsx` — client-side cart (add/remove/qty), persisted to `localStorage`
- `data/products.ts` — demo product data. Swap these for real products later.
- `data/categories.ts` — sidebar/circle category shortcuts and the canonical category list used for `/category/[slug]` pages
- `data/config.ts` — your WhatsApp number and order email. **Edit this before going live.**
- `supabase/schema.sql` — run this once in Supabase to create the `orders` table (see below)

## Cart

The cart is client-only for now (no backend/database) — it lives in `localStorage` in the visitor's browser via `CartContext`. That's enough to demo the full add-to-cart → cart page → checkout flow. When you're ready for real orders and payments (e.g. accounts, order history, M-Pesa), that's the next layer to add.

## Checkout (pay on delivery)

There's no payment gateway yet. Checkout collects the customer's name, phone, and delivery location, then opens **WhatsApp** or **email** with the order pre-filled so it lands directly with you — the customer pays cash or M-Pesa on delivery.

**Before you go live, edit `data/config.ts`:**
- `ORDER_WHATSAPP_NUMBER` — your WhatsApp number in international format, digits only (e.g. a Kenyan `07XX XXX XXX` becomes `2547XXXXXXXX`)
- `ORDER_EMAIL` — where you want order emails to land

Edit that file directly on GitHub's website (pencil icon → edit → commit) — no terminal needed, and Vercel redeploys automatically.

## Checkout (pay now with M-Pesa, via your till)

There's now a second option at checkout: **"Pay with M-Pesa now."** It sends an STK push to the customer's phone (the "enter your PIN" prompt), asking them to pay your till directly, then confirms on-screen once it goes through. This uses Safaricom's Daraja API — it needs real credentials before it'll work, and those are **not** the same thing as your till number.

**What you need to get, from developer.safaricom.co.ke:**
1. Create a free account and an "app" in the Daraja portal. That gives you a **Consumer Key** and **Consumer Secret**.
2. For testing, Safaricom gives you a sandbox **Shortcode** and **Passkey** to try the flow risk-free with fake money.
3. To actually charge your real till, you'll need to go through Safaricom's **Go-Live** process (they link your till to the API — this involves some paperwork/approval on their side, so budget a few days for it). That's when you get the **production Passkey** tied to your till.

**Where these go:** never in the code or in `data/config.ts` — they're secrets. Add them in **Vercel → your project → Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `MPESA_ENV` | `sandbox` while testing, `production` once live |
| `MPESA_CONSUMER_KEY` | from your Daraja app |
| `MPESA_CONSUMER_SECRET` | from your Daraja app |
| `MPESA_PASSKEY` | sandbox passkey for testing, production passkey after Go-Live |
| `MPESA_SHORTCODE` | your till number |

`.env.local.example` in this repo lists these same names as a reference. After adding/changing env vars in Vercel, redeploy for them to take effect (Vercel's dashboard has a "Redeploy" button — no terminal needed).

**Test in sandbox first.** Safaricom's sandbox lets you simulate a full payment with a test phone number before you touch real money — worth doing before switching `MPESA_ENV` to `production`.

## Order tracking (real database)

Every order — pay-on-delivery or M-Pesa — now gets saved to a real database, and customers can look up their own orders at `/track` by phone number. This uses **Supabase** (a hosted Postgres database with a web dashboard — no server to run yourself).

**Set it up:**
1. Create a free account at **supabase.com** and start a new project (pick a region close to Kenya, e.g. one in Europe, for lower latency).
2. Once it's created, go to the **SQL Editor** in the Supabase dashboard, open `supabase/schema.sql` from this repo, paste its contents in, and click **Run**. That creates the `orders` table.
3. Go to **Project Settings → API**. You need two values:

| Variable | Where to find it |
|---|---|
| `SUPABASE_URL` | "Project URL" on that page |
| `SUPABASE_SERVICE_ROLE_KEY` | "service_role" key (under Project API keys) — treat this like a password, it has full access |

4. Add both in **Vercel → your project → Settings → Environment Variables**, then redeploy.

**Managing orders day to day:** you don't need a custom admin page yet — Supabase's own **Table Editor** (in their dashboard) shows every order as a spreadsheet-like table. You can open any row and change its `status` (`pending` → `confirmed` → `dispatched` → `delivered`, or `cancelled`) directly there, and customers checking `/track` will see the update immediately.

**Why the service role key is safe here:** it's only ever read inside `app/api/*` route files, which run on Vercel's servers — it's never sent to the browser. The database itself has Row Level Security turned on with no public policies, so the only way in is through those API routes.

## Sign in / Sign up

`/signup` and `/signin` give customers real accounts, using **Supabase Auth** (part of the same Supabase project as your orders database — no extra signup needed). `/account` shows who's signed in with a sign-out button. The person icon in the header and the mobile menu both link to sign-in or account depending on whether someone's logged in.

**Two more environment variables are needed** (different from the two you already added for order tracking — these ones are public and safe to expose in the browser):

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Same as `SUPABASE_URL` — **Project Settings → API → Project URL** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Project Settings → API → anon / public key** |

Add both in Vercel → Settings → Environment Variables, then redeploy.

**One setting worth knowing about:** by default, Supabase requires a new user to click a confirmation link in their email before they can sign in. That's good for a real launch, but can be confusing while you're testing. If you want sign-up to work instantly without email confirmation while you try things out, go to **Supabase → Authentication → Providers → Email** and turn off "Confirm email" — just remember to turn it back on before real customers start signing up, so no one can create an account with an email they don't own.

## Account page (orders, wishlist, recently viewed)

`/account` is a real Jumia-style account hub for signed-in customers:

- **My orders** — orders placed while signed in, pulled live from the database, with status badges. This only shows orders tied to that account — a guest checkout still uses the phone-number lookup at `/track`.
- **Wishlist** (`/wishlist`) — tap the heart on any product card to save it. Stored in the browser (`localStorage`), so it works even for visitors who aren't signed in. The heart icon in the header shows a live count.
- **Recently viewed** — automatically tracked as customers open product pages, also browser-based.

**If you already ran `supabase/schema.sql` before this feature existed, run it again** — the bottom of that file now has a migration block that adds a `user_id` column linking orders to accounts, plus a security policy that lets a signed-in customer see only their own orders (not anyone else's). It's safe to paste and run the whole file again; it won't duplicate anything already there.

## Reviews & ratings

Every product page now has a real reviews section — signed-in customers can leave a star rating (1–5) and an optional comment. A customer can only leave one review per product; submitting again edits their existing review instead of creating a duplicate, and they can delete their own review at any time.

The star rating and review count shown everywhere else on the site (product cards, category pages) update automatically — every time a review is added, edited, or deleted, the product's average rating and count get recalculated from the real reviews. Products with no reviews yet still show the placeholder rating from the demo catalog (or whatever you set in `/admin`) until real reviews start coming in.

**Set it up:** run `supabase/schema.sql` again in Supabase's SQL Editor — it now includes a `reviews` table (safe to re-run). No new environment variables needed.

**Why reviews require signing in:** it keeps the system honest — one real customer, one review — and reuses the same account system already built rather than adding a separate anonymous-comments system that would need its own spam protection.

## Admin dashboard (`/admin`)

A private, WordPress-styled dashboard for running the store day to day — no need to touch Supabase's Table Editor or GitHub for routine changes anymore. It looks and works like the WordPress admin: a dark sidebar, "Howdy, {your email}" at the top, and list tables with hover row actions.

- **Dashboard** — order count, pending orders, product count, and a quick view of recent orders.
- **Orders** — every order, with a status dropdown (Pending → Confirmed → Dispatched → Delivered, or Cancelled) that updates instantly. Click a row to expand and see the items. Customers checking `/track` or their `/account` see the new status right away.
- **Products** — add, edit, or delete products directly: name, category, price, sale price, specs, rating, badge, and a **photo you upload straight from your phone or computer** (pasting a link in is still there as a fallback). Edit/Delete appear on hover under the product name, same as WordPress's Posts list.
- **Media** — every photo that's ever been uploaded, in one grid, WordPress Media Library-style. Click one to see its details and delete it. Anything not currently used by a product is flagged "Unused" so you know what's safe to clean up. You can also upload a fresh photo here directly, before assigning it to a product.
- **Users** — every account that's signed up, with join date, last sign-in, and how many orders they've placed. Read-only — this isn't where admin access is granted (see `ADMIN_EMAILS` below).
- **Settings** — edit your WhatsApp number and order email right from the dashboard instead of editing `data/config.ts` on GitHub. Changes take effect immediately across the whole site (checkout, the Contact page) — no redeploy needed.

**Set it up:**

1. Run `supabase/schema.sql` again in Supabase's SQL Editor (it now includes `products` and `settings` tables — safe to re-run).
2. Run `supabase/seed-products.sql` once too — it loads the same 6 demo products that were previously hardcoded, so the storefront doesn't go blank the moment products move into the database.
3. Run `supabase/storage.sql` once — creates the public storage bucket that uploaded photos live in.
4. Add an `ADMIN_EMAILS` environment variable in Vercel — a comma-separated list of the email(s) allowed to use `/admin` (e.g. your own sign-in email). Anyone signed in with an email **not** on this list gets a clear "Not authorized" page instead.
5. Redeploy.

**How access is enforced:** every admin action — including photo uploads, settings changes, and viewing the user list — goes through an API route that checks your signed-in session server-side against `ADMIN_EMAILS` before touching the database or storage. The check can't be bypassed from the browser, since it never trusts anything the client claims about itself. Uploaded photos are capped at 8MB and must be JPG, PNG, WEBP, or GIF.

**Note:** `/admin` isn't linked anywhere in the site's navigation on purpose — bookmark the URL directly. If a product hasn't been added to the database yet, the storefront automatically falls back to the demo catalog in `data/products.ts`; same idea for settings — until you save something in Settings, the site uses the placeholder WhatsApp number/email in `data/config.ts`.

## Terms & Privacy

`/terms` and `/privacy` are real pages now, linked from the footer (About us, Contact us, Shipping & delivery, Returns, Terms & conditions, Privacy policy all point to real content — the Help links jump straight to the matching section on the Terms page). The sign-up page also links both.

**Read them before publishing.** Both are honest starting templates that describe what the site actually does — pay-on-delivery and M-Pesa payments, 7-day returns, what data gets collected and why, which third parties are involved (Safaricom, Supabase, Vercel, WhatsApp) — but neither is a substitute for a lawyer's review, especially the liability and returns sections. Both pages have a visible "before you publish this" note as a reminder, which you'll probably want to remove once you've had them checked.

Edit either file directly on GitHub (`app/terms/page.tsx`, `app/privacy/page.tsx`) — same as any other page.

## Deploying with no terminal (GitHub website + Vercel)

1. **Get this code into a GitHub repo.**
   - Create a new repository on github.com (e.g. `thomex`).
   - Click **Add file → Upload files**, then drag the whole project folder in. Modern GitHub keeps the folder structure as long as you drag folders, not just loose files.
2. **Connect Vercel.**
   - Go to vercel.com, sign in with GitHub, click **Add New → Project**, and pick the `thomex` repo.
   - Vercel auto-detects Next.js — leave the defaults and click **Deploy**.
   - Vercel builds the site on its own servers, so you never need `npm install` or a terminal locally.
3. **Every future change** you push to GitHub (again, via the website's edit/upload buttons) automatically redeploys on Vercel within a minute or two.

## Editing files on GitHub's website

- Click any file in the repo → the pencil icon → edit → **Commit changes**.
- To add a new page, use **Add file → Create new file** and give it a path like `app/products/page.tsx`.
