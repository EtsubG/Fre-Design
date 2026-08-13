/**
 * productService.js
 * All data comes from the Express/MongoDB backend.
 * Falls back to mock data ONLY when the backend is completely unreachable.
 */
import apiClient from './apiClient';
import { getAlbumCover, getProductImages, normalizeImages } from '../constants/albumImages';
import { PRODUCTS } from '../hooks/data/mockData';

// ---------------------------------------------------------------------------
// Mock fallback — used only when backend is offline
// ---------------------------------------------------------------------------
const MOCK_ALBUMS = [
  { id: 'a1', name: 'Wedding',  slug: 'wedding',  sort_order: 1 },
  { id: 'a2', name: 'For Kids', slug: 'for-kids', sort_order: 2 },
  { id: 'a3', name: 'Casual',   slug: 'casual',   sort_order: 3 },
  { id: 'a4', name: 'Holidays', slug: 'holidays', sort_order: 4 },
];

const ALBUM_SLUG_MAP = { wedding: 'a1', festive: 'a4', ceremonial: 'a1', contemporary: 'a3' };

function normaliseMockProduct(p) {
  const albumId = ALBUM_SLUG_MAP[p.category] || 'a3';
  const album   = MOCK_ALBUMS.find((a) => a.id === albumId) || MOCK_ALBUMS[0];
  return {
    id:            p.id,
    name:          p.name,
    description:   p.description || '',
    fabric:        p.fabric || '',
    price:         Number(p.price),
    tailoringTime: '3-4 weeks',
    deliveryTime:  '1-2 weeks',
    featured:      p.featured || false,
    badge:         p.badge || '',
    album,
    albumId:       album.id,
    images:        normalizeImages(getProductImages(p.name) || p.images || []),
  };
}

// ---------------------------------------------------------------------------
// Helpers — normalise a backend product into the UI shape
// ---------------------------------------------------------------------------
function normaliseProduct(p) {
  // DB images always win; only use local assets as fallback for display
  const dbImages    = (p.images || []).map((img) => (typeof img === 'string' ? img : img.url)).filter(Boolean);
  const localImages = getProductImages(p.name) || [];
  const displayImages = normalizeImages(dbImages.length > 0 ? dbImages : localImages);
  return {
    id:            p._id,
    name:          p.name,
    description:   p.description || '',
    fabric:        p.fabricDetails || '',
    price:         Number(p.price),
    tailoringTime: p.estimatedTailoringTime || '',
    deliveryTime:  p.deliveryTime || '',
    featured:      p.isFeatured || false,
    badge:         p.badge || '',
    album: p.albumId
      ? { id: p.albumId._id || p.albumId, name: p.albumId.name, slug: p.albumId.slug }
      : null,
    albumId: p.albumId?._id || p.albumId || null,
    images:  displayImages,
  };
}

function normaliseAlbum(a) {
  return {
    id:              a._id || a.id,
    name:            a.name,
    slug:            a.slug,
    sort_order:      a.sortOrder || a.sort_order || 0,
    cover_image_url: getAlbumCover(a.slug) || a.coverImageUrl || null,
  };
}

export function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

// ---------------------------------------------------------------------------
// Albums
// ---------------------------------------------------------------------------
export async function getAlbums() {
  try {
    const { data } = await apiClient.get('/albums');
    if (data && data.length > 0) {
      return { data: data.map(normaliseAlbum) };
    }
  } catch (_) { /* backend offline */ }

  return {
    data: MOCK_ALBUMS.map((a) => ({
      ...a,
      cover_image_url: getAlbumCover(a.slug) || null,
    })),
  };
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export async function getProducts(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.albumId) query.set('albumId', params.albumId);
    const { data: raw } = await apiClient.get(`/products?${query.toString()}`);
    let result = (raw || []).map(normaliseProduct);
    if (params.albumSlug && params.albumSlug !== 'all')
      result = result.filter((p) => p.album?.slug === params.albumSlug);
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (params.sort === 'price-asc')  result.sort((a, b) => a.price - b.price);
    if (params.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (params.sort === 'featured')   result.sort((a, b) => Number(b.featured) - Number(a.featured));
    return { data: result, total: result.length };
  } catch (_) { /* backend unreachable */ }

  // Mock fallback
  let result = PRODUCTS.map(normaliseMockProduct);
  if (params.albumSlug && params.albumSlug !== 'all') {
    const album = MOCK_ALBUMS.find((a) => a.slug === params.albumSlug);
    if (album) result = result.filter((p) => p.album?.id === album.id);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (params.sort === 'price-asc')  result.sort((a, b) => a.price - b.price);
  if (params.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
  if (params.sort === 'featured')   result.sort((a, b) => Number(b.featured) - Number(a.featured));
  return { data: result, total: result.length };
}

export async function getProductsByAlbum(albumSlug) {
  try {
    const { data: albums } = await apiClient.get('/albums');
    const album = (albums || []).find((a) => a.slug === albumSlug);
    if (album) {
      const { data: raw } = await apiClient.get(`/products?albumId=${album._id}`);
      // Always use DB result — even empty array means no products in this album
      return {
        data: {
          album:    normaliseAlbum(album),
          products: (raw || []).map(normaliseProduct),
        },
      };
    }
  } catch (_) { /* backend unreachable */ }

  // Mock fallback
  const mockAlbum = MOCK_ALBUMS.find((a) => a.slug === albumSlug);
  if (!mockAlbum) return { data: { album: { name: 'Unknown', slug: albumSlug }, products: [] } };
  return {
    data: {
      album:    { ...mockAlbum, cover_image_url: getAlbumCover(albumSlug) },
      products: PRODUCTS.filter((p) => ALBUM_SLUG_MAP[p.category] === mockAlbum.id).map(normaliseMockProduct),
    },
  };
}

export async function getProductById(id) {
  try {
    const { data } = await apiClient.get(`/products/${id}`);
    if (data) return { data: normaliseProduct(data) };
  } catch (_) { /* fall through */ }

  const p = PRODUCTS.find((p) => p.id === id);
  if (!p) throw { message: 'Product not found', status: 404 };
  return { data: normaliseMockProduct(p) };
}

export async function getFeaturedProducts() {
  try {
    const { data: raw } = await apiClient.get('/products');
    return { data: (raw || []).map(normaliseProduct).filter((p) => p.featured) };
  } catch (_) { /* backend unreachable */ }
  return { data: PRODUCTS.filter((p) => p.featured).map(normaliseMockProduct) };
}

export async function getRelatedProducts(productId, albumId, limit = 3) {
  try {
    const { data: raw } = await apiClient.get(`/products?albumId=${albumId}`);
    return {
      data: (raw || []).map(normaliseProduct).filter((p) => p.id !== productId).slice(0, limit),
    };
  } catch (_) { /* fall through */ }

  const album  = MOCK_ALBUMS.find((a) => a.id === albumId);
  const result = PRODUCTS
    .filter((p) => p.id !== productId && album && ALBUM_SLUG_MAP[p.category] === album.id)
    .slice(0, limit)
    .map(normaliseMockProduct);
  return { data: result };
}
