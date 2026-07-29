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
