import supabase from './supabaseClient';
import { getAlbumCover, getProductImages, normalizeImages } from '../constants/albumImages';
import { PRODUCTS } from '../hooks/data/mockData';

// productService uses Supabase when configured, and falls back to local
// mock data automatically when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
// are not set. This keeps every page functional during local development.

const USE_MOCK = !supabase;

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

// ---------------------------------------------------------------------------
// Mock album definitions (match the slugs used in ALBUM_COVERS / PRODUCTS)
// ---------------------------------------------------------------------------
const MOCK_ALBUMS = [
  { id: 'a1', name: 'Wedding',  slug: 'wedding',  sort_order: 1 },
  { id: 'a2', name: 'For Kids', slug: 'for-kids', sort_order: 2 },
  { id: 'a3', name: 'Casual',   slug: 'casual',   sort_order: 3 },
  { id: 'a4', name: 'Holidays', slug: 'holidays', sort_order: 4 },
];

// Map each mock product to an album so all service helpers are consistent
const ALBUM_SLUG_MAP = {
  wedding:  'a1',
  festive:  'a4',
  ceremonial: 'a1',
  contemporary: 'a3',
};

function normaliseMockProduct(p) {
  const albumId = ALBUM_SLUG_MAP[p.category] || 'a3';
  const album   = MOCK_ALBUMS.find((a) => a.id === albumId) || MOCK_ALBUMS[0];
  const localImages = getProductImages(p.name);
  return {
    id:           p.id,
    name:         p.name,
    description:  p.description,
    fabric:       p.fabric,
    price:        Number(p.price),
    tailoringTime: '3-4 weeks',
    deliveryTime:  '1-2 weeks',
    featured:     p.featured,
    badge:        p.badge,
    album,
    images: normalizeImages(localImages || p.images || []),
  };
}

// ---------------------------------------------------------------------------
// Public service functions
// ---------------------------------------------------------------------------

export async function getAlbums() {
  if (USE_MOCK) {
    const albums = MOCK_ALBUMS.map((a) => ({
      ...a,
      cover_image_url: getAlbumCover(a.slug) || null,
    }));
    return { data: albums };
  }

  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw { message: error.message, status: 500 };

  // If Supabase has no albums yet, fall back to mock so pages aren't blank
  if (!data || data.length === 0) {
    return {
      data: MOCK_ALBUMS.map((a) => ({
        ...a,
        cover_image_url: getAlbumCover(a.slug) || null,
      })),
    };
  }

  const albums = (data || []).map((a) => ({
    ...a,
    cover_image_url: getAlbumCover(a.slug) || a.cover_image_url,
  }));

  return { data: albums };
}

export async function getProductsByAlbum(albumSlug) {
  if (USE_MOCK) {
    const album = MOCK_ALBUMS.find((a) => a.slug === albumSlug);
    if (!album) return { data: { album: { name: 'Unknown', slug: albumSlug }, products: [] } };

    const products = PRODUCTS
      .filter((p) => ALBUM_SLUG_MAP[p.category] === album.id)
      .map(normaliseMockProduct);

    return {
      data: {
        album: { ...album, cover_image_url: getAlbumCover(albumSlug) },
        products,
      },
    };
  }

  const { data: album } = await supabase
    .from('albums')
    .select('id, name, slug')
    .eq('slug', albumSlug)
    .maybeSingle();

  if (!album) return { data: { album: { name: 'Unknown', slug: albumSlug }, products: [] } };

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
    const dbImages    = (p.product_images || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => img.image_url);
    return {
      ...p,
      tailoringTime: p.tailoring_time,
      deliveryTime:  p.delivery_time,
      images: normalizeImages(localImages || dbImages),
    };
  });

  return {
    data: {
      album: { ...album, cover_image_url: getAlbumCover(album.slug) },
      products: formatted,
    },
  };
}

export async function getProducts(params = {}) {
  if (USE_MOCK) {
    let result = PRODUCTS.map(normaliseMockProduct);

    if (params.albumSlug && params.albumSlug !== 'all') {
      const album = MOCK_ALBUMS.find((a) => a.slug === params.albumSlug);
      if (album) result = result.filter((p) => p.album?.id === album.id);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q),
      );
    }
    if (params.sort === 'price-asc')  result.sort((a, b) => a.price - b.price);
    if (params.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (params.sort === 'featured')   result.sort((a, b) => Number(b.featured) - Number(a.featured));

    return { data: result, total: result.length };
  }

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
    const dbImages    = (p.product_images || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => img.image_url);
    return {
      id: p.id, name: p.name, description: p.description,
      fabric: p.fabric, price: Number(p.price),
      tailoringTime: p.tailoring_time, deliveryTime: p.delivery_time,
      featured: p.featured, badge: p.badge, album: p.albums,
      images: normalizeImages(localImages || dbImages),
    };
  });

  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q),
    );
  }
  if (params.sort === 'price-asc')  result.sort((a, b) => a.price - b.price);
  if (params.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
  if (params.sort === 'featured')   result.sort((a, b) => Number(b.featured) - Number(a.featured));

  return { data: result, total: result.length };
}

export async function getProductById(id) {
  if (USE_MOCK) {
    const p = PRODUCTS.find((p) => p.id === id);
    if (!p) throw { message: 'Product not found', status: 404 };
    return { data: normaliseMockProduct(p) };
  }

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
  if (!data)  throw { message: 'Product not found', status: 404 };

  const localImages = getProductImages(data.name);
  const dbImages    = (data.product_images || [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => img.image_url);

  return {
    data: {
      id: data.id, name: data.name, description: data.description,
      fabric: data.fabric, price: Number(data.price),
      tailoringTime: data.tailoring_time, deliveryTime: data.delivery_time,
      featured: data.featured, badge: data.badge, album: data.albums,
      images: normalizeImages(localImages || dbImages),
    },
  };
}

export async function getFeaturedProducts() {
  if (USE_MOCK) {
    const featured = PRODUCTS.filter((p) => p.featured).map(normaliseMockProduct);
    return { data: featured };
  }

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

  return {
    data: (data || []).map((p) => {
      const localImages = getProductImages(p.name);
      const dbImages    = (p.product_images || [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((img) => img.image_url);
      return {
        id: p.id, name: p.name, description: p.description,
        fabric: p.fabric, price: Number(p.price),
        tailoringTime: p.tailoring_time, deliveryTime: p.delivery_time,
        featured: p.featured, badge: p.badge, album: p.albums,
        images: normalizeImages(localImages || dbImages),
      };
    }),
  };
}

export async function getRelatedProducts(productId, albumId, limit = 3) {
  if (USE_MOCK) {
    const album  = MOCK_ALBUMS.find((a) => a.id === albumId);
    const result = PRODUCTS
      .filter((p) => p.id !== productId && album && ALBUM_SLUG_MAP[p.category] === album.id)
      .slice(0, limit)
      .map(normaliseMockProduct);
    return { data: result };
  }

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
      const dbImages    = (p.product_images || [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((img) => img.image_url);
      return {
        id: p.id, name: p.name, description: p.description,
        fabric: p.fabric, price: Number(p.price),
        tailoringTime: p.tailoring_time, deliveryTime: p.delivery_time,
        featured: p.featured, badge: p.badge, album: p.albums,
        images: normalizeImages(localImages || dbImages),
      };
    }),
  };
}

export { shuffle };
