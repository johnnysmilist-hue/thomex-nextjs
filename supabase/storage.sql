-- Run this once in Supabase's SQL Editor, same place as schema.sql.
-- Creates a public storage bucket for product photos uploaded via /admin.
-- Safe to run again — "on conflict do nothing" skips it if it already exists.

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- The bucket being "public" is what makes uploaded photos viewable on the
-- storefront without anyone needing to be signed in — no extra policy
-- needed for reads. Uploads themselves only ever happen through the
-- /api/admin/upload route, which checks ADMIN_EMAILS server-side before
-- touching storage at all, using the service role key (which bypasses
-- storage RLS) — so no public upload policy is needed either.
