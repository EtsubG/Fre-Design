import supabase from './supabaseClient';
import { getAlbumCover, getProductImages, normalizeImages } from '../constants/albumImages';

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export async function getAlbums() {
  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw { message: error.message, status: 500 };

  const albums = (data || []).map((a) => ({
    ...a,
    cover_image_url: getAlbumCover(a.slug) || a.cover_image_url,
  }));

  return { data: albums };
}

export async function getProductsByAlbum(albumSlug) {
  const { data: album } = await supabase
    .from('albums')
    .select('id, name, slug')
    .eq('slug', albumSlug)
    .maybeSingle();

  if (!album) return { data: { album: { ...album, name: 'Unknown', slug: albumSlug }, products: [] } };

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id, name, description, fabric, price, tailoring_time, delivery_time,
      featured, badge, sort_order, album_id,
      product_images (id, image_url, sort_order)
    `)
    .eq('album_id', album.id)
    .order('sort_order', { ascending: true });

  if (error) throw { message: error.message, status: 500 };

  const formatted = (products || []).map((p) => {
    const localImages = getProductImages(p.name);
    const dbImages = (p.product_images || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => img.image_url);
    return {
      ...p,
      tailoringTime: p.tailoring_time,
      deliveryTime: p.delivery_time,
      images: normalizeImages(localImages || dbImages),
    };
  });

  return { data: { album: { ...album, cover_image_url: getAlbumCover(album.slug) }, products: formatted } };
}

export async function getProducts(params = {}) {
  let query = supabase
    .from('products')
    .select(`
      id, name, description, fabric, price, tailoring_time, delivery_time,
      featured, badge, sort_order, album_id,
      albums (id, name, slug),
      product_images (id, image_url, sort_order)
    `)
    .order('sort_order', { ascending: true });

  if (params.albumSlug && params.albumSlug !== 'all') {
    const { data: album } = await supabase
      .from('albums')
      .select('id')
      .eq('slug', params.albumSlug)
      .maybeSingle();
    if (album) query = query.eq('album_id', album.id);
  }

  const { data, error } = await query;

  if (error) throw { message: error.message, status: 500 };

  let result = (data || []).map((p) => {
    const localImages = getProductImages(p.name);
    const dbImages = (p.product_images || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => img.image_url);
    return {
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
      images: normalizeImages(localImages || dbImages),
    };
  });

  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q),
    );
  }

  if (params.sort === 'price-asc') result.sort((a, b) => a.price - b.price);
  if (params.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
  if (params.sort === 'featured') result.sort((a, b) => Number(b.featured) - Number(a.featured));

  return { data: result, total: result.length };
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, name, description, fabric, price, tailoring_time, delivery_time,
      featured, badge, sort_order, album_id,
      albums (id, name, slug),
      product_images (id, image_url, sort_order)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw { message: error.message, status: 500 };
  if (!data) throw { message: 'Product not found', status: 404 };

  const localImages = getProductImages(data.name);
  const dbImages = (data.product_images || [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => img.image_url);

  const product = {
    id: data.id,
    name: data.name,
    description: data.description,
    fabric: data.fabric,
    price: Number(data.price),
    tailoringTime: data.tailoring_time,
    deliveryTime: data.delivery_time,
    featured: data.featured,
    badge: data.badge,
    album: data.albums,
    images: normalizeImages(localImages || dbImages),
  };

  return { data: product };
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, name, description, fabric, price, tailoring_time, delivery_time,
      featured, badge, sort_order, album_id,
      albums (id, name, slug),
      product_images (id, image_url, sort_order)
    `)
    .eq('featured', true)
    .order('sort_order', { ascending: true });

  if (error) throw { message: error.message, status: 500 };

  const result = (data || []).map((p) => {
    const localImages = getProductImages(p.name);
    const dbImages = (p.product_images || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => img.image_url);
    return {
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
      images: normalizeImages(localImages || dbImages),
    };
  });

  return { data: result };
}

export async function getRelatedProducts(productId, albumId, limit = 3) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, name, description, fabric, price, tailoring_time, delivery_time,
      featured, badge, sort_order, album_id,
      albums (id, name, slug),
      product_images (id, image_url, sort_order)
    `)
    .neq('id', productId)
    .eq('album_id', albumId)
    .limit(limit);

  if (error) throw { message: error.message, status: 500 };

  return {
    data: (data || []).map((p) => {
      const localImages = getProductImages(p.name);
      const dbImages = (p.product_images || [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((img) => img.image_url);
      return {
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
        images: normalizeImages(localImages || dbImages),
      };
    }),
  };
}

export { shuffle };
