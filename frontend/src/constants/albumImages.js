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

export const ALBUM_COVERS = {
  wedding: heroImg,
  'for-kids': kidsImg,
  casual: casualImg,
  holidays: holidayImg,
};

// Each product gets its own dedicated set of 3 images.
// No image is shared across products. When fewer than 3 unique
// photos of a dress are available, the primary image is duplicated
// so the carousel always has exactly 3 slides of that dress only.
const PRODUCT_IMAGE_MAP = {
  'Aurora Bridal Kemis':        [heroImg, ad9eImg, stylishHabeshaImg],
  'Nigist Royal Gown':          [weddingDetail, rubyHabesha, stylishHabeshaImg],
  'Selam Kids Kemis':           [kidsImg, kids2Img, kidsDetail],
  'Tiru Minimalist Kemis':      [casualImg, casualSadexqayd, casualImg],
  'Lumina Contemporary Kemis':  [casualDesign2, kids2Img, casualDesign2],
  'Selam Festive Gown':         [holidayImg, holidayStylishImg, holidayImg],
  'Habesha Ceremonial Robe':    [holidaysDesign, casualSadexqayd, holidaysDesign],
};

export function getAlbumCover(slug) {
  return ALBUM_COVERS[slug] || null;
}

export function getProductImages(productName) {
  return PRODUCT_IMAGE_MAP[productName] || null;
}

export function normalizeImages(images) {
  if (!images || images.length === 0) return [];
  if (images.length >= 3) return images.slice(0, 3);
  const primary = images[0];
  while (images.length < 3) images = [...images, primary];
  return images;
}
