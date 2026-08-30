-- Corporate Gifting Catalogue — initial schema
-- Run this once in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

-- ── categories ──────────────────────────────────────────────
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ── products ────────────────────────────────────────────────
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10, 2),
  show_price boolean not null default true,
  image_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_categories (
  product_id uuid not null references products (id) on delete cascade,
  category_id uuid not null references categories (id) on delete cascade,
  primary key (product_id, category_id)
);

-- ── discounts ───────────────────────────────────────────────
create type discount_type as enum ('percentage', 'flat');
create type discount_applies_to as enum ('all', 'category');

create table discounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type discount_type not null,
  value numeric(10, 2) not null,
  applies_to discount_applies_to not null default 'all',
  category_id uuid references categories (id) on delete set null,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── site settings (singleton) ──────────────────────────────
create table site_settings (
  id integer primary key default 1 check (id = 1),
  hero_tagline text default 'Premium Corporate Gifting, Made Simple',
  hero_banner_url text,
  address text,
  phone text,
  email text,
  whatsapp_number text,
  whatsapp_message_template text default 'Hi! I''d like to enquire about a corporate gift order.',
  social_links jsonb default '{}'::jsonb,
  festive_banner_enabled boolean not null default false,
  festive_banner_message text,
  festive_banner_end_at timestamptz
);

-- ── media library ───────────────────────────────────────────
create table media_library (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  url text not null,
  filename text not null,
  created_at timestamptz not null default now()
);

-- ── enquiries ───────────────────────────────────────────────
create type enquiry_status as enum ('new', 'contacted', 'closed');

create table enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_name text,
  email text not null,
  phone text not null,
  delivery_city text,
  message text,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(10, 2),
  discount_applied jsonb,
  total numeric(10, 2),
  status enquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

-- ── row level security ──────────────────────────────────────
alter table categories enable row level security;
alter table products enable row level security;
alter table product_categories enable row level security;
alter table discounts enable row level security;
alter table site_settings enable row level security;
alter table media_library enable row level security;
alter table enquiries enable row level security;

create policy "public read categories" on categories
  for select using (true);

create policy "public read active products" on products
  for select using (is_active = true);

create policy "public read product_categories" on product_categories
  for select using (true);

create policy "public read active discounts" on discounts
  for select using (is_active = true);

create policy "public read site_settings" on site_settings
  for select using (true);

create policy "public insert enquiries" on enquiries
  for insert with check (true);

-- media_library and full-table admin access (inactive products/discounts,
-- enquiry reads/updates) are handled server-side via the secret key, which
-- bypasses RLS — no additional policies needed for those cases.

-- ── seed data ───────────────────────────────────────────────
insert into categories (name, slug, description, sort_order) values
  ('Corporate Gifting', 'corporate-gifting', 'Thoughtful gifts for clients, partners, and teams.', 1),
  ('Festive Gifting', 'festive-gifting', 'Seasonal hampers and celebration-ready gift sets.', 2),
  ('Edible Gifting', 'edible-gifting', 'Gourmet treats and curated food hampers.', 3),
  ('Customizable Merchandise', 'customizable-merchandise', 'Branded merchandise tailored to your company.', 4),
  ('Gadget Gifting', 'gadget-gifting', 'Premium tech and gadget gifts.', 5);

insert into site_settings (id) values (1);

-- ── storage bucket ──────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media bucket" on storage.objects
  for select using (bucket_id = 'media');
