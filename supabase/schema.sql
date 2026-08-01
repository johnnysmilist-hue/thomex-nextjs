-- Run this once in Supabase: your project -> SQL Editor -> New query -> paste -> Run.
-- Creates the table that stores every order placed on Thomex.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  phone text not null,
  location text not null,
  notes text,
  items jsonb not null,           -- snapshot of what was bought: [{name, qty, price}, ...]
  subtotal numeric not null,
  payment_method text not null,   -- 'delivery' or 'mpesa'
  payment_status text not null default 'unpaid',  -- 'unpaid' | 'paid'
  mpesa_checkout_id text,         -- Safaricom's CheckoutRequestID, when paid via M-Pesa
  status text not null default 'pending'  -- 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled'
);

-- Speeds up "track my order" lookups by phone number.
create index if not exists orders_phone_idx on orders (phone);

-- Row Level Security: locked down by default. All reads/writes from the site
-- go through server-side API routes using the service role key, which
-- bypasses these policies entirely — so no public policies are needed here.
alter table orders enable row level security;

-- ── Migration: link orders to signed-in accounts ───────────────────────
-- Safe to run again even if you already ran the block above — these use
-- "if not exists" guards. Paste this whole file into the SQL Editor again
-- and hit Run; it won't duplicate anything that's already there.

alter table orders add column if not exists user_id uuid references auth.users(id);
create index if not exists orders_user_id_idx on orders (user_id);

-- Lets a signed-in customer see their own orders (My Orders on the account
-- page) without needing the service role key — Postgres checks this policy
-- using their auth session automatically.
drop policy if exists "Users can view own orders" on orders;
create policy "Users can view own orders"
  on orders for select
  using (auth.uid() = user_id);

-- ── Migration: move the product catalog into the database ──────────────
-- Also safe to run again. This lets the /admin page manage products
-- directly instead of editing data/products.ts on GitHub for every change.

create table if not exists products (
  id text primary key,            -- keep matching the slugs already used in URLs, e.g. "p1"
  created_at timestamptz not null default now(),
  name text not null,
  category text not null,
  price numeric not null,
  old_price numeric,
  specs text[] not null default '{}',
  rating numeric not null default 0,
  reviews integer not null default 0,
  badge text,                     -- 'New' | 'Deal' | 'Best Seller' | null
  image text not null
);

-- The catalog is public information — anyone (including logged-out
-- visitors) needs to read it to browse the store. Writes still only ever
-- happen through the admin API routes using the service role key.
alter table products enable row level security;
drop policy if exists "Anyone can view products" on products;
create policy "Anyone can view products"
  on products for select
  using (true);

-- ── Migration: customer reviews ─────────────────────────────────────────
-- Also safe to run again.

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  product_id text not null references products(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  unique (product_id, user_id)  -- one review per customer per product; resubmitting edits it
);

create index if not exists reviews_product_id_idx on reviews (product_id);

-- Reviews are public information — anyone needs to read them to browse the
-- store, same as products. Writes only ever happen through /api/reviews,
-- which checks the visitor is signed in server-side before using the
-- service role key — so no public write policy is needed here.
alter table reviews enable row level security;
drop policy if exists "Anyone can view reviews" on reviews;
create policy "Anyone can view reviews"
  on reviews for select
  using (true);

