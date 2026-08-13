/**
 * adminService.js
 * All admin CRUD operations go through the Express/MongoDB backend.
 * No Supabase dependency.
 */
import apiClient from './apiClient';
import { getProductImages } from '../constants/albumImages';

// ---------------------------------------------------------------------------
// Helpers — normalise a raw backend product into the shape the UI expects
// ---------------------------------------------------------------------------
function normaliseProduct(p) {
  const dbImages    = p.images || [];
  const localImages = getProductImages(p.name);
  // Use uploaded DB images if present, otherwise fall back to local assets
  // Do NOT pad/normalise here — show the real count so X/+ work correctly
  const resolvedImages = dbImages.length > 0 ? dbImages : (localImages || []);
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
    albumId:       p.albumId?._id || p.albumId || null,
    album:         p.albumId
      ? { id: p.albumId._id || p.albumId, name: p.albumId.name, slug: p.albumId.slug }
      : null,
    // Plain URL strings, unpadded — actual count matters for image management
    images: resolvedImages.map((img) => (typeof img === 'string' ? img : img.url)).filter(Boolean),
  };
}

function normaliseAlbum(a) {
  return {
    id:            a._id,
    name:          a.name,
    slug:          a.slug,
    sortOrder:     a.sortOrder || 0,
    coverImageUrl: a.coverImageUrl || null,
  };
}

// ---------------------------------------------------------------------------
// Albums
// ---------------------------------------------------------------------------

export async function createAlbum(name, slug) {
  const { data } = await apiClient.post('/albums', { name, slug });
  return { data: normaliseAlbum(data) };
}

export async function updateAlbum(id, name, slug) {
  const { data } = await apiClient.put(`/albums/${id}`, { name, slug });
  return { data: normaliseAlbum(data) };
}

export async function deleteAlbum(id) {
  await apiClient.delete(`/albums/${id}`);
  return { data: true };
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function getAllProductsAdmin() {
  const { data } = await apiClient.get('/products');
  return { data: data.map(normaliseProduct) };
}

export async function createProduct(productData) {
  const payload = {
    name:                   productData.name,
    description:            productData.description || '',
    fabricDetails:          productData.fabric || '',
    price:                  Number(productData.price) || 0,
    estimatedTailoringTime: productData.tailoringTime || '',
    deliveryTime:           productData.deliveryTime || '',
    badge:                  productData.badge || '',
    isFeatured:             productData.featured || false,
    albumId:                productData.albumId || null,
    images:                 productData.images || [],
  };
  const { data } = await apiClient.post('/products', payload);
  return { data: normaliseProduct(data.product || data) };
}

export async function updateProduct(id, productData) {
  const payload = {
    name:                   productData.name,
    description:            productData.description || '',
    fabricDetails:          productData.fabric || '',
    price:                  Number(productData.price) || 0,
    estimatedTailoringTime: productData.tailoringTime || '',
    deliveryTime:           productData.deliveryTime || '',
    badge:                  productData.badge || '',
    isFeatured:             productData.featured || false,
    albumId:                productData.albumId || null,
    ...(productData.images !== undefined && { images: productData.images }),
  };
  const { data } = await apiClient.put(`/products/${id}`, payload);
  return { data: normaliseProduct(data.product || data) };
}

export async function deleteProduct(id) {
  await apiClient.delete(`/products/${id}`);
  return { data: true };
}

// ---------------------------------------------------------------------------
// Product image upload
// ---------------------------------------------------------------------------

/**
 * Upload a single image file for a product.
 * Returns { data: { url } }
 */
export async function uploadProductImage(file, productId) {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await apiClient.post('/images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return { data: { url: data.url } };
}

/**
 * After uploading an image, append its URL to the product's images array.
 */
export async function addProductImage(productId, imageUrl) {
  // Fetch the product, append the URL, then update
  const { data: raw } = await apiClient.get(`/products/${productId}`);
  const existingImages = raw.images || [];
  const updatedImages  = [...existingImages, imageUrl];
  const { data } = await apiClient.put(`/products/${productId}`, { images: updatedImages });
  return { data: normaliseProduct(data.product || data) };
}

export async function deleteProductImageRecord(productId, imageIndex) {
  const { data: raw } = await apiClient.get(`/products/${productId}`);
  const images = (raw.images || []).filter((_, i) => i !== imageIndex);
  const { data } = await apiClient.put(`/products/${productId}`, { images });
  return { data: normaliseProduct(data.product || data) };
}

// legacy no-op kept so old import doesn't crash
export async function deleteProductImage() { return { data: true }; }
