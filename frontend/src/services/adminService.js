import supabase from './supabaseClient';

export async function uploadProductImage(file, productId) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (uploadError) throw { message: uploadError.message, status: 500 };

  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return { data: { url: urlData.publicUrl, path: fileName } };
}

export async function deleteProductImage(path) {
  const { error } = await supabase.storage.from('product-images').remove([path]);
  if (error) throw { message: error.message, status: 500 };
  return { data: true };
}

export async function createAlbum(name, slug) {
  const { data, error } = await supabase
    .from('albums')
    .insert({ name, slug })
    .select()
    .single();

  if (error) throw { message: error.message, status: 500 };
  return { data };
}

export async function updateAlbum(id, name, slug) {
  const { data, error } = await supabase
    .from('albums')
    .update({ name, slug })
    .eq('id', id)
    .select()
    .single();

  if (error) throw { message: error.message, status: 500 };
  return { data };
}

export async function deleteAlbum(id) {
  const { error } = await supabase.from('albums').delete().eq('id', id);
  if (error) throw { message: error.message, status: 500 };
  return { data: true };
}

export async function getAllProductsAdmin() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, name, description, fabric, price, tailoring_time, delivery_time,
      featured, badge, sort_order, album_id, created_at,
      albums (id, name, slug),
      product_images (id, image_url, sort_order)
    `)
    .order('created_at', { ascending: false });

  if (error) throw { message: error.message, status: 500 };

  return {
    data: (data || []).map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      fabric: p.fabric,
      price: Number(p.price),
      tailoringTime: p.tailoring_time,
      deliveryTime: p.delivery_time,
      featured: p.featured,
      badge: p.badge,
      album: p.albums,
      images: (p.product_images || [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((img) => ({ id: img.id, url: img.image_url })),
    })),
  };
}

export async function createProduct(productData) {
  const { data, error } = await supabase
    .from('products')
    .insert({
      album_id: productData.albumId,
      name: productData.name,
      description: productData.description,
      fabric: productData.fabric,
      price: productData.price,
      tailoring_time: productData.tailoringTime,
      delivery_time: productData.deliveryTime,
      featured: productData.featured || false,
      badge: productData.badge || null,
    })
    .select()
    .single();

  if (error) throw { message: error.message, status: 500 };
  return { data };
}

export async function updateProduct(id, productData) {
  const { data, error } = await supabase
    .from('products')
    .update({
      name: productData.name,
      description: productData.description,
      fabric: productData.fabric,
      price: productData.price,
      tailoring_time: productData.tailoringTime,
      delivery_time: productData.deliveryTime,
      featured: productData.featured,
      badge: productData.badge,
      album_id: productData.albumId,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw { message: error.message, status: 500 };
  return { data };
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw { message: error.message, status: 500 };
  return { data: true };
}

export async function addProductImage(productId, imageUrl, sortOrder = 0) {
  const { data, error } = await supabase
    .from('product_images')
    .insert({ product_id: productId, image_url: imageUrl, sort_order: sortOrder })
    .select()
    .single();

  if (error) throw { message: error.message, status: 500 };
  return { data };
}

export async function deleteProductImageRecord(imageId) {
  const { error } = await supabase.from('product_images').delete().eq('id', imageId);
  if (error) throw { message: error.message, status: 500 };
  return { data: true };
}
