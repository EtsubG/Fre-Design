import supabase from './supabaseClient';
import { getAlbumCover, getProductImages, normalizeImages } from '../constants/albumImages';
import heroImg from '../assets/images/hero.jpg';
import casualImg from '../assets/images/casual.jpg';
import holidayImg from '../assets/images/holiday.jpg';
import kidsImg from '../assets/images/kids.jpg';
import kids2Img from '../assets/images/kids_(2).jpg';
import stylishHabeshaImg from '../assets/images/Stylish_habesha_dress.jpg';
import ad9eImg from '../assets/images/habesha-detail.png';
import weddingDetail from '../assets/images/albums/wedding/741545894886734285.jpg';
import kidsDetail from '../assets/images/albums/for_kids/1084452785297173494.jpg';
import casualSadexqayd from '../assets/images/albums/casual/Sadexqayd_Somali_culture.jpg';
import casualDesign2 from '../assets/images/albums/casual/221731981650285425.jpg';
import holidayStylishImg from '../assets/images/albums/holiday/Stylish_habesha_dress.jpg';
import holidaysDesign from '../assets/images/albums/holidays/098_702_9147.jpg';
import rubyHabesha from '../assets/images/albums/new/RUBY_HABESHA_LEBS_0912280097.jpg';

// ---------------------------------------------------------------------------
// Sample data shown in admin when Supabase is not configured or has no data
// ---------------------------------------------------------------------------
const SAMPLE_ALBUMS = [
  { id: 'a1', name: 'Wedding',  slug: 'wedding',  sort_order: 1, cover_image_url: heroImg },
  { id: 'a2', name: 'For Kids', slug: 'for-kids', sort_order: 2, cover_image_url: kidsImg },
  { id: 'a3', name: 'Casual',   slug: 'casual',   sort_order: 3, cover_image_url: casualImg },
  { id: 'a4', name: 'Holidays', slug: 'holidays', sort_order: 4, cover_image_url: holidayImg },
];

let _seq = 1;
const sampleImg = (url) => ({ id: `sample-${_seq++}`, url });

const SAMPLE_PRODUCTS = [
  {
    id: 'p1', name: 'Aurora Bridal Kemis', albumId: 'a1',
    album: SAMPLE_ALBUMS[0],
    description: 'A luminous bridal Habesha Kemis in ivory silk blend, finished with hand-embroidered gold Tilet borders.',
    fabric: 'Silk Blend', price: 420, tailoringTime: '3-4 weeks', deliveryTime: '1-2 weeks',
    featured: true, badge: 'Bridal',
    images: [sampleImg(heroImg), sampleImg(ad9eImg), sampleImg(stylishHabeshaImg)],
  },
  {
    id: 'p2', name: 'Nigist Royal Gown', albumId: 'a1',
    album: SAMPLE_ALBUMS[0],
    description: 'A regal gown fit for royalty, featuring rich fabrics and elegant draping for the discerning bride.',
    fabric: 'Premium Silk Blend', price: 650, tailoringTime: '4-5 weeks', deliveryTime: '1-2 weeks',
    featured: true, badge: 'Limited',
    images: [sampleImg(weddingDetail), sampleImg(rubyHabesha), sampleImg(stylishHabeshaImg)],
  },
  {
    id: 'p3', name: 'Selam Kids Kemis', albumId: 'a2',
    album: SAMPLE_ALBUMS[1],
    description: 'Adorable traditional kemis for little ones, crafted with the same care and quality as our adult pieces.',
    fabric: 'Soft Cotton', price: 180, tailoringTime: '2 weeks', deliveryTime: '1 week',
    featured: false, badge: 'For Kids',
    images: [sampleImg(kidsImg), sampleImg(kids2Img), sampleImg(kidsDetail)],
  },
  {
    id: 'p4', name: 'Tiru Minimalist Kemis', albumId: 'a3',
    album: SAMPLE_ALBUMS[2],
    description: 'A clean, minimalist take on the traditional kemis — perfect for everyday elegance.',
    fabric: 'Lightweight Cotton', price: 240, tailoringTime: '2-3 weeks', deliveryTime: '1 week',
    featured: true, badge: 'Casual',
    images: [sampleImg(casualImg), sampleImg(casualSadexqayd), sampleImg(casualDesign2)],
  },
  {
    id: 'p5', name: 'Selam Festive Gown', albumId: 'a4',
    album: SAMPLE_ALBUMS[3],
    description: 'A stunning festive gown designed to make every celebration memorable.',
    fabric: 'Premium Cotton', price: 420, tailoringTime: '3-4 weeks', deliveryTime: '1-2 weeks',
    featured: true, badge: 'Bestseller',
    images: [sampleImg(holidayImg), sampleImg(holidayStylishImg), sampleImg(holidaysDesign)],
  },
  {
    id: 'p6', name: 'Habesha Ceremonial Robe', albumId: 'a4',
    album: SAMPLE_ALBUMS[3],
    description: 'A heritage ceremonial robe with authentic Habesha patterns for special occasions.',
    fabric: 'Handwoven Cotton', price: 380, tailoringTime: '3-4 weeks', deliveryTime: '1-2 weeks',
    featured: false, badge: 'Heritage',
    images: [sampleImg(holidaysDesign), sampleImg(casualSadexqayd), sampleImg(holidayStylishImg)],
  },
];

const USE_MOCK = !supabase;

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
  if (USE_MOCK) return { data: SAMPLE_PRODUCTS };

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

  // If Supabase has no products yet, show sample data so admin isn't empty
  if (!data || data.length === 0) return { data: SAMPLE_PRODUCTS };

  return {
    data: data.map((p) => ({
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
      albumId: p.album_id,
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
