const BASE = 'https://xlwaczrothwlqqyokfxu.supabase.co/storage/v1/object/public/album-images';

export const LOCAL_IMAGES = [
  { label: 'Hero — Bridal', url: `${BASE}/hero.jpg` },
  { label: 'Stylish Habesha Dress', url: `${BASE}/stylish_habesha.jpg` },
  { label: 'Casual Outfit', url: `${BASE}/casual.jpg` },
  { label: 'Holiday Dress', url: `${BASE}/holiday.jpg` },
  { label: 'Kids Dress', url: `${BASE}/kids.jpg` },
  { label: 'Kids Dress 2', url: `${BASE}/kids_2.jpg` },
  { label: 'Sadexqayd Somali Culture', url: `${BASE}/casual/Sadexqayd_Somali_culture.jpg` },
  { label: 'Casual Design 2', url: `${BASE}/casual/221731981650285425.jpg` },
  { label: 'For Kids Design', url: `${BASE}/for_kids/1084452785297173494.jpg` },
  { label: 'Holiday Stylish', url: `${BASE}/holiday/Stylish_habesha_dress.jpg` },
  { label: 'Holidays Design', url: `${BASE}/holidays/098_702_9147.jpg` },
  { label: 'Ruby Habesha Lebs', url: `${BASE}/new/RUBY_HABESHA_LEBS_0912280097.jpg` },
  { label: 'Wedding Dress', url: `${BASE}/wedding/741545894886734285.jpg` },
];

export function getLocalImageUrls() {
  return LOCAL_IMAGES.map((img) => img.url);
}
