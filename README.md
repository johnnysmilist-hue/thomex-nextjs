# Thomex

An electronics & gadget storefront built with Next.js 14 (App Router) + TypeScript + Tailwind CSS.

## What's in here

- `app/` — homepage, `product/[id]` (product detail), `category/[slug]` (category listing), `cart`, `checkout`, `track` (order lookup)
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
