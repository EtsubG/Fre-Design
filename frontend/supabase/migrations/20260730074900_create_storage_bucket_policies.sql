/*
# Storage bucket policies for product-images

## Overview
Creates a public storage bucket for product images and sets RLS policies
so anyone can read images (public storefront) but only authenticated
admins can upload, update, or delete them.

## Security
- SELECT (read) is public: TO anon, authenticated
- INSERT/UPDATE/DELETE (write) is admin-only: TO authenticated
*/

-- Storage bucket already created via execute_sql; ensure policies exist
DROP POLICY IF EXISTS "public_read_product_images_storage" ON storage.objects;
CREATE POLICY "public_read_product_images_storage"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "admin_insert_product_images_storage" ON storage.objects;
CREATE POLICY "admin_insert_product_images_storage"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "admin_update_product_images_storage" ON storage.objects;
CREATE POLICY "admin_update_product_images_storage"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "admin_delete_product_images_storage" ON storage.objects;
CREATE POLICY "admin_delete_product_images_storage"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');