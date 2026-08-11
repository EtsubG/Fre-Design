/*
# Create albums, products, and product_images tables

## Overview
This migration creates the core data model for the FERE-DESIGN fashion website.
It replaces the previous mock-data approach with a real Supabase backend so the
admin dashboard can manage albums (categories) and the products (dresses) inside
them, including multiple images per product.

## New Tables

### 1. albums
- `id` (uuid, primary key)
- `name` (text, not null) — e.g. "Wedding", "For Kids", "Casual", "Holidays"
- `slug` (text, unique, not null) — URL-friendly identifier
- `sort_order` (int, default 0) — manual ordering of albums
- `created_at` (timestamptz, default now())

### 2. products
- `id` (uuid, primary key)
- `album_id` (uuid, foreign key → albums.id ON DELETE CASCADE)
- `name` (text, not null) — dress name
- `description` (text) — dress description
- `fabric` (text) — fabric information, e.g. "Handwoven Cotton"
- `price` (numeric, default 0) — price in the site's currency
- `tailoring_time` (text) — estimated tailoring time, e.g. "3-4 weeks"
- `delivery_time` (text) — estimated delivery time, e.g. "1-2 weeks"
- `featured` (boolean, default false) — whether to show on the home page
- `badge` (text) — optional badge label, e.g. "New", "Bestseller"
- `sort_order` (int, default 0) — manual ordering within an album
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### 3. product_images
- `id` (uuid, primary key)
- `product_id` (uuid, foreign key → products.id ON DELETE CASCADE)
- `image_url` (text, not null) — full URL to the image (Supabase Storage public URL)
- `sort_order` (int, default 0) — ordering of images within a product
- `created_at` (timestamptz, default now())

## Security (RLS)
- RLS is enabled on all three tables.
- The public storefront needs to READ albums, products, and product_images
  (anon role), while WRITE operations (INSERT/UPDATE/DELETE) are restricted
  to authenticated admins only.
- Policies use `TO anon, authenticated` for SELECT (public read).
- Policies use `TO authenticated` for INSERT/UPDATE/DELETE (admin write).
- A B-tree index is added on the foreign key columns for query performance.

## Notes
1. The app uses the anon key on the storefront, so SELECT policies must
   include the `anon` role — otherwise the public site sees no data.
2. Admin write policies require an authenticated session (the admin login
   flow sets up the Supabase auth session).
3. A `updated_at` trigger keeps `products.updated_at` current on every UPDATE.
*/

-- ---------- albums ----------
CREATE TABLE IF NOT EXISTS albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE albums ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_albums" ON albums;
CREATE POLICY "public_read_albums"
  ON albums FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_insert_albums" ON albums;
CREATE POLICY "admin_insert_albums"
  ON albums FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_albums" ON albums;
CREATE POLICY "admin_update_albums"
  ON albums FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_albums" ON albums;
CREATE POLICY "admin_delete_albums"
  ON albums FOR DELETE
  TO authenticated
  USING (true);

-- ---------- products ----------
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  fabric text,
  price numeric NOT NULL DEFAULT 0,
  tailoring_time text,
  delivery_time text,
  featured boolean NOT NULL DEFAULT false,
  badge text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products"
  ON products FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- ---------- product_images ----------
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_product_images" ON product_images;
CREATE POLICY "public_read_product_images"
  ON product_images FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_insert_product_images" ON product_images;
CREATE POLICY "admin_insert_product_images"
  ON product_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_product_images" ON product_images;
CREATE POLICY "admin_update_product_images"
  ON product_images FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_product_images" ON product_images;
CREATE POLICY "admin_delete_product_images"
  ON product_images FOR DELETE
  TO authenticated
  USING (true);

-- ---------- indexes ----------
CREATE INDEX IF NOT EXISTS idx_products_album_id ON products(album_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- ---------- updated_at trigger ----------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ---------- seed default albums ----------
INSERT INTO albums (name, slug, sort_order) VALUES
  ('Wedding', 'wedding', 1),
  ('For Kids', 'for-kids', 2),
  ('Casual', 'casual', 3),
  ('Holidays', 'holidays', 4)
ON CONFLICT (slug) DO NOTHING;